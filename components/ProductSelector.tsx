import React from 'react';
import { ProductType } from '../types';

interface ProductSelectorProps {
  selectedProduct: ProductType;
  onSelect: (product: ProductType) => void;
}

const products = [
  { id: ProductType.MUG, icon: "☕", label: "Mug" },
  { id: ProductType.TSHIRT, icon: "👕", label: "T-Shirt" },
  { id: ProductType.HOODIE, icon: "🧥", label: "Hoodie" },
  { id: ProductType.TOTE, icon: "👜", label: "Tote" },
  { id: ProductType.CAP, icon: "🧢", label: "Cap" },
  { id: ProductType.LAPTOP_STICKER, icon: "💻", label: "Sticker" },
];

export const ProductSelector: React.FC<ProductSelectorProps> = ({ selectedProduct, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {products.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`group relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-[#3398DB] focus:ring-offset-2 focus:ring-offset-[#2B3D4F] ${
            selectedProduct === p.id
              ? 'bg-[#3398DB]/10 border-[#3398DB] text-[#3398DB]' 
              : 'bg-[#1F2B3A] border-transparent hover:border-white/10 text-[#EDF1F2]/60 hover:text-[#EDF1F2]'
          }`}
        >
          <span className={`text-2xl mb-2 transition-transform duration-200 ${selectedProduct === p.id ? 'scale-110' : 'group-hover:scale-110'}`}>
            {p.icon}
          </span>
          <span className="text-xs font-medium">{p.label}</span>
          
          {/* Selected Indicator */}
          {selectedProduct === p.id && (
            <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#3398DB]"></div>
          )}
        </button>
      ))}
    </div>
  );
};