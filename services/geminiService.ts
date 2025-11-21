import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Helper to validate Env Key
const getEnvApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.warn("process.env.API_KEY is missing. Ensure you are in a valid environment.");
    return "";
  }
  return key;
};

// Helper to handle Paid Key Selection for Pro models
export const ensurePaidApiKey = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey && win.aistudio.openSelectKey) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await win.aistudio.openSelectKey();
    }
  }
};

/**
 * Generates a mockup by placing a logo onto a product using Gemini 2.5 Flash Image.
 * Uses the multimodal capabilities to "edit" or "composite" the image.
 */
export const generateMockup = async (
  logoBase64: string,
  prompt: string
): Promise<string> => {
  const apiKey = getEnvApiKey();
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  try {
    // Clean base64 string if it contains metadata prefix
    const cleanBase64 = logoBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG for logos usually, but could detect
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    return extractImageFromResponse(response);
  } catch (error: any) {
    console.error("Mockup generation failed:", error);
    throw new Error(error.message || "Failed to generate mockup");
  }
};

/**
 * Generates a short promotional video from a static image using Veo (veo-3.1-fast-generate-preview).
 * Requires a paid API key.
 */
export const generatePromoVideo = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  // 1. Ensure paid key
  await ensurePaidApiKey();

  const apiKey = getEnvApiKey();
  const ai = new GoogleGenAI({ apiKey });

  try {
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || "Cinematic product showcase, smooth camera movement, 4k, highly detailed",
      image: {
        imageBytes: cleanBase64,
        mimeType: 'image/png',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p', // Fast preview typically supports 720p
        aspectRatio: '16:9',
      }
    });

    // Polling loop
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
       throw new Error("Video generation completed but no video URI returned.");
    }

    // Fetch the actual video bytes using the API key
    const videoResponse = await fetch(`${videoUri}&key=${apiKey}`);
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video content: ${videoResponse.statusText}`);
    }

    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);

  } catch (error: any) {
    console.error("Video generation failed:", error);
    const win = window as any;
    if (error.message && error.message.includes("Requested entity was not found") && win.aistudio?.openSelectKey) {
       throw new Error("API Key invalid or expired. Please re-select your key.");
    }
    throw new Error(error.message || "Failed to generate video");
  }
};

// Helper to extract base64 image from the response structure
const extractImageFromResponse = (response: GenerateContentResponse): string => {
  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("No candidates returned from model.");
  }

  const parts = candidates[0].content.parts;
  for (const part of parts) {
    if (part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  // Fallback if model refuses and returns text (e.g., safety refusal)
  const textPart = parts.find(p => p.text);
  if (textPart) {
    throw new Error(`Model refused to generate image: ${textPart.text}`);
  }

  throw new Error("No image data found in response.");
};