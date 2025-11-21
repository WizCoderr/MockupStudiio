import React, { useState, useCallback } from 'react';
import { ProductType } from '../types';
import { generateMockup, generatePromoVideo } from '../services/geminiService';
import { LogoUploader } from './LogoUploader';
import { ProductSelector } from './ProductSelector';
import { Button } from './Button';

const App: React.FC = () => {
  // --- State ---
  
  // Mockup State
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>(ProductType.MUG);
  const [mockupPrompt, setMockupPrompt] = useState("");
  
  // Shared Result State
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Video State
  const [videoPrompt, setVideoPrompt] = useState("");
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // --- Handlers ---

  const handleLogoSelected = useCallback((base64: string) => {
    setLogo(base64 || null);
  }, []);

  const clearResults = () => {
    setGeneratedImage(null);
    setGeneratedVideo(null);
    setError(null);
    setVideoError(null);
  };

  const handleMockupGenerate = async () => {
    if (!logo) {
      setError("Please upload a logo first.");
      return;
    }
    setIsLoading(true);
    clearResults();

    try {
      // Construct a robust prompt for the Flash model
      const fullPrompt = `Create a realistic, high-quality product photo of a ${selectedProduct}. The product should feature the logo provided in the image input clearly applied to it. ${mockupPrompt ? `Additional details: ${mockupPrompt}` : ''}. Ensure the lighting is professional and the composition is clean.`;
      
      const resultImage = await generateMockup(logo, fullPrompt);
      setGeneratedImage(resultImage);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoGenerate = async () => {
    if (!generatedImage) return;
    
    setIsVideoLoading(true);
    setVideoError(null);
    setGeneratedVideo(null);

    try {
      const resultVideo = await generatePromoVideo(generatedImage, videoPrompt);
      setGeneratedVideo(resultVideo);
    } catch (err: any) {
      setVideoError(err.message);
    } finally {
      setIsVideoLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `mockup-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // --- Render ---
  // Palette: #2B3D4F (Bg), #3398DB (Blue), #E74D3C (Red), #F39C12 (Yellow), #EDF1F2 (Text)

  return (
    <div className="min-h-screen bg-[#2B3D4F] text-[#EDF1F2] font-sans selection:bg-[#3398DB]/30">
      {/* Header */}
      <header className="bg-[#2B3D4F]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-[#3398DB] to-[#2B3D4F] rounded-2xl flex items-center justify-center shadow-lg border border-white/10 rotate-3 hover:rotate-6 transition-transform duration-300">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Mockup<span className="text-[#3398DB]">Studio</span></h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT PANEL: Controls */}
          <div className="w-full lg:w-5/12 space-y-8">
            
            {/* Panel Title */}
            <div className="mb-6">
               <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
                 Visualize
               </h2>
               <p className="text-base text-[#EDF1F2]/70 leading-relaxed">
                 Upload a logo and instantly visualize it on premium merchandise.
               </p>
            </div>

            {/* --- MOCKUP CONTROLS --- */}
            <div className="space-y-8 animate-fadeIn">
              <section>
                <div className="flex items-center mb-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F39C12] text-[#2B3D4F] text-xs font-bold mr-2">1</span>
                  <label className="text-sm font-semibold text-[#EDF1F2]/90 uppercase tracking-wide">Upload Logo</label>
                </div>
                <LogoUploader onLogoSelected={handleLogoSelected} currentLogo={logo} />
              </section>

              <section>
                <div className="flex items-center mb-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F39C12] text-[#2B3D4F] text-xs font-bold mr-2">2</span>
                  <label className="text-sm font-semibold text-[#EDF1F2]/90 uppercase tracking-wide">Select Product</label>
                </div>
                <ProductSelector selectedProduct={selectedProduct} onSelect={setSelectedProduct} />
              </section>

              <section>
                <div className="flex items-center mb-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F39C12] text-[#2B3D4F] text-xs font-bold mr-2">3</span>
                  <label className="text-sm font-semibold text-[#EDF1F2]/90 uppercase tracking-wide">Customize (Optional)</label>
                </div>
                <textarea
                  value={mockupPrompt}
                  onChange={(e) => setMockupPrompt(e.target.value)}
                  placeholder='E.g., "On a rustic wooden table", "Add a retro filter", "Soft morning lighting"'
                  className="w-full bg-black/20 border border-[#EDF1F2]/10 rounded-2xl p-4 text-sm text-[#EDF1F2] focus:ring-2 focus:ring-[#3398DB] focus:border-transparent outline-none resize-none h-32 transition-all focus:bg-black/30 placeholder-gray-500"
                />
              </section>

              <Button 
                onClick={handleMockupGenerate} 
                fullWidth 
                size="lg"
                disabled={!logo || isLoading}
                isLoading={isLoading}
                className="shadow-lg shadow-black/20"
              >
                Generate Mockup
              </Button>
            </div>
          </div>

          {/* RIGHT PANEL: Results */}
          <div className="w-full lg:w-7/12">
             <div className="bg-black/20 rounded-[32px] min-h-[680px] flex flex-col relative overflow-hidden shadow-2xl border border-white/5 transition-all duration-500">
                {/* Result Header */}
                <div className="absolute top-6 right-6 z-10 flex space-x-2">
                   {generatedImage && !isLoading && (
                     <Button variant="secondary" size="sm" onClick={handleDownload} className="!py-2.5 !px-5 bg-black/50 backdrop-blur-md hover:bg-black/70 border border-white/10 text-white">
                        Download PNG
                     </Button>
                   )}
                </div>

                {/* Main Display Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                   
                   {/* Empty State */}
                   {!generatedImage && !isLoading && !error && (
                     <div className="text-center text-[#EDF1F2]/40 my-auto">
                        <div className="w-32 h-32 rounded-[32px] bg-white/5 mx-auto mb-6 flex items-center justify-center border border-white/5">
                           <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <p className="text-xl font-medium text-[#EDF1F2]">Ready to Create</p>
                        <p className="text-sm mt-2 text-[#EDF1F2]/50">Configure your settings on the left to begin.</p>
                     </div>
                   )}

                   {/* Loading State (Image) */}
                   {isLoading && (
                     <div className="flex flex-col items-center text-[#3398DB] my-auto">
                        <div className="w-20 h-20 border-4 border-[#3398DB]/20 border-t-[#3398DB] rounded-full animate-spin mb-6"></div>
                        <p className="animate-pulse font-medium text-lg">Creating your masterpiece...</p>
                     </div>
                   )}

                   {/* Error State */}
                   {error && (
                     <div className="max-w-md p-8 bg-[#E74D3C]/10 border border-[#E74D3C]/20 rounded-3xl text-center my-auto">
                        <div className="w-12 h-12 bg-[#E74D3C]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#E74D3C]">!</div>
                        <p className="text-[#E74D3C] font-medium mb-2 text-lg">Generation Failed</p>
                        <p className="text-sm text-[#E74D3C]/80 mb-6">{error}</p>
                        {error.includes("API Key") && (
                          <Button onClick={() => window.location.reload()} variant="secondary" size="sm">
                             Refresh to Reset Key
                          </Button>
                        )}
                     </div>
                   )}

                   {/* Success State (Image) */}
                   {generatedImage && !isLoading && (
                     <div className="w-full flex flex-col items-center animate-fadeIn">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/40 mb-8 border border-white/5">
                          <img 
                            src={generatedImage} 
                            alt="Generated Result" 
                            className="max-h-[550px] w-auto object-contain"
                          />
                        </div>

                        {/* --- VIDEO PROMO STUDIO SECTION --- */}
                        <div className="w-full max-w-3xl bg-white/5 rounded-3xl p-8 animate-slideUp border border-white/5 shadow-xl">
                           <div className="flex items-center justify-between mb-6">
                              <h3 className="text-xl font-bold text-white flex items-center">
                                <span className="mr-3 p-2 bg-[#F39C12]/20 rounded-lg text-[#F39C12]">🎬</span> Promo Video Studio
                              </h3>
                              <span className="text-xs font-medium bg-[#F39C12]/20 text-[#F39C12] px-3 py-1.5 rounded-full border border-[#F39C12]/30">Powered by Veo</span>
                           </div>

                           {!generatedVideo && !isVideoLoading && !videoError && (
                              <div className="space-y-5">
                                 <p className="text-sm text-[#EDF1F2]/70 leading-relaxed">Bring this mockup to life. Enter a prompt to generate a dynamic promotional video.</p>
                                 <div className="flex gap-3 flex-col sm:flex-row">
                                    <input 
                                       type="text" 
                                       value={videoPrompt}
                                       onChange={(e) => setVideoPrompt(e.target.value)}
                                       placeholder="E.g. Cinematic pan, dramatic lighting shift, slow rotation..." 
                                       className="flex-1 bg-black/30 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:ring-2 focus:ring-[#F39C12] outline-none placeholder-gray-500"
                                    />
                                    <Button 
                                       onClick={handleVideoGenerate}
                                       variant="primary" 
                                       className="whitespace-nowrap bg-[#F39C12] hover:bg-[#d68910] text-[#2B3D4F] rounded-full"
                                    >
                                       Generate Video
                                    </Button>
                                 </div>
                              </div>
                           )}

                           {isVideoLoading && (
                              <div className="py-10 text-center bg-black/20 rounded-2xl border border-white/10 border-dashed">
                                 <div className="w-10 h-10 border-4 border-[#F39C12]/30 border-t-[#F39C12] rounded-full animate-spin mx-auto mb-4"></div>
                                 <p className="text-base text-[#F39C12] font-medium">Generating video with Veo...</p>
                                 <p className="text-sm text-[#EDF1F2]/50 mt-2">This typically takes about 30-60 seconds</p>
                              </div>
                           )}

                           {videoError && (
                              <div className="bg-[#E74D3C]/10 border border-[#E74D3C]/20 rounded-2xl p-6 text-center">
                                 <p className="text-base text-[#E74D3C] mb-2 font-medium">Video Generation Failed</p>
                                 <p className="text-sm text-[#E74D3C]/70 mb-4">{videoError}</p>
                                 <Button size="sm" variant="secondary" onClick={() => setVideoError(null)}>Try Again</Button>
                              </div>
                           )}

                           {generatedVideo && (
                              <div className="space-y-4">
                                 <div className="rounded-2xl overflow-hidden shadow-lg bg-black aspect-video ring-1 ring-white/10">
                                   <video 
                                      src={generatedVideo} 
                                      controls 
                                      autoPlay 
                                      loop 
                                      className="w-full h-full object-contain"
                                   />
                                 </div>
                                 <div className="flex justify-between items-center px-1">
                                    <p className="text-xs text-[#EDF1F2]/50">Generated with Veo 3.1 Fast Preview</p>
                                    <Button 
                                       size="sm" 
                                       variant="secondary" 
                                       onClick={() => {
                                          const link = document.createElement('a');
                                          link.href = generatedVideo;
                                          link.download = `promo-video-${Date.now()}.mp4`;
                                          document.body.appendChild(link);
                                          link.click();
                                          document.body.removeChild(link);
                                       }}
                                       className="rounded-full"
                                    >
                                       Download Video
                                    </Button>
                                 </div>
                              </div>
                           )}
                        </div>

                     </div>
                   )}
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;