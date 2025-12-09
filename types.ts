export enum JewelryType {
  NECKLACE = "Necklace",
  EARRINGS = "Earrings",
  RING = "Ring",
}

export enum NecklaceLength {
  COLLAR = 'Collar (12-14")',
  CHOKER = 'Choker (14-16")',
  PRINCESS = 'Princess (17-19")',
  MATINEE = 'Matinee (20-24")',
  OPERA = 'Opera (28-36")',
  ROPE = 'Rope (Over 36")',
}

export enum StagingSurface {
  MARBLE = "Polished Marble",
  WOOD = "Smooth Wood Block",
  VELVET = "Rich Velvet Fabric",
  LINEN = "Natural Linen",
  SLATE = "Dark Slate Stone",
}

export enum LightingMood {
  SOFT = "Soft & Even",
  WARM = "Warm Golden",
  COOL = "Cool & Bright",
  DRAMATIC = "Dramatic & Moody",
}

export enum StagingLayout {
  FLAT_LAY = "Flat Lay (Aerial View)",
  DRAPED = "Draped on Surface",
  HANGING = "Hanging / Suspended",
}

export interface ProductDetails {
  name: string;
  type: JewelryType;
  stone: string;
  shape: string;
  material: string;
  visualCharacteristic: string;
  necklaceLength?: NecklaceLength;
  necklaceLengthValue?: string;
  claspType?: string;
  hookType?: string;
  accentDetail?: string;
  stagingProps?: string[];
  stagingSurface?: StagingSurface;
  lightingMood?: LightingMood;
  stagingLayout?: StagingLayout;
}

export enum AssetType {
  STAGING = "Staging Image",
  MODEL = "Model Try-On",
  WHITE_BG = "White Background",
  DESCRIPTION = "Product Description",
  SOCIAL_POST = "Social Media Post",
}

export interface GeneratedAsset {
  type: AssetType;
  content: string;
  isImage: boolean;
}
