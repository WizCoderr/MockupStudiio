import React, { useState, useCallback } from 'react';
import { ProductType } from '../types';
import { generateMockup } from '../services/geminiService';
import { LogoUploader } from './LogoUploader';
import { ProductSelector } from './ProductSelector';
import { Button } from './Button';

// Helper to get the emoji icon for the selected product to show in the preview
const getProductIcon = (type: ProductType) => {
  switch (type) {
    case ProductType.MUG: return "☕";
    case ProductType.TSHIRT: return "👕";
    case ProductType.HOODIE: return "🧥";
    case ProductType.TOTE: return "👜";
    case ProductType.CAP: return "🧢";
    case ProductType.LAPTOP_STICKER: return "💻";
    default: return "📦";
  }
};

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

  // --- Handlers ---

  const handleLogoSelected = useCallback((base64: string) => {
    setLogo(base64 || null);
  }, []);

  const clearResults = () => {
    setGeneratedImage(null);
    setError(null);
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
      const fullPrompt = `Create a realistic, high-quality product photo of a ${selectedProduct}. The product should feature the logo provided in the image input clearly applied to it. ${mockupPrompt ? `Additional details: ${mockupPrompt}` : ''}. Ensure the lighting is professional, the product material looks authentic, and the composition is clean and commercial.`;
      
      const resultImage = await generateMockup(logo, fullPrompt);
      setGeneratedImage(resultImage);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-[#2B3D4F] text-[#EDF1F2] font-sans selection:bg-[#3398DB]/30 flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#1F2B3A] border-b border-white/5 sticky top-0 z-50 h-16">
        <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-[#3398DB] rounded-lg flex items-center justify-center shadow-lg shadow-[#3398DB]/20">
               <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Mockup<span className="text-[#3398DB]">Studio</span></span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs font-medium text-[#EDF1F2]/40 border border-white/10 px-2 py-1 rounded">BETA</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 gap-6 flex flex-col lg:flex-row">
          
          {/* SIDEBAR: Configuration */}
          <aside className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-6">
            
            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white">Create Mockup</h1>
              <p className="text-sm text-[#EDF1F2]/60">Configure your product settings below.</p>
            </div>

            <div className="space-y-6">
              {/* Step 1: Logo */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#EDF1F2]/40 uppercase tracking-wider">1. Source Asset</label>
                <LogoUploader onLogoSelected={handleLogoSelected} currentLogo={logo} />
              </div>

              {/* Step 2: Product */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#EDF1F2]/40 uppercase tracking-wider">2. Select Canvas</label>
                <ProductSelector selectedProduct={selectedProduct} onSelect={setSelectedProduct} />
              </div>

              {/* Step 3: Prompt */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#EDF1F2]/40 uppercase tracking-wider">3. Customization</label>
                    <span className="text-[10px] text-[#F39C12] font-medium px-2 py-0.5 bg-[#F39C12]/10 rounded-full">Optional</span>
                </div>
                <textarea
                  value={mockupPrompt}
                  onChange={(e) => setMockupPrompt(e.target.value)}
                  placeholder='Describe the scene (e.g. "Morning sunlight, on a wooden desk")'
                  className="w-full bg-[#1F2B3A] border border-transparent focus:border-[#3398DB] rounded-xl p-4 text-sm text-[#EDF1F2] focus:ring-0 outline-none resize-none h-28 transition-all placeholder-white/20"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 mt-auto sticky bottom-0">
               <Button 
                onClick={handleMockupGenerate} 
                fullWidth 
                size="lg"
                disabled={!logo || isLoading}
                isLoading={isLoading}
                className="shadow-xl shadow-[#3398DB]/10"
              >
                Generate Mockup
              </Button>
            </div>
          </aside>

          {/* MAIN STAGE: Preview */}
          <section className="flex-1 bg-[#1F2B3A] rounded-2xl border border-white/5 relative flex flex-col overflow-hidden shadow-2xl">
            {/* Toolbar */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
                <span className="text-sm font-medium text-[#EDF1F2]/60">Studio Canvas</span>
                {generatedImage && !isLoading && (
                    <Button variant="secondary" size="sm" onClick={handleDownload}>
                       Download High-Res
                    </Button>
                )}
            </div>

            {/* Canvas Area - NOW WITH CHECKERBOARD BACKGROUND */}
            <div className="flex-1 flex items-center justify-center p-8 bg-checkerboard relative">
                 {/* State Handling */}
                 
                 {/* 1. Empty State - Updated with Visual Preview */}
                 {!generatedImage && !isLoading && !error && (
                   <div className="text-center max-w-md p-8 backdrop-blur-sm bg-[#1F2B3A]/90 rounded-2xl border border-white/10 shadow-xl">
                      <div className="w-24 h-24 bg-[#2B3D4F] rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-inner text-5xl">
                          {getProductIcon(selectedProduct)}
                      </div>
                      <h3 className="text-lg font-bold text-[#EDF1F2]">Ready to Render</h3>
                      <p className="text-sm text-[#EDF1F2]/60 mt-2">
                        You are set to generate a <strong>{selectedProduct}</strong> mockup. 
                        Click "Generate Mockup" to start the AI rendering process.
                      </p>
                   </div>
                 )}

                 {/* 2. Loading State */}
                 {isLoading && (
                    <div className="text-center backdrop-blur-md bg-[#1F2B3A]/80 p-8 rounded-3xl border border-white/5 shadow-2xl z-10">
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-[#3398DB]/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-[#3398DB] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-lg font-medium text-[#EDF1F2] animate-pulse">Rendering {selectedProduct}...</h3>
                        <p className="text-sm text-[#EDF1F2]/50 mt-2">Applying logo and lighting</p>
                    </div>
                 )}

                 {/* 3. Error State */}
                 {error && (
                    <div className="max-w-md w-full bg-[#1F2B3A] border border-[#E74D3C]/30 rounded-xl p-6 text-center shadow-2xl">
                        <div className="w-10 h-10 bg-[#E74D3C]/10 text-[#E74D3C] rounded-lg flex items-center justify-center mx-auto mb-3">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-[#E74D3C] font-medium">Generation Failed</h3>
                        <p className="text-sm text-[#E74D3C]/80 mt-1 mb-4">{error}</p>
                        <Button variant="secondary" size="sm" onClick={() => setError(null)}>Dismiss</Button>
                    </div>
                 )}

                 {/* 4. Success State */}
                 {generatedImage && !isLoading && (
                    <div className="relative group w-full h-full flex items-center justify-center">
                        <img 
                            src={generatedImage} 
                            alt="Generated Mockup" 
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                 )}
            </div>
          </section>
      </main>
    </div>
  );
};

export default App;