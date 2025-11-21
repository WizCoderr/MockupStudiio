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
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors ${currentLogo ? 'border-blue-500 bg-blue-500/5' : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {currentLogo ? (
          <div className="relative w-full flex flex-col items-center">
            <img 
              src={currentLogo} 
              alt="Uploaded Logo" 
              className="h-32 object-contain mb-4 rounded-lg shadow-lg"
            />
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm" onClick={triggerUpload}>Replace</Button>
              <Button variant="danger" size="sm" onClick={clearLogo}>Remove</Button>
            </div>
            <p className="mt-2 text-xs text-gray-400">{fileName}</p>
          </div>
        ) : (
          <div className="text-center" onClick={triggerUpload}>
            <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-300 font-medium mb-1">Click to upload your logo</p>
            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
            <Button variant="secondary" className="mt-4 pointer-events-none">Select Image</Button>
          </div>
        )}
      </div>
    </div>
  );
};
