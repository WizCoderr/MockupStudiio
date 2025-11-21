import React, { useState, useRef } from 'react';
import { Button } from './Button';

interface LogoUploaderProps {
  onLogoSelected: (base64: string) => void;
  currentLogo: string | null;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ onLogoSelected, currentLogo }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size too large. Please upload an image under 5MB.");
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onLogoSelected(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const clearLogo = () => {
    onLogoSelected("");
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${
          currentLogo 
            ? 'border-[#3398DB] bg-[#3398DB]/10' 
            : 'border-[#EDF1F2]/20 hover:border-[#3398DB]/50 bg-black/20 hover:bg-black/30'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {currentLogo ? (
          <div className="relative w-full flex flex-col items-center animate-fadeIn">
            <img 
              src={currentLogo} 
              alt="Uploaded Logo" 
              className="h-32 object-contain mb-6 rounded-2xl shadow-lg bg-white/5 p-2"
            />
            <div className="flex space-x-3">
              <Button variant="secondary" size="sm" onClick={triggerUpload}>Replace</Button>
              <Button variant="danger" size="sm" onClick={clearLogo}>Remove</Button>
            </div>
            <p className="mt-3 text-xs text-[#EDF1F2]/60 font-medium">{fileName}</p>
          </div>
        ) : (
          <div className="text-center cursor-pointer" onClick={triggerUpload}>
            <div className="mx-auto h-16 w-16 text-[#EDF1F2]/40 mb-4 bg-black/20 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-base text-[#EDF1F2] font-medium mb-1">Upload your logo</p>
            <p className="text-xs text-[#EDF1F2]/50">PNG, JPG up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
};