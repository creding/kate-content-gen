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
  SIDE_VIEW = "Side View",
  THREE_QUARTER = "3/4 View",
  FLAT_LAY = "Flat Lay",
  DYNAMIC_PAIR = "Dynamic Pair (Front & Side)",
}

export enum WhiteBgFraming {
  FULL_PRODUCT = "Full Product",
  CLOSE_UP = "Detailed Close-Up",
  MACRO = "Extreme Macro (Texture)",
}

export enum WhiteBgShadow {
  NONE = "No Shadow (Pure White)",
  NATURAL = "Soft Natural Shadow",
  REFLECTION = "Reflection",
}

export enum ModelSkinTone {
  LIGHT = "Light",
  TAN = "Tan",
  DARK = "Dark",
}

export enum ModelShotType {
  CLOSE_UP = "Close-Up (Jewelry Focus)",
  PORTRAIT = "Portrait (Head & Shoulders)",
  BUST = "Bust (Upper Body)",
}

export enum ModelBackground {
  STUDIO = "Studio Neutral",
  GRADIENT = "Soft Gradient",
  LIFESTYLE = "Blurred Lifestyle",
  ELEGANT = "Elegant Lifestyle",
}

export enum ModelLighting {
  SOFT_NATURAL = "Soft Natural",
  STUDIO_DRAMATIC = "Studio Dramatic",
  GOLDEN_HOUR = "Golden Hour",
}

export enum ModelClothingColor {
  WHITE = "White",
  BLACK = "Black",
  NEUTRAL = "Neutral/Beige",
  PASTEL = "Soft Pastel",
}

export enum ModelClothingType {
  BLOUSE = "Blouse",
  SHIRT = "Shirt",
  DRESS = "Dress",
  TOP = "Simple Top",
  TURTLENECK = "Turtleneck",
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
  modelClothingColor?: ModelClothingColor;
  modelClothingType?: ModelClothingType;
  // New fields for structured description
  stoneDimensions?: string;
  stoneGrade?: string;
  chainMaterial?: string;
  charmDetails?: string;
  idealWear?: string;
  earringLength?: EarringLength;
  stoneCount?: StoneCount;
  // Multi-stone support
  detailedGemstones?: {
    type: string;
    dimensions: string;
    shape: string;
    grade?: string;
    count?: string;
  }[];
}

export enum EarringLength {
  STUD = "Stud / Button",
  HUGGIE = "Huggie / Small Hoop",
  SHORT_DROP = 'Short Drop (0.5"-1")',
  MEDIUM_DROP = 'Medium Drop (1"-2")',
  LONG_DROP = 'Long Drop (2"+)',
  SHOULDER = "Shoulder Duster",
  HOOP = "Large Hoop",
}

export enum StoneCount {
  ONE = "Solitaire / One Stone",
  TWO = "Two Stones / Moi et Toi",
  THREE = "Three Stones / Trinity",
  MULTI = "Multi-Stone / Pave",
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
