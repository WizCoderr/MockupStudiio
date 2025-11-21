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

  const clearLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLogoSelected("");
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="group">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div 
        onClick={!currentLogo ? triggerUpload : undefined}
        className={`relative overflow-hidden rounded-xl transition-all duration-200 border-2 ${
          currentLogo 
            ? 'border-[#3398DB]/30 bg-[#1F2B3A]' 
            : 'border-dashed border-white/10 hover:border-[#3398DB]/50 bg-[#1F2B3A] hover:bg-[#253345] cursor-pointer'
        }`}
      >
        {currentLogo ? (
          <div className="p-4 flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-lg bg-checkerboard border border-white/10 p-1 flex items-center justify-center overflow-hidden">
                <img 
                src={currentLogo} 
                alt="Logo" 
                className="w-full h-full object-contain"
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#EDF1F2] truncate">{fileName || "Uploaded Logo"}</p>
                <p className="text-xs text-[#EDF1F2]/50 mt-0.5">Ready for generation</p>
            </div>
            <div className="flex space-x-2">
                 <Button variant="ghost" size="sm" onClick={triggerUpload}>Change</Button>
                 <Button variant="danger" size="sm" onClick={clearLogo} className="!p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                 </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto h-10 w-10 text-[#EDF1F2]/40 mb-3 bg-white/5 rounded-lg flex items-center justify-center group-hover:text-[#3398DB] group-hover:scale-110 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-sm text-[#EDF1F2] font-medium">Click to upload logo</p>
            <p className="text-xs text-[#EDF1F2]/40 mt-1">PNG, JPG up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
};