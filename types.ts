export enum JewelryType {
  NECKLACE = 'Necklace',
  EARRINGS = 'Earrings',
  RING = 'Ring',
}

export enum NecklaceLength {
  COLLAR = 'Collar (12-14")',
  CHOKER = 'Choker (14-16")',
  PRINCESS = 'Princess (17-19")',
  MATINEE = 'Matinee (20-24")',
  OPERA = 'Opera (28-36")',
  ROPE = 'Rope (Over 36")',
}

export interface ProductDetails {
  name: string;
  type: JewelryType;
  stone: string;
  shape: string;
  material: string;
  visualCharacteristic: string;
  necklaceLength?: NecklaceLength; // For prompt injection
  necklaceLengthValue?: string; // For text description
  claspType?: string;
  hookType?: string; // For earrings
  accentDetail?: string;
  stagingProps?: string[]; // New: List of selected props for staging
}

export enum AssetType {
  STAGING = 'Staging Image',
  MODEL = 'Model Try-On',
  WHITE_BG = 'White Background',
  DESCRIPTION = 'Product Description',
  SOCIAL_POST = 'Social Media Post',
}

export interface GeneratedAsset {
  type: AssetType;
  content: string; // URL for image, Text for copy
  isImage: boolean;
}