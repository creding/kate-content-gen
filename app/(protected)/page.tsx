"use client";

import React, { useState, useEffect } from "react";
import {
  AssetType,
  GeneratedAsset,
  JewelryType,
  ProductDetails,
  NecklaceLength,
  ModelSkinTone,
  ModelClothing,
  ModelShotType,
  ModelBackground,
  ModelLighting,
  StagingLayout,
  StagingSurface,
  LightingMood,
  WhiteBgAngle,
  WhiteBgFraming,
  WhiteBgShadow,
} from "@/types";
import { PromptTemplateKey } from "@/prompts";
import {
  Image,
  Sparkles,
  User,
  FileText,
  Share2,
  Upload,
  X,
  CheckCircle2,
  Circle,
  Camera,
  Palette,
  ClipboardList,
} from "lucide-react";

import InputForm from "@/components/InputForm";
import AssetCard from "@/components/AssetCard";
import AssetSelector from "@/components/AssetSelector";
import Lightbox from "@/components/Lightbox";
import { usePrompts } from "@/contexts/PromptContext";
import { useToast } from "@/contexts/ToastContext";
import { useBrand } from "@/contexts/BrandContext";
import {
  generateAssetAction,
  detectJewelryTypeAction,
} from "@/app/actions/gemini";
import { Button, Card, cn } from "@/components/ui";

// Friendly asset type definitions
const ASSET_TYPE_INFO: Record<
  AssetType,
  { label: string; description: string; icon: React.ElementType }
> = {
  [AssetType.WHITE_BG]: {
    label: "Clean Product Shot",
    description: "E-commerce ready, pure white background",
    icon: Image,
  },
  [AssetType.STAGING]: {
    label: "Lifestyle Scene",
    description: "Elegant staging with props & brand tag",
    icon: Sparkles,
  },
  [AssetType.MODEL]: {
    label: "Model Showcase",
    description: "Jewelry worn on a model",
    icon: User,
  },
  [AssetType.DESCRIPTION]: {
    label: "Product Description",
    description: "SEO-friendly copy for listings",
    icon: FileText,
  },
  [AssetType.SOCIAL_POST]: {
    label: "Social Media Post",
    description: "Engaging caption with hashtags",
    icon: Share2,
  },
};

const Studio: React.FC = () => {
  const { renderPrompt } = usePrompts();
  const { addToast } = useToast();
  const { settings: brandSettings, getEffectiveLogo } = useBrand();

  const [files, setFiles] = useState<File[]>([]);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [regeneratingAsset, setRegeneratingAsset] = useState<AssetType | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("visuals");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [selectedAssets, setSelectedAssets] = useState<AssetType[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);

  // Initialize details with brand defaults
  const [details, setDetails] = useState<ProductDetails>({
    name: "",
    type: JewelryType.NECKLACE,
    stone: "",
    shape: "",
    material: "",
    visualCharacteristic: "",
    necklaceLengthValue: "",
    accentDetail: brandSettings.defaultAccentDetail,
    claspType: brandSettings.defaultClaspType,
    // Staging image defaults
    stagingLayout: StagingLayout.DRAPED,
    stagingSurface: StagingSurface.MARBLE,
    lightingMood: LightingMood.SOFT,
    stagingProps: ["Gift Box", "Silk Ribbon", "Linen Fabric"],
    // Clean product shot defaults
    whiteBgAngle: WhiteBgAngle.TOP_DOWN,
    whiteBgFraming: WhiteBgFraming.CLOSE_UP,
    whiteBgShadow: WhiteBgShadow.NONE,
    // Model showcase defaults
    necklaceLength: NecklaceLength.CHOKER,
    modelSkinTone: ModelSkinTone.LIGHT,
    modelClothing: ModelClothing.WHITE,
    modelShotType: ModelShotType.CLOSE_UP,
    modelBackground: ModelBackground.STUDIO,
    modelLighting: ModelLighting.SOFT_NATURAL,
  });

  // Update defaults when brand settings change
  useEffect(() => {
    setDetails((prev) => ({
      ...prev,
      accentDetail: prev.accentDetail || brandSettings.defaultAccentDetail,
      claspType: prev.claspType || brandSettings.defaultClaspType,
    }));
  }, [brandSettings.defaultAccentDetail, brandSettings.defaultClaspType]);

  // Convert logo (default or custom) to File object for API
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);

  useEffect(() => {
    const loadLogo = async () => {
      const logoUrl = getEffectiveLogo();
      if (!logoUrl) {
        setBrandLogoFile(null);
        return;
      }

      try {
        // If it's a data URL (custom upload)
        if (logoUrl.startsWith("data:")) {
          const arr = logoUrl.split(",");
          const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          setBrandLogoFile(
            new File([u8arr], brandSettings.logoFileName || "logo.png", {
              type: mime,
            })
          );
        } else {
          // It's a path (default logo) - fetch it
          const response = await fetch(logoUrl);
          const blob = await response.blob();
          const fileName = logoUrl.split("/").pop() || "jewelry-tag.jpg";
          setBrandLogoFile(new File([blob], fileName, { type: blob.type }));
        }
      } catch (err) {
        console.error("Failed to load logo:", err);
        setBrandLogoFile(null);
      }
    };

    loadLogo();
  }, [getEffectiveLogo, brandSettings.logoFileName]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(newFiles);

      // Auto-detect jewelry type from first image
      setIsDetecting(true);
      try {
        const formData = new FormData();
        formData.append("file", newFiles[0]);
        const detectedType = await detectJewelryTypeAction(formData);
        setDetails((prev) => ({ ...prev, type: detectedType }));
        addToast(`Detected: ${detectedType}`, "success");
      } catch (err) {
        console.error("Auto-detect failed:", err);
      } finally {
        setIsDetecting(false);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAssetSelection = (type: AssetType) => {
    setSelectedAssets((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const getTemplateKey = (
    assetType: AssetType,
    details: ProductDetails
  ): PromptTemplateKey => {
    switch (assetType) {
      case AssetType.STAGING:
        return "STAGING";
      case AssetType.MODEL:
        if (details.type === JewelryType.NECKLACE) return "MODEL_NECKLACE";
        if (details.type === JewelryType.EARRINGS) return "MODEL_EARRINGS";
        return "MODEL_RING";
      case AssetType.WHITE_BG:
        if (details.type === JewelryType.EARRINGS) return "WHITE_BG_EARRINGS";
        return "WHITE_BG_GENERAL";
      case AssetType.DESCRIPTION:
        if (details.type === JewelryType.EARRINGS)
          return "DESCRIPTION_EARRINGS";
        return "DESCRIPTION_NECKLACE";
      case AssetType.SOCIAL_POST:
        return "SOCIAL";
      default:
        return "WHITE_BG_GENERAL";
    }
  };

  const getPromptVariables = (details: ProductDetails) => {
    const propsInstruction =
      details.stagingProps && details.stagingProps.length > 0
        ? `Add props such as ${details.stagingProps.join(
            ", "
          )} that accent the ${details.type.toLowerCase()}.`
        : "";

    const typeSpecificInstruction =
      details.type === JewelryType.EARRINGS
        ? "Lay the earrings flat and have the camera lens be from above to give an aerial viewpoint."
        : "Do not add any lengths to the piece.";

    // Surface instruction
    const surfaceInstruction = details.stagingSurface
      ? `a luxurious ${details.stagingSurface.toLowerCase()} surface`
      : "a luxurious, minimalist surface such as polished marble or smooth wood";

    // Lighting instruction
    const lightingMap: Record<string, string> = {
      "Soft & Even":
        "The lighting should be soft, even, and professional, designed to highlight the intricate details, texture, and brilliance of the materials.",
      "Warm Golden":
        "The lighting should be warm and golden, creating a cozy, inviting atmosphere that brings out the warmth of the metals and stones.",
      "Cool & Bright":
        "The lighting should be cool and bright, creating a clean, modern look that emphasizes clarity and sparkle.",
      "Dramatic & Moody":
        "The lighting should be dramatic with deep shadows and selective highlights, creating an artistic, editorial atmosphere.",
    };
    const lightingInstruction = details.lightingMood
      ? lightingMap[details.lightingMood] || lightingMap["Soft & Even"]
      : lightingMap["Soft & Even"];

    // Layout instruction
    const layoutMap: Record<string, string> = {
      "Flat Lay (Aerial View)":
        "laid flat with the camera positioned directly above for a clean aerial view",
      "Draped on Surface":
        "elegantly draped, with natural curves resting on the surface",
      "Hanging / Suspended":
        "suspended or hanging, showing its natural drape and length",
    };
    const layoutInstruction = details.stagingLayout
      ? layoutMap[details.stagingLayout] || layoutMap["Flat Lay (Aerial View)"]
      : "elegantly placed";

    // White Background instructions
    const whiteBgAngleMap: Record<string, string> = {
      "Top-Down (Aerial)":
        "- Camera positioned directly above for a flat, aerial view",
      "45° Angle": "- Camera at a 45-degree angle for depth and dimension",
      "Eye Level": "- Camera at eye level for a straight-on view",
    };
    const whiteBgAngleInstruction = details.whiteBgAngle
      ? whiteBgAngleMap[details.whiteBgAngle] ||
        whiteBgAngleMap["Top-Down (Aerial)"]
      : "- Camera positioned for optimal product visibility";

    const whiteBgFramingMap: Record<string, string> = {
      "Close-Up Detail":
        "- Tight framing, emphasizing fine details and craftsmanship",
      "Full Product": "- Full product visible, centered in frame",
      "With Padding":
        "- Generous white space around the product for flexibility",
    };
    const whiteBgFramingInstruction = details.whiteBgFraming
      ? whiteBgFramingMap[details.whiteBgFraming] ||
        whiteBgFramingMap["Full Product"]
      : "- Product centered with appropriate framing";

    const whiteBgShadowMap: Record<string, string> = {
      "No Shadow":
        "- ZERO shadow, pure white underneath, no drop shadow whatsoever",
      "Soft Shadow":
        "- Subtle, soft shadow for depth while keeping background clean",
      Reflection: "- Gentle mirror-like reflection below the product",
    };
    const whiteBgShadowInstruction = details.whiteBgShadow
      ? whiteBgShadowMap[details.whiteBgShadow] || whiteBgShadowMap["No Shadow"]
      : "- No shadow, pure white background";

    // Model instructions
    const modelSkinToneMap: Record<string, string> = {
      Light: "- Model with light/fair skin tone",
      Medium: "- Model with medium/tan skin tone",
      Olive: "- Model with olive skin tone",
      Deep: "- Model with deep/dark skin tone",
    };
    const modelSkinToneInstruction = details.modelSkinTone
      ? modelSkinToneMap[details.modelSkinTone] || modelSkinToneMap["Medium"]
      : "- Model with natural, healthy skin";

    const modelClothingMap: Record<string, string> = {
      Black: "- Wearing a simple black top/shirt",
      White: "- Wearing a clean white top/shirt",
      "Cream/Nude": "- Wearing a cream or nude colored top",
      Gray: "- Wearing a gray top/shirt",
      Navy: "- Wearing a navy blue top/shirt",
    };
    const modelClothingInstruction = details.modelClothing
      ? modelClothingMap[details.modelClothing] || modelClothingMap["Black"]
      : "- Wearing simple, neutral clothing";

    const modelShotTypeMap: Record<string, string> = {
      "Close-Up": "- Close-up shot focusing tightly on the jewelry area",
      Portrait: "- Portrait shot showing head and shoulders",
      Lifestyle: "- Wider lifestyle shot with environmental context",
    };
    const modelShotTypeInstruction = details.modelShotType
      ? modelShotTypeMap[details.modelShotType] || modelShotTypeMap["Close-Up"]
      : "- Elegant framing focused on the jewelry";

    const modelBackgroundMap: Record<string, string> = {
      "Studio Neutral": "- Clean, neutral studio background",
      "Soft Gradient": "- Soft gradient background transitioning subtly",
      "Blurred Lifestyle": "- Blurred lifestyle/environmental background",
    };
    const modelBackgroundInstruction = details.modelBackground
      ? modelBackgroundMap[details.modelBackground] ||
        modelBackgroundMap["Studio Neutral"]
      : "- Clean, non-distracting background";

    const modelLightingMap: Record<string, string> = {
      "Soft Natural": "- Soft, natural lighting",
      "Golden Hour": "- Warm, golden hour lighting for an aspirational feel",
      "Studio Professional": "- Professional studio lighting setup",
    };
    const modelLightingInstruction = details.modelLighting
      ? modelLightingMap[details.modelLighting] ||
        modelLightingMap["Soft Natural"]
      : "- Beautiful, flattering lighting";

    return {
      ...details,
      propsInstruction,
      typeSpecificInstruction,
      surfaceInstruction,
      lightingInstruction,
      layoutInstruction,
      whiteBgAngleInstruction,
      whiteBgFramingInstruction,
      whiteBgShadowInstruction,
      modelSkinToneInstruction,
      modelClothingInstruction,
      modelShotTypeInstruction,
      modelBackgroundInstruction,
      modelLightingInstruction,
      type: details.type.toLowerCase(),
    };
  };

  const handleGenerate = async () => {
    if (files.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    if (selectedAssets.length === 0) {
      setError("Please select at least one asset type to generate.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const hasVisuals = selectedAssets.some((a) =>
      [AssetType.STAGING, AssetType.MODEL, AssetType.WHITE_BG].includes(a)
    );
    setActiveTab(hasVisuals ? "visuals" : "copy");

    try {
      const promises = selectedAssets.map((assetType) => {
        const templateKey = getTemplateKey(assetType, details);
        const variables = getPromptVariables(details);
        const prompt = renderPrompt(templateKey, variables);

        // Use brand logo for staging if available
        const logoToUse =
          assetType === AssetType.STAGING ? brandLogoFile : null;

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("assetType", assetType);
        formData.append("prompt", prompt);
        if (logoToUse) {
          formData.append("logoFile", logoToUse);
        }

        return generateAssetAction(formData);
      });

      const results = await Promise.allSettled(promises);

      const successfulAssets: GeneratedAsset[] = [];
      const errors: string[] = [];

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          successfulAssets.push(result.value);
        } else {
          errors.push(result.reason?.message || "Unknown error");
        }
      });

      setGeneratedAssets(successfulAssets);

      if (successfulAssets.length > 0) {
        addToast(
          `Generated ${successfulAssets.length} asset${
            successfulAssets.length > 1 ? "s" : ""
          }!`,
          "success"
        );
      }

      if (errors.length > 0) {
        setError(`Some assets failed: ${errors.join(", ")}`);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      addToast("Generation failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (assetType: AssetType) => {
    if (files.length === 0) return;

    setRegeneratingAsset(assetType);
    try {
      const templateKey = getTemplateKey(assetType, details);
      const variables = getPromptVariables(details);
      const prompt = renderPrompt(templateKey, variables);
      const logoToUse = assetType === AssetType.STAGING ? brandLogoFile : null;

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("assetType", assetType);
      formData.append("prompt", prompt);
      if (logoToUse) {
        formData.append("logoFile", logoToUse);
      }

      const newAsset = await generateAssetAction(formData);

      setGeneratedAssets((prev) =>
        prev.map((a) => (a.type === assetType ? newAsset : a))
      );
      addToast(`${ASSET_TYPE_INFO[assetType].label} regenerated!`, "success");
    } catch (err: any) {
      addToast(`Failed to regenerate: ${err.message}`, "error");
    } finally {
      setRegeneratingAsset(null);
    }
  };

  const visualAssets = generatedAssets.filter((a) => a.isImage);
  const textAssets = generatedAssets.filter((a) => !a.isImage);

  // Lightbox images
  const lightboxImages = visualAssets.map((a) => ({
    src: a.content,
    label: ASSET_TYPE_INFO[a.type]?.label || a.type,
  }));

  const openLightbox = (assetType: AssetType) => {
    const index = visualAssets.findIndex((a) => a.type === assetType);
    if (index >= 0) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  const visualTypes = [AssetType.WHITE_BG, AssetType.STAGING, AssetType.MODEL];

  // Smart field visibility
  const needsCopywritingFields = selectedAssets.some((a) =>
    [AssetType.DESCRIPTION, AssetType.SOCIAL_POST].includes(a)
  );
  const needsStagingFields = selectedAssets.includes(AssetType.STAGING);
  const needsModelFields = selectedAssets.includes(AssetType.MODEL);
  const needsWhiteBgFields = selectedAssets.includes(AssetType.WHITE_BG);

  // Step completion
  const step1Complete = files.length > 0;
  const step2Complete = selectedAssets.length > 0;
  const step3Complete = details.name.trim() !== "" || !needsCopywritingFields;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* LEFT SIDEBAR - WIZARD */}
      <div className="xl:col-span-4 space-y-6">
        {/* STEP 1: PHOTOS (NOW FIRST) */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors",
                step1Complete ? "bg-accent text-white" : "bg-primary text-white"
              )}
            >
              {step1Complete ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Upload Photos
              </h2>
              <p className="text-[10px] text-muted-foreground">
                Start with your raw product images
              </p>
            </div>
          </div>

          <div className="group relative border-2 border-dashed border-border rounded-xl p-5 text-center hover:bg-background/80 transition-all hover:border-zinc-300 cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isLoading}
            />
            <div className="flex flex-col items-center pointer-events-none">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:bg-muted transition-colors">
                <Upload className="h-5 w-5" />
              </div>
              <span className="block text-sm font-medium text-foreground">
                {files.length > 0
                  ? `${files.length} image${files.length > 1 ? "s" : ""} ready`
                  : "Click or drag to upload"}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                PNG, JPG
              </span>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square bg-secondary rounded-lg overflow-hidden border border-border group/thumb"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* STEP 2: SELECT ASSETS */}
        <Card
          className={cn(
            "p-6 transition-opacity",
            !step1Complete && "opacity-60 pointer-events-none"
          )}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors",
                step2Complete
                  ? "bg-accent text-white"
                  : step1Complete
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step2Complete ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Palette className="w-3.5 h-3.5" />
              )}
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              Choose Assets
            </h2>
          </div>

          <div className="space-y-4">
            {/* Jewelry Type - Subtle Inline Display */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                {isDetecting ? (
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Detecting jewelry type...
                  </span>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/20 text-accent-foreground text-sm font-medium rounded-full border border-accent">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {details.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      detected
                    </span>
                  </>
                )}
              </div>

              {/* Dropdown to change */}
              <div className="relative">
                <select
                  value={details.type}
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      type: e.target.value as JewelryType,
                    }))
                  }
                  className="appearance-none text-xs text-muted-foreground hover:text-foreground cursor-pointer bg-transparent pr-5 focus:outline-none"
                >
                  {Object.values(JewelryType).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Visual Assets
              </h3>
              <div className="space-y-2">
                {visualTypes.map((type) => {
                  const info = ASSET_TYPE_INFO[type];
                  return (
                    <AssetSelector
                      key={type}
                      assetType={type}
                      label={info.label}
                      icon={info.icon}
                      isSelected={selectedAssets.includes(type)}
                      onToggle={() => toggleAssetSelection(type)}
                      details={details}
                      setDetails={setDetails}
                      isLoading={isLoading}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-6 pt-5 border-t border-border">
            <Button
              onClick={handleGenerate}
              disabled={
                isLoading || files.length === 0 || selectedAssets.length === 0
              }
              className="w-full h-11 text-sm shadow-lg shadow-primary/10"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                `Generate ${selectedAssets.length} Asset${
                  selectedAssets.length !== 1 ? "s" : ""
                }`
              )}
            </Button>

            {error && (
              <div className="mt-3 p-2.5 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 text-center font-medium">
                {error}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* RIGHT CONTENT - RESULTS */}
      <div className="xl:col-span-8 lg:sticky lg:top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl">
        <div className="flex-grow">
          {isLoading && (
            <div className="h-[450px] flex flex-col items-center justify-center bg-card/50 rounded-2xl border border-border border-dashed">
              <div className="w-14 h-14 border-4 border-border border-t-zinc-900 rounded-full animate-spin" />
              <p className="mt-5 text-base font-medium text-foreground">
                Generating...
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This may take a moment
              </p>
            </div>
          )}

          {!isLoading && generatedAssets.length === 0 && (
            <div className="h-[450px] flex flex-col items-center justify-center bg-card rounded-2xl border border-border border-dashed">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-5 border border-border">
                <Sparkles className="w-7 h-7 text-zinc-300" />
              </div>
              <h3 className="text-lg font-serif font-medium text-foreground">
                Ready to Create
              </h3>
              <p className="text-muted-foreground max-w-xs text-center mt-2 text-sm">
                Upload photos, select what to generate, and add details.
              </p>
            </div>
          )}

          {activeTab === "visuals" &&
            !isLoading &&
            generatedAssets.length > 0 && (
              <>
                {visualAssets.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-16">
                    {visualAssets.map((asset, index) => (
                      <AssetCard
                        key={`visual-${index}`}
                        asset={asset}
                        onRegenerate={handleRegenerate}
                        onViewLarger={openLightbox}
                        isRegenerating={regeneratingAsset === asset.type}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-muted-foreground bg-card rounded-xl border border-border italic">
                    No visual assets selected
                  </div>
                )}
              </>
            )}

          {activeTab === "copy" && !isLoading && generatedAssets.length > 0 && (
            <>
              {textAssets.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 pb-16 max-w-3xl mx-auto">
                  {textAssets.map((asset, index) => (
                    <AssetCard
                      key={`text-${index}`}
                      asset={asset}
                      onRegenerate={handleRegenerate}
                      isRegenerating={regeneratingAsset === asset.type}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground bg-card rounded-xl border border-border italic">
                  No text assets selected
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Lightbox */}
      {lightboxOpen && lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={() =>
            setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)
          }
          onPrev={() =>
            setLightboxIndex(
              (prev) =>
                (prev - 1 + lightboxImages.length) % lightboxImages.length
            )
          }
        />
      )}
    </div>
  );
};

export default Studio;
