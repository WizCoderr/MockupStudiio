export enum AppMode {
  LOGO_MOCKUP = 'LOGO_MOCKUP',
  PRO_GENERATION = 'PRO_GENERATION',
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K',
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9',
  STANDARD = '4:3',
  WIDESCREEN = '3:4' // Reversing standard terminology slightly to match API expectation or UI logic
}

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
