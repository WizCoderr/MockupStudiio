export enum ProductType {
  MUG = 'Ceramic Coffee Mug',
  TSHIRT = 'Cotton T-Shirt',
  HOODIE = 'Pullover Hoodie',
  TOTE = 'Canvas Tote Bag',
  LAPTOP_STICKER = 'Laptop Sticker',
  CAP = 'Baseball Cap'
}

export interface GenerationResult {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}