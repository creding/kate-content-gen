import React, { useState } from "react";
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
  ModelLighting,
  ModelClothing,
} from "../types";
import { Card, Button, Input, Select, cn } from "./ui";
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
  User,
  FileText,
  Share2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface SmartAssetCardProps {
  assetType: AssetType;
  generatedAsset?: GeneratedAsset;
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

const ASSET_TYPE_INFO: Record<
  AssetType,
  { label: string; description: string; icon: React.ElementType }
> = {
  [AssetType.WHITE_BG]: {
    label: "Clean Product Shot",
    description: "E-commerce ready white background",
    icon: ImageIcon,
  },
  [AssetType.STAGING]: {
    label: "Lifestyle Scene",
    description: "Elegant staging with props",
    icon: Sparkles,
  },
  [AssetType.MODEL]: {
    label: "Model Showcase",
    description: "Jewelry worn on a model",
    icon: User,
  },
  [AssetType.DESCRIPTION]: {
    label: "Product Description",
    description: "SEO-friendly listing copy",
    icon: FileText,
  },
  [AssetType.SOCIAL_POST]: {
    label: "Social Media Post",
    description: "Engaging caption & hashtags",
    icon: Share2,
  },
};

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
            {/* WHITE BACKGROUND SETTINGS */}
            {assetType === AssetType.WHITE_BG && (
              <>
                {/* Camera Angle */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Camera Angle
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(WhiteBgAngle).map((angle) => {
                      const sel = details.whiteBgAngle === angle;
                      return (
                        <div
                          key={angle}
                          onClick={() => handleChange("whiteBgAngle", angle)}
                          className={cn(
                            "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center flex items-center justify-center min-h-[40px]",
                            sel
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {angle}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Framing */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Framing
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(WhiteBgFraming).map((framing) => {
                      const sel = details.whiteBgFraming === framing;
                      return (
                        <div
                          key={framing}
                          onClick={() =>
                            handleChange("whiteBgFraming", framing)
                          }
                          className={cn(
                            "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center flex items-center justify-center min-h-[40px]",
                            sel
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {framing}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Shadow */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Shadow
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(WhiteBgShadow).map((shadow) => {
                      const sel = details.whiteBgShadow === shadow;
                      return (
                        <div
                          key={shadow}
                          onClick={() => handleChange("whiteBgShadow", shadow)}
                          className={cn(
                            "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center flex items-center justify-center min-h-[40px]",
                            sel
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {shadow}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* STAGING SETTINGS */}
            {assetType === AssetType.STAGING && (
              <>
                {/* Layout */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Layout
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(StagingLayout).map((layout) => {
                      const sel = details.stagingLayout === layout;
                      return (
                        <div
                          key={layout}
                          onClick={() => handleChange("stagingLayout", layout)}
                          className={cn(
                            "cursor-pointer p-2 rounded-lg text-[11px] font-medium transition-all border text-center",
                            sel
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {layout}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Surface */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Surface
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(StagingSurface).map((surface) => {
                      const sel = details.stagingSurface === surface;
                      return (
                        <div
                          key={surface}
                          onClick={() =>
                            handleChange("stagingSurface", surface)
                          }
                          className={cn(
                            "cursor-pointer p-2 rounded-lg text-[11px] font-medium transition-all border text-center",
                            sel
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {surface}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Lighting */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Lighting
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(LightingMood).map((mood) => {
                      const sel = details.lightingMood === mood;
                      return (
                        <div
                          key={mood}
                          onClick={() => handleChange("lightingMood", mood)}
                          className={cn(
                            "cursor-pointer p-2 rounded-lg text-[11px] font-medium transition-all border text-center",
                            sel
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {mood}
                        </div>
                      );
                    })}
                  </div>
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
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(ModelSkinTone).map((tone) => {
                      const sel = details.modelSkinTone === tone;
                      return (
                        <div
                          key={tone}
                          onClick={() => handleChange("modelSkinTone", tone)}
                          className={cn(
                            "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center flex items-center justify-center min-h-[40px]",
                            sel
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {tone}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Clothing */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Clothing
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(ModelClothing).map((clothing) => {
                      const sel = details.modelClothing === clothing;
                      return (
                        <div
                          key={clothing}
                          onClick={() =>
                            handleChange("modelClothing", clothing)
                          }
                          className={cn(
                            "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center",
                            sel
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {clothing}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shot */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Shot Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(ModelShotType).map((shot) => {
                      const sel = details.modelShotType === shot;
                      return (
                        <div
                          key={shot}
                          onClick={() => handleChange("modelShotType", shot)}
                          className={cn(
                            "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center",
                            sel
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {shot}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Background */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
                    Background
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(ModelBackground).map((bg) => {
                      const sel = details.modelBackground === bg;
                      return (
                        <div
                          key={bg}
                          onClick={() => handleChange("modelBackground", bg)}
                          className={cn(
                            "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center",
                            sel
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {bg}
                        </div>
                      );
                    })}
                  </div>
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
