"use client";

import React, { useState } from "react";
import {
  JewelryItem,
  AssetType,
  GeneratedAsset,
  ProductDetails,
  StagingSurface,
  LightingMood,
  StagingLayout,
  WhiteBgAngle,
  WhiteBgFraming,
  WhiteBgShadow,
  ModelSkinTone,
  ModelShotType,
  ModelBackground,
  ModelLighting,
  ModelClothing,
} from "@/types";
import { generateAssetAction } from "@/app/actions/gemini";
import { Button } from "@/components/ui";
import Lightbox from "./Lightbox";
import SmartAssetCard from "./SmartAssetCard";
import { usePrompts } from "@/contexts/PromptContext";
import { useToast } from "@/contexts/ToastContext";
import { useBrand } from "@/contexts/BrandContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  Image,
  Sparkles,
  User,
  FileText,
  Share2,
  Loader2,
  Trash2,
} from "lucide-react";
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
  const { user } = useAuth(); // Need user for storage path

  // State
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState<AssetType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Compute images for lightbox
  const lightboxImages = generatedAssets
    .filter((a) => a.isImage)
    .map((a) => ({ src: a.content, label: ASSET_TYPE_INFO[a.type].label }));

  const handleViewLarger = (assetType: AssetType) => {
    // Find index of this asset type among images
    // Note: If multiple of same type exist, this finds first.
    // Ideally we pass index or UUID, but for now type is unique enough in this UI context?
    // Actually, we might have multiple if we didn't clear them?
    // The current UI just appends. Let's find by index in the *displayed* list?
    // AssetCard is rendered from generatedAssets map.
    // But onViewLarger only passes type.
    // Let's modify AssetCard or work around it.
    // Workaround: Find the asset with that type in generatedAssets.
    const index = generatedAssets.findIndex(
      (a) => a.type === assetType && a.isImage
    );
    // Be careful, we need index in *lightboxImages*, not generatedAssets.
    if (index === -1) return;

    const targetAsset = generatedAssets[index];
    const lbIndex = lightboxImages.findIndex(
      (img) => img.src === targetAsset.content
    );

    if (lbIndex !== -1) {
      setLightboxIndex(lbIndex);
      setLightboxOpen(true);
    }
  };

  // Load existing assets on mount
  React.useEffect(() => {
    const fetchAssets = async () => {
      if (!item.id || !supabase) return;
      const { data } = await supabase
        .from("generated_assets")
        .select("*")
        .eq("item_id", item.id)
        .order("created_at", { ascending: false });

      if (data) {
        setGeneratedAssets(
          data.map((d) => ({
            type: d.type as AssetType,
            content: d.content,
            isImage: d.is_image,
          }))
        );
      }
    };
    fetchAssets();
  }, [item.id]);

  // Local details state (initialized from item, but editable for generation context)
  const [details, setDetails] = useState<ProductDetails>({
    stagingProps: ["Gift Box", "Fresh Flowers", "Silk Ribbon"],
    stagingSurface: StagingSurface.MARBLE,
    lightingMood: LightingMood.SOFT,
    stagingLayout: StagingLayout.DRAPED,
    whiteBgAngle: WhiteBgAngle.TOP_DOWN,
    whiteBgFraming: WhiteBgFraming.FULL_PRODUCT,
    whiteBgShadow: WhiteBgShadow.NONE,
    modelSkinTone: ModelSkinTone.LIGHT,
    modelShotType: ModelShotType.CLOSE_UP,
    modelBackground: ModelBackground.LIFESTYLE,
    modelLighting: ModelLighting.SOFT_NATURAL,
    modelClothing: ModelClothing.WHITE,
    ...item.details,
  });

  const visualTypes = [AssetType.WHITE_BG, AssetType.STAGING, AssetType.MODEL];

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
      whiteBgShadowInstruction:
        d.whiteBgShadow === "No Shadow" || !d.whiteBgShadow
          ? "STRICTLY NO SHADOWS. Flat lighting. No floor shadow. Pure #FFFFFF background."
          : d.whiteBgShadow === "Reflection"
          ? "Subtle reflection on pure white surface."
          : "Soft, natural shadow grounding the object.",
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

  const saveAssetToDb = async (asset: GeneratedAsset) => {
    if (!user || !supabase) return;

    let finalContent = asset.content;

    // If image, upload to storage first
    if (asset.isImage && asset.content.startsWith("data:")) {
      try {
        const res = await fetch(asset.content);
        const blob = await res.blob();
        const fileExt = asset.content.substring(
          asset.content.indexOf("/") + 1,
          asset.content.indexOf(";")
        );
        const fileName = `${user.id}/generated/${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("jewelry-images")
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("jewelry-images").getPublicUrl(fileName);
        finalContent = publicUrl;
      } catch (e) {
        console.error("Failed to upload generated asset", e);
        return;
      }
    }

    // REPLACE existing asset: Delete old ones first
    const { error: deleteError } = await supabase
      .from("generated_assets")
      .delete()
      .eq("item_id", item.id)
      .eq("type", asset.type);

    if (deleteError) {
      console.error("Failed to clear old assets", deleteError);
    }

    // Insert into DB
    const { error: insertError } = await supabase
      .from("generated_assets")
      .insert({
        item_id: item.id,
        type: asset.type,
        content: finalContent,
        is_image: asset.isImage,
      });

    if (insertError) {
      console.error("Failed to save asset record", insertError);
    }
  };

  const handleGenerate = async (targetType: AssetType) => {
    // Only generate one type
    if (loadingAssets.includes(targetType)) return;

    setLoadingAssets((prev) => [...prev, targetType]);
    setError(null);

    try {
      const itemFiles = await getItemFiles();
      if (itemFiles.length === 0)
        throw new Error("Could not load item images.");

      const logoFile = await getLogoFile();

      const templateKey = getTemplateKey(targetType);
      const variables = getPromptVariables(details);
      const prompt = renderPrompt(templateKey, variables);

      const formData = new FormData();
      itemFiles.forEach((f) => formData.append("files", f));
      formData.append("assetType", targetType);
      formData.append("prompt", prompt);
      if (targetType === AssetType.STAGING && logoFile) {
        formData.append("logoFile", logoFile);
      }

      const asset = await generateAssetAction(formData);

      // Sanitize Description Markdown
      if (targetType === AssetType.DESCRIPTION) {
        asset.content = asset.content
          .replace(/[•●]\s*/g, "\n- ") // Replace common bullet chars with markdown hyphen
          .replace(/(?<!\n)- /g, "\n- "); // Ensure hyphens start on a new line
      }

      // Save
      await saveAssetToDb(asset);

      // Re-fetch to get the persisted versions
      if (supabase) {
        const { data } = await supabase
          .from("generated_assets")
          .select("*")
          .eq("item_id", item.id)
          .order("created_at", { ascending: false });
        if (data) {
          setGeneratedAssets(
            data.map((d) => ({
              type: d.type as AssetType,
              content: d.content,
              isImage: d.is_image,
            }))
          );
        }
      }

      addToast(`Generated ${ASSET_TYPE_INFO[targetType].label}`, "success");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Generation failed");
    } finally {
      setLoadingAssets((prev) => prev.filter((t) => t !== targetType));
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm border border-red-200 dark:border-red-900/30">
          {error}
        </div>
      )}

      {/* Visual Assets Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Visual Studio
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visualTypes.map((type) => (
            <div key={type} className="h-[420px]">
              <SmartAssetCard
                assetType={type}
                generatedAsset={generatedAssets.find(
                  (a) => a.type === type && a.isImage
                )}
                onGenerate={() => handleGenerate(type)}
                isGenerating={loadingAssets.includes(type)}
                onViewLarger={handleViewLarger}
                details={details}
                setDetails={setDetails}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Text Assets Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Content Studio
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[AssetType.DESCRIPTION, AssetType.SOCIAL_POST].map((type) => (
            <div key={type} className="h-[500px]">
              <SmartAssetCard
                assetType={type}
                generatedAsset={generatedAssets.find(
                  (a) => a.type === type && !a.isImage
                )}
                onGenerate={() => handleGenerate(type)}
                isGenerating={loadingAssets.includes(type)}
                details={details}
                setDetails={setDetails}
              />
            </div>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={() =>
            setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)
          }
          onPrev={() =>
            setLightboxIndex((prev) =>
              prev === 0 ? lightboxImages.length - 1 : prev - 1
            )
          }
        />
      )}
    </div>
  );
}
