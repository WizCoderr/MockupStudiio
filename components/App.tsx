import React, { useState, useCallback } from 'react';
import { AppMode, ProductType, ImageSize, AspectRatio } from '../types';
import { generateMockup, generateProImage, generatePromoVideo, ensurePaidApiKey } from '../services/geminiService';
import { LogoUploader } from './LogoUploader';
import { ProductSelector } from './ProductSelector';
import { Button } from './Button';

const App: React.FC = () => {
  // --- State ---
  const [mode, setMode] = useState<AppMode>(AppMode.LOGO_MOCKUP);
  
  // Mockup State
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>(ProductType.MUG);
  const [mockupPrompt, setMockupPrompt] = useState("");
  
  // Pro Generator State
  const [proPrompt, setProPrompt] = useState("");
  const [proSize, setProSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [proRatio, setProRatio] = useState<AspectRatio>(AspectRatio.SQUARE);

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

  const handleProGenerate = async () => {
    if (!proPrompt.trim()) {
      setError("Please enter a description for the image.");
      return;
    }
    setIsLoading(true);
    clearResults();

    try {
      // Check for key first
      try {
        await ensurePaidApiKey();
      } catch (keyErr) {
        throw new Error("Billing account selection failed or was cancelled.");
      }

      const resultImage = await generateProImage(proPrompt, proSize, proRatio);
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-200 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="bg-[#1e293b]/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">MockupStudio<span className="text-blue-400">AI</span></h1>
          </div>
          
          {/* Mode Switcher */}
          <div className="flex bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => { setMode(AppMode.LOGO_MOCKUP); clearResults(); }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === AppMode.LOGO_MOCKUP ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Quick Mockup
            </button>
            <button
              onClick={() => { setMode(AppMode.PRO_GENERATION); clearResults(); }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === AppMode.PRO_GENERATION ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Pro Studio ⚡
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT PANEL: Controls */}
          <div className="w-full lg:w-1/3 space-y-6">
            
            {/* Panel Title */}
            <div>
               <h2 className="text-2xl font-bold text-white mb-1">
                 {mode === AppMode.LOGO_MOCKUP ? 'Product Mockup' : 'Pro Generation'}
               </h2>
               <p className="text-sm text-gray-400">
                 {mode === AppMode.LOGO_MOCKUP 
                   ? 'Place your logo on realistic products instantly.' 
                   : 'Generate high-fidelity marketing assets in 4K.'}
               </p>
            </div>

            {/* --- MOCKUP MODE CONTROLS --- */}
            {mode === AppMode.LOGO_MOCKUP && (
              <div className="space-y-6 animate-fadeIn">
                <section>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">1. Upload Logo</label>
                  <LogoUploader onLogoSelected={handleLogoSelected} currentLogo={logo} />
                </section>

                <section>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">2. Select Product</label>
                  <ProductSelector selectedProduct={selectedProduct} onSelect={setSelectedProduct} />
                </section>

                <section>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">3. Customize (Optional)</label>
                  <textarea
                    value={mockupPrompt}
                    onChange={(e) => setMockupPrompt(e.target.value)}
                    placeholder='E.g., "On a rustic wooden table", "Add a retro filter", "Soft morning lighting"'
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-24"
                  />
                </section>

                <Button 
                  onClick={handleMockupGenerate} 
                  fullWidth 
                  disabled={!logo || isLoading}
                  isLoading={isLoading}
                >
                  Generate Mockup
                </Button>
                <p className="text-xs text-center text-gray-500">Powered by Gemini 2.5 Flash Image</p>
              </div>
            )}

            {/* --- PRO MODE CONTROLS --- */}
            {mode === AppMode.PRO_GENERATION && (
              <div className="space-y-6 animate-fadeIn">
                 <section>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Prompt</label>
                  <textarea
                    value={proPrompt}
                    onChange={(e) => setProPrompt(e.target.value)}
                    placeholder='Describe your image in detail. E.g., "A futuristic glass water bottle on a neon-lit rainy street, cyberpunk style, 8k resolution"'
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none h-32"
                  />
                </section>

                <div className="grid grid-cols-2 gap-4">
                  <section>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Size</label>
                    <select 
                      value={proSize}
                      onChange={(e) => setProSize(e.target.value as ImageSize)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                      <option value={ImageSize.SIZE_1K}>1K (Standard)</option>
                      <option value={ImageSize.SIZE_2K}>2K (HD)</option>
                      <option value={ImageSize.SIZE_4K}>4K (Ultra HD)</option>
                    </select>
                  </section>
                  <section>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Aspect Ratio</label>
                    <select 
                      value={proRatio}
                      onChange={(e) => setProRatio(e.target.value as AspectRatio)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                      <option value={AspectRatio.SQUARE}>Square (1:1)</option>
                      <option value={AspectRatio.PORTRAIT}>Portrait (9:16)</option>
                      <option value={AspectRatio.LANDSCAPE}>Landscape (16:9)</option>
                      <option value={AspectRatio.STANDARD}>Standard (4:3)</option>
                    </select>
                  </section>
                </div>

                <div className="bg-orange-900/20 border border-orange-800/50 p-4 rounded-lg">
                   <div className="flex items-start space-x-3">
                      <span className="text-orange-500 mt-0.5">⚠️</span>
                      <p className="text-xs text-orange-200 leading-relaxed">
                        Using Gemini 3 Pro requires a billed Google Cloud Project. You will be asked to select your project key when you click Generate.
                        <br/>
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-white mt-1 inline-block">Read Billing Docs</a>
                      </p>
                   </div>
                </div>

                <Button 
                  onClick={handleProGenerate} 
                  fullWidth 
                  disabled={!proPrompt || isLoading}
                  isLoading={isLoading}
                  variant="primary"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border-none shadow-orange-900/20"
                >
                  Generate High-Res Image
                </Button>
              </div>
            )}

          </div>

          {/* RIGHT PANEL: Results */}
          <div className="w-full lg:w-2/3">
             <div className="bg-[#162032] border border-gray-700/50 rounded-2xl min-h-[600px] flex flex-col relative overflow-hidden shadow-2xl transition-all duration-500">
                {/* Result Header */}
                <div className="absolute top-4 right-4 z-10 flex space-x-2">
                   {generatedImage && !isLoading && (
                     <Button variant="secondary" size="sm" onClick={handleDownload} className="!py-2 !px-3 text-xs bg-black/50 backdrop-blur-sm hover:bg-black/70 border-gray-600">
                        Download PNG
                     </Button>
                   )}
                </div>

                {/* Main Display Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                   
                   {/* Empty State */}
                   {!generatedImage && !isLoading && !error && (
                     <div className="text-center text-gray-500 my-auto">
                        <div className="w-24 h-24 rounded-full bg-gray-800/50 mx-auto mb-4 flex items-center justify-center">
                           <span className="text-4xl grayscale opacity-30">🖼️</span>
                        </div>
                        <p className="text-lg font-medium">Ready to Create</p>
                        <p className="text-sm mt-1">Configure your settings on the left and hit Generate.</p>
                     </div>
                   )}

                   {/* Loading State (Image) */}
                   {isLoading && (
                     <div className="flex flex-col items-center text-blue-400 my-auto">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                        <p className="animate-pulse font-medium">Creating your masterpiece...</p>
                        {mode === AppMode.PRO_GENERATION && <p className="text-xs text-gray-500 mt-2">This may take up to 30 seconds</p>}
                     </div>
                   )}

                   {/* Error State */}
                   {error && (
                     <div className="max-w-md p-6 bg-red-900/20 border border-red-800 rounded-xl text-center my-auto">
                        <p className="text-red-400 font-medium mb-2">Generation Failed</p>
                        <p className="text-sm text-red-200 opacity-80">{error}</p>
                        {error.includes("API Key") && (
                          <Button onClick={() => window.location.reload()} variant="secondary" className="mt-4 text-xs">
                             Refresh to Reset Key
                          </Button>
                        )}
                     </div>
                   )}

                   {/* Success State (Image) */}
                   {generatedImage && !isLoading && (
                     <div className="w-full flex flex-col items-center animate-fadeIn">
                        <img 
                          src={generatedImage} 
                          alt="Generated Result" 
                          className="max-h-[500px] w-auto object-contain rounded-lg shadow-2xl mb-8"
                        />

                        {/* --- VIDEO PROMO STUDIO SECTION --- */}
                        <div className="w-full max-w-2xl bg-gray-800/40 border border-gray-700 rounded-xl p-6 animate-slideUp">
                           <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-white flex items-center">
                                <span className="mr-2">🎬</span> Promo Video Studio
                              </h3>
                              <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded border border-purple-700/50">Powered by Veo</span>
                           </div>

                           {!generatedVideo && !isVideoLoading && !videoError && (
                              <div className="space-y-4">
                                 <p className="text-sm text-gray-400">Bring this mockup to life with a short promotional video.</p>
                                 <div className="flex gap-2">
                                    <input 
                                       type="text" 
                                       value={videoPrompt}
                                       onChange={(e) => setVideoPrompt(e.target.value)}
                                       placeholder="E.g. Cinematic pan, dramatic lighting shift, slow rotation..." 
                                       className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                    <Button 
                                       onClick={handleVideoGenerate}
                                       variant="primary" 
                                       className="whitespace-nowrap bg-purple-600 hover:bg-purple-500 text-white"
                                    >
                                       Generate Video
                                    </Button>
                                 </div>
                              </div>
                           )}

                           {isVideoLoading && (
                              <div className="py-8 text-center">
                                 <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3"></div>
                                 <p className="text-sm text-purple-300 font-medium">Generating video with Veo...</p>
                                 <p className="text-xs text-gray-500 mt-1">This typically takes about 30-60 seconds</p>
                              </div>
                           )}

                           {videoError && (
                              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 text-center">
                                 <p className="text-sm text-red-300 mb-2">Video Generation Failed</p>
                                 <p className="text-xs text-red-200 opacity-70 mb-3">{videoError}</p>
                                 <Button size="sm" variant="secondary" onClick={() => setVideoError(null)}>Try Again</Button>
                              </div>
                           )}

                           {generatedVideo && (
                              <div className="space-y-3">
                                 <video 
                                    src={generatedVideo} 
                                    controls 
                                    autoPlay 
                                    loop 
                                    className="w-full rounded-lg shadow-lg bg-black aspect-video"
                                 />
                                 <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-500">Generated with Veo 3.1 Fast Preview</p>
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