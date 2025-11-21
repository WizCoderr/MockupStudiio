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
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {products.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 aspect-square ${
            selectedProduct === p.id
              ? 'bg-[#3398DB] border-[#3398DB] text-white shadow-lg' // Active State
              : 'bg-black/20 border-transparent text-[#EDF1F2]/60 hover:bg-black/30 hover:text-[#EDF1F2]' // Inactive State
          }`}
        >
          <span className="text-2xl mb-2">{p.icon}</span>
          <span className="text-xs font-semibold">{p.label}</span>
        </button>
      ))}
    </div>
  );
};