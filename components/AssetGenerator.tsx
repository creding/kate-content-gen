"use client";

import React, { useState } from "react";
import {
  JewelryItem,
  AssetType,
  GeneratedAsset,
  ProductDetails,
} from "@/types";
import { generateAssetAction } from "@/app/actions/gemini";
import AssetSelector from "@/components/AssetSelector";
import AssetCard from "@/components/AssetCard";
import { Button } from "@/components/ui";
import { usePrompts } from "@/contexts/PromptContext";
import { useToast } from "@/contexts/ToastContext";
import { useBrand } from "@/contexts/BrandContext";
import { Image, Sparkles, User, FileText, Share2, Loader2 } from "lucide-react";
import { PromptTemplateKey } from "@/prompts";

interface AssetGeneratorProps {
  item: JewelryItem;
}

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

export default function AssetGenerator({ item }: AssetGeneratorProps) {
  const { renderPrompt } = usePrompts();
  const { addToast } = useToast();
  const { settings: brandSettings, getEffectiveLogo } = useBrand();

  const [selectedAssets, setSelectedAssets] = useState<AssetType[]>([]);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local details state (initialized from item, but editable for generation context)
  // Casting to ProductDetails to ensure compatibility, though item.details should match.
  const [details, setDetails] = useState<ProductDetails>(item.details);

  const visualTypes = [AssetType.WHITE_BG, AssetType.STAGING, AssetType.MODEL];

  const toggleAssetSelection = (type: AssetType) => {
    setSelectedAssets((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Helper: Fetch Logo File
  const getLogoFile = async () => {
    const logoUrl = getEffectiveLogo();
    if (!logoUrl) return null;
    try {
      if (logoUrl.startsWith("data:")) {
        const arr = logoUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new File([u8arr], brandSettings.logoFileName || "logo.png", {
          type: mime,
        });
      } else {
        const response = await fetch(logoUrl);
        const blob = await response.blob();
        return new File([blob], "logo.png", { type: blob.type });
      }
    } catch (e) {
      console.error("Failed to load logo", e);
      return null;
    }
  };

  // Helper: Fetch Item Images as Files
  const getItemFiles = async () => {
    const files: File[] = [];
    if (!item.images) return files;

    for (const url of item.images) {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        // Extract filename from URL or default
        const filename = url.split("/").pop()?.split("?")[0] || "image.jpg";
        files.push(new File([blob], filename, { type: blob.type }));
      } catch (e) {
        console.error("Failed to download image:", url, e);
      }
    }
    return files;
  };

  // --- Logic reused from original Studio ---
  const getTemplateKey = (assetType: AssetType): PromptTemplateKey => {
    // ... (Logic from original file)
    switch (assetType) {
      case AssetType.STAGING:
        return "STAGING";
      case AssetType.MODEL:
        if (details.type.toUpperCase() === "NECKLACE") return "MODEL_NECKLACE";
        if (details.type.toUpperCase() === "EARRINGS") return "MODEL_EARRINGS";
        return "MODEL_RING";
      case AssetType.WHITE_BG:
        if (details.type.toUpperCase() === "EARRINGS")
          return "WHITE_BG_EARRINGS";
        return "WHITE_BG_GENERAL";
      case AssetType.DESCRIPTION:
        if (details.type.toUpperCase() === "EARRINGS")
          return "DESCRIPTION_EARRINGS";
        return "DESCRIPTION_NECKLACE";
      case AssetType.SOCIAL_POST:
        return "SOCIAL";
      default:
        return "WHITE_BG_GENERAL";
    }
  };

  // Simplified strict version of getPromptVariables since we don't have the complexity of all maps right here,
  // or we can just paste the whole helper. For now, I'll implement a basic version or TODO: Import this helper?
  // It's better to move `getPromptVariables` to a utility file, but for now I'll inline the essential map logic.
  const getPromptVariables = (d: ProductDetails) => {
    // Basic implementation mapping fields to strings
    return {
      ...d,
      type: d.type.toLowerCase(),
      propsInstruction: d.stagingProps?.length
        ? `Add props: ${d.stagingProps.join(", ")}`
        : "",
      // Providing simple defaults for instructions to ensure prompts work
      lightingInstruction: d.lightingMood || "Soft lighting",
      layoutInstruction: d.stagingLayout || "Elegant layout",
      surfaceInstruction: d.stagingSurface || "Luxurious surface",
      whiteBgAngleInstruction: d.whiteBgAngle || "Top down view",
      whiteBgFramingInstruction: d.whiteBgFraming || "Centered product",
      whiteBgShadowInstruction: d.whiteBgShadow || "No shadow",
      modelSkinToneInstruction: d.modelSkinTone
        ? `Model with ${d.modelSkinTone} skin`
        : "Model",
      modelClothingInstruction: d.modelClothing
        ? `Wearing ${d.modelClothing}`
        : "Neutral clothing",
      modelShotTypeInstruction: d.modelShotType || "Close up",
      modelBackgroundInstruction: d.modelBackground || "Studio background",
      modelLightingInstruction: d.modelLighting || "Natural lighting",
      typeSpecificInstruction:
        d.type.toLowerCase() === "earrings" ? "Show both earrings" : "",
    };
  };

  const handleGenerate = async () => {
    if (selectedAssets.length === 0) {
      setError("Select at least one asset type.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const itemFiles = await getItemFiles();
      if (itemFiles.length === 0)
        throw new Error("Could not load item images.");

      const logoFile = await getLogoFile();

      const promises = selectedAssets.map((assetType) => {
        const templateKey = getTemplateKey(assetType);
        const variables = getPromptVariables(details);
        const prompt = renderPrompt(templateKey, variables);

        const formData = new FormData();
        itemFiles.forEach((f) => formData.append("files", f));
        formData.append("assetType", assetType);
        formData.append("prompt", prompt);
        if (assetType === AssetType.STAGING && logoFile) {
          formData.append("logoFile", logoFile);
        }

        return generateAssetAction(formData);
      });

      const results = await Promise.allSettled(promises);
      const successful: GeneratedAsset[] = [];
      const errors: string[] = [];

      results.forEach((res) => {
        if (res.status === "fulfilled") successful.push(res.value);
        else errors.push(res.reason?.message || "Unknown error");
      });

      setGeneratedAssets(successful);
      if (successful.length > 0)
        addToast(`Generated ${successful.length} assets`, "success");
      if (errors.length > 0) setError(`Errors: ${errors.join(", ")}`);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Generation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar Controls */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Select Assets to Generate</h3>
          <div className="space-y-2">
            {visualTypes.map((type) => (
              <AssetSelector
                key={type}
                assetType={type}
                label={ASSET_TYPE_INFO[type].label}
                icon={ASSET_TYPE_INFO[type].icon}
                isSelected={selectedAssets.includes(type)}
                onToggle={() => toggleAssetSelection(type)}
                details={details}
                setDetails={setDetails}
                isLoading={isLoading}
              />
            ))}
            <div className="border-t border-border my-2 pt-2">
              {[AssetType.DESCRIPTION, AssetType.SOCIAL_POST].map((type) => (
                <AssetSelector
                  key={type}
                  assetType={type}
                  label={ASSET_TYPE_INFO[type].label}
                  icon={ASSET_TYPE_INFO[type].icon}
                  isSelected={selectedAssets.includes(type)}
                  onToggle={() => toggleAssetSelection(type)}
                  details={details}
                  setDetails={setDetails}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isLoading || selectedAssets.length === 0}
            className="w-full mt-6"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Generate Content
          </Button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>

      {/* Results Area */}
      <div className="lg:col-span-8 space-y-6">
        {generatedAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedAssets.map((asset, idx) => (
              <AssetCard
                key={idx}
                asset={asset}
                onRegenerate={() => {}} // TODO implement single regen?
                isRegenerating={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-xl bg-muted/20 min-h-[300px]">
            <Sparkles className="w-10 h-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Ready to Visualize</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Select your desired assets and styling options on the left to
              generating stunning content for this item.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
