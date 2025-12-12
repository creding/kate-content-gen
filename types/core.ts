export enum JewelryType {
  NECKLACE = "Necklace",
  EARRINGS = "Earrings",
  RING = "Ring",
  BRACELET = "Bracelet",
  OTHER = "Other",
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

export enum WhiteBgAngle {
  TOP_DOWN = "Top-Down (Aerial)",
  ANGLE_45 = "45° Angle",
  EYE_LEVEL = "Eye Level",
}

export enum WhiteBgFraming {
  CLOSE_UP = "Close-Up Detail",
  FULL_PRODUCT = "Full Product",
  WITH_PADDING = "With Padding",
}

export enum WhiteBgShadow {
  NONE = "No Shadow",
  SOFT = "Soft Shadow",
  REFLECTION = "Reflection",
}

export enum ModelSkinTone {
  LIGHT = "Light",
  MEDIUM = "Medium",
  OLIVE = "Olive",
  DEEP = "Deep",
}

export enum ModelShotType {
  CLOSE_UP = "Close-Up",
  PORTRAIT = "Portrait",
  LIFESTYLE = "Lifestyle",
}

export enum ModelBackground {
  STUDIO = "Studio Neutral",
  GRADIENT = "Soft Gradient",
  LIFESTYLE = "Blurred Lifestyle",
}

export enum ModelLighting {
  SOFT_NATURAL = "Soft Natural",
  GOLDEN_HOUR = "Golden Hour",
  STUDIO = "Studio Professional",
}

export enum ModelClothing {
  BLACK = "Black",
  WHITE = "White",
  CREAM = "Cream/Nude",
  GRAY = "Gray",
  NAVY = "Navy",
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
  whiteBgAngle?: WhiteBgAngle;
  whiteBgFraming?: WhiteBgFraming;
  whiteBgShadow?: WhiteBgShadow;
  modelSkinTone?: ModelSkinTone;
  modelShotType?: ModelShotType;
  modelBackground?: ModelBackground;
  modelLighting?: ModelLighting;
  modelClothing?: ModelClothing;
  // New fields for structured description
  stoneDimensions?: string;
  stoneGrade?: string;
  chainMaterial?: string;
  charmDetails?: string;
  idealWear?: string;
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
