import React, { useState, useEffect, useMemo } from "react";
import {
  AssetType,
  GeneratedAsset,
  JewelryType,
  ProductDetails,
} from "../types";
import InputForm from "../components/InputForm";
import AssetCard from "../components/AssetCard";
import Lightbox from "../components/Lightbox";
import AssetSelector from "../components/AssetSelector";
import { generateAsset } from "../services/geminiService";
import { Card, Button, cn } from "../components/ui";
import { usePrompts } from "../contexts/PromptContext";
import { useToast } from "../contexts/ToastContext";
import { useBrand } from "../contexts/BrandContext";
import { PromptTemplateKey } from "../prompts";
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
  const { settings: brandSettings } = useBrand();

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

  const [selectedAssets, setSelectedAssets] = useState<AssetType[]>([
    AssetType.WHITE_BG,
  ]);

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
    stagingProps: [],
  });

  // Update defaults when brand settings change
  useEffect(() => {
    setDetails((prev) => ({
      ...prev,
      accentDetail: prev.accentDetail || brandSettings.defaultAccentDetail,
      claspType: prev.claspType || brandSettings.defaultClaspType,
    }));
  }, [brandSettings.defaultAccentDetail, brandSettings.defaultClaspType]);

  // Convert stored logo data URL to File object for API
  const brandLogoFile = useMemo(() => {
    if (!brandSettings.logoDataUrl) return null;

    // Convert data URL to Blob then File
    const arr = brandSettings.logoDataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], brandSettings.logoFileName || "logo.png", {
      type: mime,
    });
  }, [brandSettings.logoDataUrl, brandSettings.logoFileName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
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

        return generateAsset(files, assetType, prompt, logoToUse);
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
      const newAsset = await generateAsset(files, assetType, prompt, logoToUse);

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
  const copyTypes = [AssetType.DESCRIPTION, AssetType.SOCIAL_POST];

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
                step1Complete
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-900 text-white"
              )}
            >
              {step1Complete ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                Upload Photos
              </h2>
              <p className="text-[10px] text-zinc-400">
                Start with your raw product images
              </p>
            </div>
          </div>

          <div className="group relative border-2 border-dashed border-zinc-200 rounded-xl p-5 text-center hover:bg-zinc-50/80 transition-all hover:border-zinc-300 cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isLoading}
            />
            <div className="flex flex-col items-center pointer-events-none">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 transition-colors">
                <Upload className="h-5 w-5" />
              </div>
              <span className="block text-sm font-medium text-zinc-700">
                {files.length > 0
                  ? `${files.length} image${files.length > 1 ? "s" : ""} ready`
                  : "Click or drag to upload"}
              </span>
              <span className="mt-0.5 block text-xs text-zinc-400">
                PNG, JPG
              </span>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 group/thumb"
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
                  ? "bg-emerald-500 text-white"
                  : step1Complete
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-200 text-zinc-500"
              )}
            >
              {step2Complete ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Palette className="w-3.5 h-3.5" />
              )}
            </div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Choose Assets
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
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

            <div>
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Copywriting
              </h3>
              <div className="space-y-1.5">
                {copyTypes.map((type) => {
                  const info = ASSET_TYPE_INFO[type];
                  const Icon = info.icon;
                  const isSelected = selectedAssets.includes(type);
                  return (
                    <div
                      key={type}
                      onClick={() => !isLoading && toggleAssetSelection(type)}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all",
                        isSelected
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-600"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          isSelected ? "text-zinc-300" : "text-zinc-400"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium">
                          {info.label}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                          isSelected
                            ? "border-white bg-white"
                            : "border-zinc-300"
                        )}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-zinc-900 rounded-full" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Staging Hint */}
            {needsStagingFields && !brandSettings.logoDataUrl && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-700">
                <strong>Tip:</strong> Upload your brand logo in{" "}
                <a href="/settings" className="underline font-medium">
                  Settings → Brand Assets
                </a>{" "}
                to automatically add it to lifestyle scenes.
              </div>
            )}
          </div>
        </Card>

        {/* STEP 3: DETAILS (SMART DISPLAY) */}
        <Card
          className={cn(
            "p-6 transition-opacity",
            (!step1Complete || !step2Complete) &&
              "opacity-60 pointer-events-none"
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors",
                step3Complete
                  ? "bg-emerald-500 text-white"
                  : step1Complete && step2Complete
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-200 text-zinc-500"
              )}
            >
              {step3Complete ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <ClipboardList className="w-3.5 h-3.5" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                Add Details
              </h2>
              <p className="text-[10px] text-zinc-400">
                {needsCopywritingFields
                  ? "Required for copy generation"
                  : "Optional - improves accuracy"}
              </p>
            </div>
          </div>

          <InputForm
            details={details}
            setDetails={setDetails}
            isLoading={isLoading}
            selectedAssets={selectedAssets}
            showCopywritingFields={needsCopywritingFields}
          />

          <div className="mt-6 pt-5 border-t border-zinc-100">
            <Button
              onClick={handleGenerate}
              disabled={
                isLoading || files.length === 0 || selectedAssets.length === 0
              }
              className="w-full h-11 text-sm shadow-lg shadow-zinc-900/10"
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
        <div className="sticky top-0 z-30 bg-zinc-50/95 backdrop-blur-sm py-3 px-1 mb-4 border-b border-zinc-200/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
            <h2 className="text-2xl font-serif text-zinc-900 tracking-tight">
              Generated Collection
            </h2>
            <div className="flex bg-zinc-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("visuals")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  activeTab === "visuals"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                Visuals
              </button>
              <button
                onClick={() => setActiveTab("copy")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  activeTab === "copy"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow">
          {isLoading && (
            <div className="h-[450px] flex flex-col items-center justify-center bg-white/50 rounded-2xl border border-zinc-200 border-dashed">
              <div className="w-14 h-14 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
              <p className="mt-5 text-base font-medium text-zinc-900">
                Generating...
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                This may take a moment
              </p>
            </div>
          )}

          {!isLoading && generatedAssets.length === 0 && (
            <div className="h-[450px] flex flex-col items-center justify-center bg-white rounded-2xl border border-zinc-200 border-dashed">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-5 border border-zinc-100">
                <Sparkles className="w-7 h-7 text-zinc-300" />
              </div>
              <h3 className="text-lg font-serif font-medium text-zinc-900">
                Ready to Create
              </h3>
              <p className="text-zinc-500 max-w-xs text-center mt-2 text-sm">
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
                  <div className="h-48 flex items-center justify-center text-zinc-400 bg-white rounded-xl border border-zinc-100 italic">
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
                <div className="h-48 flex items-center justify-center text-zinc-400 bg-white rounded-xl border border-zinc-100 italic">
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
