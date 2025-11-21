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