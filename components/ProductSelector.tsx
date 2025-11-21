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
          className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
            selectedProduct === p.id
              ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-900/20'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750 hover:border-gray-600'
          }`}
        >
          <span className="text-2xl mb-1">{p.icon}</span>
          <span className="text-xs font-medium">{p.label}</span>
        </button>
      ))}
    </div>
  );
};
