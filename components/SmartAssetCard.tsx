import React, { useState, useEffect } from "react";
import {
  AssetType,
  GeneratedAsset,
  ProductDetails,
  JewelryType,
  NecklaceLength,
  StagingLayout,
  StagingSurface,
  LightingMood,
  WhiteBgAngle,
  WhiteBgFraming,
  WhiteBgShadow,
  ModelSkinTone,
  ModelShotType,
  ModelBackground,
  ModelClothingColor,
  ModelClothingType,
  EarringLength,
  StoneCount,
} from "@/types";
import { Card, Button, Input, Select, Label, cn } from "./ui";
import { useToast } from "../contexts/ToastContext";
import {
  Settings,
  RefreshCw,
  Download,
  Copy,
  Loader2,
  Maximize2,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Share2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Asset Type Metadata
const ASSET_TYPE_INFO: Record<
  AssetType,
  { label: string; icon: React.ElementType; description: string }
> = {
  [AssetType.STAGING]: {
    label: "Staging",
    icon: ImageIcon,
    description: "Photorealistic staging on a surface",
  },
  [AssetType.MODEL]: {
    label: "Model",
    icon: Share2,
    description: "Realistic model try-on shot",
  },
  [AssetType.WHITE_BG]: {
    label: "White BG",
    icon: Maximize2, // Placeholder
    description: "Clean white background product shot",
  },
  [AssetType.DESCRIPTION]: {
    label: "Copy",
    icon: FileText,
    description: "SEO-optimized product description",
  },
  [AssetType.SOCIAL_POST]: {
    label: "Social",
    icon: Share2,
    description: "Engaging social media caption",
  },
};

const isModelShot = (type: AssetType) => type === AssetType.MODEL;

interface SmartAssetCardProps {
  assetType: AssetType;
  generatedAsset?: GeneratedAsset | null;
  onGenerate: () => void;
  isGenerating?: boolean;
  onViewLarger?: (assetType: AssetType) => void;
  details: ProductDetails;
  setDetails: React.Dispatch<React.SetStateAction<ProductDetails>>;
}

const AVAILABLE_PROPS = [
  "Gift Box",
  "Woven Basket",
  "Greenery/Leaves",
  "Fresh Flowers",
  "Silk Ribbon",
  "Marble Block",
  "Dried Wheat",
  "Pearl Accents",
  "Vintage Book",
  "Linen Fabric",
];

const hasSettings = (type: AssetType) => {
  return [AssetType.WHITE_BG, AssetType.STAGING, AssetType.MODEL].includes(
    type
  );
};

const SmartAssetCard: React.FC<SmartAssetCardProps> = ({
  assetType,
  generatedAsset,
  onGenerate,
  isGenerating = false,
  onViewLarger,
  details,
  setDetails,
}) => {
  const { addToast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const info = ASSET_TYPE_INFO[assetType];
  const Icon = info.icon;

  const handleChange = (field: keyof ProductDetails, value: any) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-infer Necklace Length if not set
  useEffect(() => {
    if (
      details.type === JewelryType.NECKLACE &&
      !details.necklaceLength &&
      details.necklaceLengthValue
    ) {
      const val = parseInt(
        details.necklaceLengthValue.replace(/[^0-9]/g, ""),
        10
      );
      if (!isNaN(val)) {
        let derivedLength: NecklaceLength | undefined;
        if (val < 14) derivedLength = NecklaceLength.COLLAR;
        else if (val < 17) derivedLength = NecklaceLength.CHOKER;
        else if (val < 20) derivedLength = NecklaceLength.PRINCESS;
        else if (val < 25) derivedLength = NecklaceLength.MATINEE;
        else if (val < 37) derivedLength = NecklaceLength.OPERA;
        else derivedLength = NecklaceLength.ROPE;

        if (derivedLength) {
          handleChange("necklaceLength", derivedLength);
        }
      }
    }
  }, [details.type, details.necklaceLength, details.necklaceLengthValue]);

  const toggleProp = (prop: string) => {
    const currentProps = details.stagingProps || [];
    const newProps = currentProps.includes(prop)
      ? currentProps.filter((p) => p !== prop)
      : [...currentProps, prop];
    handleChange("stagingProps", newProps);
  };

  const copyText = async () => {
    if (!generatedAsset) return;
    try {
      // If it's the description, try to copy as rich text from the rendered element
      if (assetType === AssetType.DESCRIPTION) {
        const element = document.getElementById(`content-${assetType}`);
        if (element) {
          const html = element.innerHTML;
          const text = element.innerText;
          const blobHtml = new Blob([html], { type: "text/html" });
          const blobText = new Blob([text], { type: "text/plain" });
          const data = [
            new ClipboardItem({
              "text/html": blobHtml,
              "text/plain": blobText,
            }),
          ];
          await navigator.clipboard.write(data);
          addToast("Copied formatted text!", "success");
          return;
        }
      }

      // Fallback for other text
      await navigator.clipboard.writeText(generatedAsset.content);
      addToast("Copied to clipboard!", "success");
    } catch (e) {
      console.error("Copy failed", e);
      addToast("Failed to copy", "error");
    }
  };

  const downloadImage = async () => {
    if (!generatedAsset) return;
    try {
      const response = await fetch(generatedAsset.content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-${assetType
        .toLowerCase()
        .replace(/\s/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      addToast("Image downloaded!", "success");
    } catch (e) {
      console.error("Download failed", e);
      addToast("Failed to download image", "error");
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border-border relative">
      {/* Header */}
      <div className="bg-muted/40 px-4 py-3 border-b border-border flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-background rounded-md shadow-sm text-foreground/70">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              {info.label}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {hasSettings(assetType) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                showSettings && "bg-primary/10 text-primary"
              )}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Settings Panel (Overlay) */}
      {showSettings && (
        <div className="absolute inset-0 z-30 bg-card/98 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              Configure Settings
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(false)}
              className="h-8 w-8 hover:bg-muted"
            >
              <div className="sr-only">Close</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </Button>
          </div>

          <div className="flex-grow overflow-y-auto space-y-5 pr-2 scrollbar-thin scrollbar-thumb-border">
            {/* GENERAL PRODUCT SPECS - Only for Model shots with specific jewelry types */}
            {isModelShot(assetType) &&
              (details.type === JewelryType.EARRINGS ||
                details.type === JewelryType.NECKLACE) && (
                <div className="border-b border-border pb-4 mb-4 space-y-4">
                  {/* Earring Length (Only for Model Shots) */}
                  {details.type === JewelryType.EARRINGS && (
                    <div className="mb-4">
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                        Earring Length
                      </label>
                      <Select
                        className="w-full text-sm"
                        value={details.earringLength || ""}
                        onChange={(e) =>
                          handleChange(
                            "earringLength",
                            e.target.value as EarringLength
                          )
                        }
                      >
                        <option value="">Select Length...</option>
                        {Object.values(EarringLength).map((len) => (
                          <option key={len} value={len}>
                            {len}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}

                  {/* Necklace Length (Only for Model Shots) */}
                  {details.type === JewelryType.NECKLACE && (
                    <div className="mb-4">
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                        Necklace Length
                      </label>
                      <Select
                        className="w-full text-sm"
                        value={details.necklaceLength || ""}
                        onChange={(e) =>
                          handleChange(
                            "necklaceLength",
                            e.target.value as NecklaceLength
                          )
                        }
                      >
                        <option value="">Select Length...</option>
                        {Object.values(NecklaceLength).map((len) => (
                          <option key={len} value={len}>
                            {len}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}
                </div>
              )}

            {/* WHITE BACKGROUND SETTINGS */}
            {assetType === AssetType.WHITE_BG && (
              <>
                {/* Camera Angle */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Camera Angle
                  </label>
                  <Select
                    className="w-full text-sm"
                    value={details.whiteBgAngle || ""}
                    onChange={(e) =>
                      handleChange(
                        "whiteBgAngle",
                        e.target.value as WhiteBgAngle
                      )
                    }
                  >
                    <option value="">Select Angle...</option>
                    {Object.values(WhiteBgAngle).map((angle) => (
                      <option key={angle} value={angle}>
                        {angle}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Framing */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Framing
                  </label>
                  <Select
                    className="w-full text-sm"
                    value={details.whiteBgFraming || ""}
                    onChange={(e) =>
                      handleChange(
                        "whiteBgFraming",
                        e.target.value as WhiteBgFraming
                      )
                    }
                  >
                    <option value="">Select Framing...</option>
                    {Object.values(WhiteBgFraming).map((framing) => (
                      <option key={framing} value={framing}>
                        {framing}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Shadow */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Shadow
                  </label>
                  <Select
                    className="w-full text-sm"
                    value={details.whiteBgShadow || ""}
                    onChange={(e) =>
                      handleChange(
                        "whiteBgShadow",
                        e.target.value as WhiteBgShadow
                      )
                    }
                  >
                    <option value="">Select Shadow...</option>
                    {Object.values(WhiteBgShadow).map((shadow) => (
                      <option key={shadow} value={shadow}>
                        {shadow}
                      </option>
                    ))}
                  </Select>
                </div>
              </>
            )}

            {/* STAGING SETTINGS */}
            {assetType === AssetType.STAGING && (
              <>
                {/* Necklace Length - only for necklaces */}
                {details.type === JewelryType.NECKLACE && (
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                      Necklace Length
                    </label>
                    <Select
                      className="w-full text-sm"
                      value={details.necklaceLength || ""}
                      onChange={(e) =>
                        handleChange(
                          "necklaceLength",
                          e.target.value as NecklaceLength
                        )
                      }
                    >
                      <option value="">-- Auto --</option>
                      {Object.values(NecklaceLength).map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}

                {/* Earring Length - only for earrings */}
                {details.type === JewelryType.EARRINGS && (
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                      Earring Length
                    </label>
                    <Select
                      className="w-full text-sm"
                      value={details.earringLength || ""}
                      onChange={(e) =>
                        handleChange(
                          "earringLength",
                          e.target.value as EarringLength
                        )
                      }
                    >
                      <option value="">-- Auto --</option>
                      {Object.values(EarringLength).map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}

                {/* Layout */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Layout
                  </label>
                  <Select
                    className="w-full text-sm"
                    value={details.stagingLayout || ""}
                    onChange={(e) =>
                      handleChange(
                        "stagingLayout",
                        e.target.value as StagingLayout
                      )
                    }
                  >
                    <option value="">Select Layout...</option>
                    {Object.values(StagingLayout).map((layout) => (
                      <option key={layout} value={layout}>
                        {layout}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Surface */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Surface
                  </label>
                  <Select
                    className="w-full text-sm"
                    value={details.stagingSurface || ""}
                    onChange={(e) =>
                      handleChange(
                        "stagingSurface",
                        e.target.value as StagingSurface
                      )
                    }
                  >
                    <option value="">Select Surface...</option>
                    {Object.values(StagingSurface).map((surface) => (
                      <option key={surface} value={surface}>
                        {surface}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Lighting */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Lighting
                  </label>
                  <Select
                    className="w-full text-sm"
                    value={details.lightingMood || ""}
                    onChange={(e) =>
                      handleChange(
                        "lightingMood",
                        e.target.value as LightingMood
                      )
                    }
                  >
                    <option value="">Select Lighting...</option>
                    {Object.values(LightingMood).map((mood) => (
                      <option key={mood} value={mood}>
                        {mood}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Props */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Props
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_PROPS.map((prop) => {
                      const sel = (details.stagingProps || []).includes(prop);
                      return (
                        <div
                          key={prop}
                          onClick={() => toggleProp(prop)}
                          className={cn(
                            "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border flex items-center gap-2",
                            sel
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted"
                          )}
                        >
                          <div
                            className={cn(
                              "w-2.5 h-2.5 rounded-full border flex items-center justify-center",
                              sel
                                ? "bg-primary border-primary"
                                : "border-muted-foreground/30"
                            )}
                          />
                          {prop}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* MODEL SETTINGS */}
            {assetType === AssetType.MODEL && (
              <>
                {/* Skin Tone */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Skin Tone
                  </label>
                  <Select
                    className="w-full text-sm"
                    value={details.modelSkinTone || ""}
                    onChange={(e) =>
                      handleChange(
                        "modelSkinTone",
                        e.target.value as ModelSkinTone
                      )
                    }
                  >
                    <option value="">Select Skin Tone...</option>
                    {Object.values(ModelSkinTone).map((tone) => (
                      <option key={tone} value={tone}>
                        {tone}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Clothing Color */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Clothing Color
                  </label>
                  <Select
                    className="w-full text-sm"
                    value={details.modelClothingColor || ""}
                    onChange={(e) =>
                      handleChange(
                        "modelClothingColor",
                        e.target.value as ModelClothingColor
                      )
                    }
                  >
                    <option value="">Select Color...</option>
                    {Object.values(ModelClothingColor).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Clothing Type */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Clothing Type
                  </label>
                  <Select
                    className="w-full text-sm"
                    value={details.modelClothingType || ""}
                    onChange={(e) =>
                      handleChange(
                        "modelClothingType",
                        e.target.value as ModelClothingType
                      )
                    }
                  >
                    <option value="">Select Type...</option>
                    {Object.values(ModelClothingType).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Shot Type */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Shot Type
                  </label>
                  <Select
                    className="w-full text-sm"
                    value={details.modelShotType || ""}
                    onChange={(e) =>
                      handleChange(
                        "modelShotType",
                        e.target.value as ModelShotType
                      )
                    }
                  >
                    <option value="">Select Shot Type...</option>
                    {Object.values(ModelShotType).map((shot) => (
                      <option key={shot} value={shot}>
                        {shot}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Background */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Background
                  </label>
                  <Select
                    className="w-full text-sm"
                    value={details.modelBackground || ""}
                    onChange={(e) =>
                      handleChange(
                        "modelBackground",
                        e.target.value as ModelBackground
                      )
                    }
                  >
                    <option value="">Select Background...</option>
                    {Object.values(ModelBackground).map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Lighting */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Lighting
                  </label>
                  <Select
                    className="w-full text-sm"
                    value={details.modelLighting || ""}
                    onChange={(e) =>
                      handleChange(
                        "modelLighting",
                        e.target.value as LightingMood
                      )
                    }
                  >
                    <option value="">Select Lighting...</option>
                    {Object.values(LightingMood).map((mood) => (
                      <option key={mood} value={mood}>
                        {mood}
                      </option>
                    ))}
                  </Select>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-border flex justify-end">
            <Button size="sm" onClick={() => setShowSettings(false)}>
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow bg-card relative min-h-[240px] flex flex-col">
        {isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/50 backdrop-blur-sm z-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            <span className="text-xs text-muted-foreground font-medium">
              Generating...
            </span>
          </div>
        ) : generatedAsset ? (
          // Generated Content View
          generatedAsset.isImage ? (
            <div
              className="flex-grow w-full flex items-center justify-center bg-muted/30 cursor-zoom-in relative group"
              onClick={() => onViewLarger && onViewLarger(assetType)}
            >
              <div
                className="absolute inset-0 z-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              />
              <img
                src={generatedAsset.content}
                alt={info.label}
                className="max-w-full max-h-[280px] object-contain shadow-sm transition-transform duration-300 group-hover:scale-[1.02] relative z-10"
              />
            </div>
          ) : (
            <div
              id={`content-${assetType}`}
              className="flex-grow p-4 text-sm text-foreground/80 font-light leading-relaxed overflow-y-auto h-[280px] scrollbar-thin scrollbar-thumb-border prose prose-sm dark:prose-invert max-w-none [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>li]:mb-1 [&>strong]:font-semibold"
            >
              <ReactMarkdown>{generatedAsset.content}</ReactMarkdown>
            </div>
          )
        ) : (
          // Empty State
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Icon className="w-6 h-6 opacity-30" />
            </div>
            <p className="text-xs max-w-[180px]">{info.description}</p>
            <Button
              size="sm"
              onClick={onGenerate}
              className="mt-4"
              disabled={isGenerating}
            >
              Generate
            </Button>
          </div>
        )}
      </div>

      {/* Footer Actions (Only if generated) */}
      {generatedAsset && (
        <div className="p-2 border-t border-border bg-muted/20 flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onGenerate}
            disabled={isGenerating}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            title="Regenerate"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          </Button>

          {generatedAsset.isImage && onViewLarger && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewLarger(assetType)}
              className="h-8 w-8 p-0"
              title="View Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={generatedAsset.isImage ? downloadImage : copyText}
            className="h-8 w-8 p-0"
            title={generatedAsset.isImage ? "Download" : "Copy"}
          >
            {generatedAsset.isImage ? (
              <Download className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default SmartAssetCard;
