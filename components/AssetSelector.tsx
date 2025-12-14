import React, { useState } from "react";
import { Settings, ChevronDown } from "lucide-react";
import {
  AssetType,
  JewelryType,
  NecklaceLength,
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
  ModelClothingColor,
  ModelClothingType,
  EarringLength,
} from "../types";
import { Select, cn } from "./ui";

interface AssetSelectorProps {
  assetType: AssetType;
  label: string;
  icon: React.ElementType;
  isSelected: boolean;
  onToggle: () => void;
  details: ProductDetails;
  setDetails: React.Dispatch<React.SetStateAction<ProductDetails>>;
  isLoading: boolean;
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

// Determine if an asset type has settings
const hasSettings = (type: AssetType) => {
  return [AssetType.WHITE_BG, AssetType.STAGING, AssetType.MODEL].includes(
    type
  );
};

const AssetSelector: React.FC<AssetSelectorProps> = ({
  assetType,
  label,
  icon: Icon,
  isSelected,
  onToggle,
  details,
  setDetails,
  isLoading,
}) => {
  const [settingsExpanded, setSettingsExpanded] = useState(false);

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

  const showSettings = isSelected && hasSettings(assetType) && settingsExpanded;

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSettingsExpanded(!settingsExpanded);
  };

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Selector Row */}
      <div
        onClick={() => !isLoading && onToggle()}
        className={cn(
          "flex items-center gap-3 p-2.5 border cursor-pointer transition-all",
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border hover:border-ring hover:bg-muted text-muted-foreground",
          showSettings ? "rounded-t-lg" : "rounded-lg"
        )}
      >
        <Icon
          className={cn(
            "w-4 h-4 shrink-0",
            isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium">{label}</span>
        </div>

        {/* Settings button - only for assets with settings */}
        {hasSettings(assetType) && isSelected && (
          <button
            onClick={handleSettingsClick}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              settingsExpanded
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "hover:bg-primary-foreground/10 text-primary-foreground/70"
            )}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Selection indicator */}
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
            isSelected
              ? "border-primary-foreground bg-primary-foreground"
              : "border-border"
          )}
        >
          {isSelected && <div className="w-2 h-2 bg-primary rounded-full" />}
        </div>
      </div>

      {/* Expandable Settings Panel */}
      {showSettings && (
        <div className="bg-primary/90 border border-t-0 border-primary/70 rounded-b-lg p-4 space-y-4">
          {/* WHITE BACKGROUND SETTINGS */}
          {assetType === AssetType.WHITE_BG && (
            <>
              {/* Camera Angle */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                  Camera Angle
                </label>
                <Select
                  value={details.whiteBgAngle || ""}
                  onChange={(e) =>
                    handleChange("whiteBgAngle", e.target.value as WhiteBgAngle)
                  }
                  disabled={isLoading}
                  className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
                >
                  <option value="">-- Select --</option>
                  {Object.values(WhiteBgAngle).map((angle) => (
                    <option key={angle} value={angle}>
                      {angle}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Framing */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                  Framing
                </label>
                <Select
                  value={details.whiteBgFraming || ""}
                  onChange={(e) =>
                    handleChange(
                      "whiteBgFraming",
                      e.target.value as WhiteBgFraming
                    )
                  }
                  disabled={isLoading}
                  className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
                >
                  <option value="">-- Select --</option>
                  {Object.values(WhiteBgFraming).map((framing) => (
                    <option key={framing} value={framing}>
                      {framing}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Shadow */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                  Shadow
                </label>
                <Select
                  value={details.whiteBgShadow || ""}
                  onChange={(e) =>
                    handleChange(
                      "whiteBgShadow",
                      e.target.value as WhiteBgShadow
                    )
                  }
                  disabled={isLoading}
                  className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
                >
                  <option value="">-- Select --</option>
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
                  <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                    Necklace Length
                  </label>
                  <Select
                    value={details.necklaceLength || ""}
                    onChange={(e) =>
                      handleChange(
                        "necklaceLength",
                        e.target.value as NecklaceLength
                      )
                    }
                    disabled={isLoading}
                    className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
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
                  <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                    Earring Length
                  </label>
                  <Select
                    value={details.earringLength || ""}
                    onChange={(e) =>
                      handleChange(
                        "earringLength",
                        e.target.value as EarringLength
                      )
                    }
                    disabled={isLoading}
                    className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
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

              {/* Layout Style */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                  Layout Style
                </label>
                <Select
                  value={details.stagingLayout || ""}
                  onChange={(e) =>
                    handleChange(
                      "stagingLayout",
                      e.target.value as StagingLayout
                    )
                  }
                  disabled={isLoading}
                  className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
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
                <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                  Surface
                </label>
                <Select
                  value={details.stagingSurface || ""}
                  onChange={(e) =>
                    handleChange(
                      "stagingSurface",
                      e.target.value as StagingSurface
                    )
                  }
                  disabled={isLoading}
                  className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
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
                <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                  Lighting
                </label>
                <Select
                  value={details.lightingMood || ""}
                  onChange={(e) =>
                    handleChange("lightingMood", e.target.value as LightingMood)
                  }
                  disabled={isLoading}
                  className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
                >
                  <option value="">Select Lighting...</option>
                  {Object.values(LightingMood).map((mood) => (
                    <option key={mood} value={mood}>
                      {mood}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Scene Props */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                  Scene Props
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {AVAILABLE_PROPS.map((prop) => {
                    const sel = (details.stagingProps || []).includes(prop);
                    return (
                      <div
                        key={prop}
                        onClick={() => toggleProp(prop)}
                        className={cn(
                          "flex items-center gap-2 cursor-pointer p-1.5 rounded-md transition-all text-[11px]",
                          sel
                            ? "bg-primary-foreground/10 text-primary-foreground"
                            : "text-primary-foreground/60 hover:text-primary-foreground/80 hover:bg-primary-foreground/5"
                        )}
                      >
                        <div
                          className={cn(
                            "w-3 h-3 rounded border flex items-center justify-center shrink-0",
                            sel
                              ? "bg-accent border-accent"
                              : "border-primary-foreground/40"
                          )}
                        >
                          {sel && (
                            <svg
                              className="w-2 h-2 text-accent-foreground"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium">{prop}</span>
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
              {/* Necklace Length - only for necklaces */}
              {details.type === JewelryType.NECKLACE && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                    Necklace Length
                  </label>
                  <Select
                    value={details.necklaceLength || ""}
                    onChange={(e) =>
                      handleChange(
                        "necklaceLength",
                        e.target.value as NecklaceLength
                      )
                    }
                    disabled={isLoading}
                    className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
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

              {/* Skin Tone */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                  Skin Tone
                </label>
                <Select
                  value={details.modelSkinTone || ""}
                  onChange={(e) =>
                    handleChange(
                      "modelSkinTone",
                      e.target.value as ModelSkinTone
                    )
                  }
                  disabled={isLoading}
                  className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
                >
                  <option value="">-- Select --</option>
                  {Object.values(ModelSkinTone).map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Clothing Color */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                  Clothing Color
                </label>
                <Select
                  value={details.modelClothingColor || ""}
                  onChange={(e) =>
                    handleChange(
                      "modelClothingColor",
                      e.target.value as ModelClothingColor
                    )
                  }
                  disabled={isLoading}
                  className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
                >
                  <option value="">-- Select --</option>
                  {Object.values(ModelClothingColor).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Clothing Type */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                  Clothing Type
                </label>
                <Select
                  value={details.modelClothingType || ""}
                  onChange={(e) =>
                    handleChange(
                      "modelClothingType",
                      e.target.value as ModelClothingType
                    )
                  }
                  disabled={isLoading}
                  className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
                >
                  <option value="">-- Select --</option>
                  {Object.values(ModelClothingType).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Shot Type */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                  Shot Type
                </label>
                <Select
                  value={details.modelShotType || ""}
                  onChange={(e) =>
                    handleChange(
                      "modelShotType",
                      e.target.value as ModelShotType
                    )
                  }
                  disabled={isLoading}
                  className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
                >
                  <option value="">-- Select --</option>
                  {Object.values(ModelShotType).map((shot) => (
                    <option key={shot} value={shot}>
                      {shot}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Background */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                  Background
                </label>
                <Select
                  value={details.modelBackground || ""}
                  onChange={(e) =>
                    handleChange(
                      "modelBackground",
                      e.target.value as ModelBackground
                    )
                  }
                  disabled={isLoading}
                  className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
                >
                  <option value="">-- Select --</option>
                  {Object.values(ModelBackground).map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Lighting */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-primary-foreground/70 font-semibold mb-2 block">
                  Lighting
                </label>
                <Select
                  value={details.modelLighting || ""}
                  onChange={(e) =>
                    handleChange(
                      "modelLighting",
                      e.target.value as LightingMood
                    )
                  }
                  disabled={isLoading}
                  className="!bg-primary/80 !border-primary-foreground/30 text-primary-foreground text-sm hover:!bg-primary/70 focus:!bg-primary/70"
                >
                  <option value="">-- Select --</option>
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
      )}
    </div>
  );
};

export default AssetSelector;
