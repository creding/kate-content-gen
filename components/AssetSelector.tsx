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
  ModelLighting,
  ModelClothing,
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
            ? "border-zinc-900 bg-zinc-900 text-white"
            : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-600",
          showSettings ? "rounded-t-lg" : "rounded-lg"
        )}
      >
        <Icon
          className={cn(
            "w-4 h-4 shrink-0",
            isSelected ? "text-zinc-300" : "text-zinc-400"
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
                ? "bg-white/20 text-white"
                : "hover:bg-white/10 text-zinc-400"
            )}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Selection indicator */}
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
            isSelected ? "border-white bg-white" : "border-zinc-300"
          )}
        >
          {isSelected && <div className="w-2 h-2 bg-zinc-900 rounded-full" />}
        </div>
      </div>

      {/* Expandable Settings Panel */}
      {showSettings && (
        <div className="bg-zinc-800 border border-t-0 border-zinc-700 rounded-b-lg p-4 space-y-4">
          {/* WHITE BACKGROUND SETTINGS */}
          {assetType === AssetType.WHITE_BG && (
            <>
              {/* Camera Angle */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
                  Camera Angle
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.values(WhiteBgAngle).map((angle) => {
                    const sel = details.whiteBgAngle === angle;
                    return (
                      <div
                        key={angle}
                        onClick={() => handleChange("whiteBgAngle", angle)}
                        className={cn(
                          "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center",
                          sel
                            ? "bg-white text-zinc-900 border-white"
                            : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
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
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
                  Framing
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.values(WhiteBgFraming).map((framing) => {
                    const sel = details.whiteBgFraming === framing;
                    return (
                      <div
                        key={framing}
                        onClick={() => handleChange("whiteBgFraming", framing)}
                        className={cn(
                          "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center",
                          sel
                            ? "bg-white text-zinc-900 border-white"
                            : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
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
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
                  Shadow
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.values(WhiteBgShadow).map((shadow) => {
                    const sel = details.whiteBgShadow === shadow;
                    return (
                      <div
                        key={shadow}
                        onClick={() => handleChange("whiteBgShadow", shadow)}
                        className={cn(
                          "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center",
                          sel
                            ? "bg-white text-zinc-900 border-white"
                            : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
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
              {/* Layout Style */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
                  Layout Style
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {Object.values(StagingLayout).map((layout) => {
                    const sel = details.stagingLayout === layout;
                    return (
                      <div
                        key={layout}
                        onClick={() => handleChange("stagingLayout", layout)}
                        className={cn(
                          "cursor-pointer p-2 rounded-lg text-[11px] font-medium transition-all border",
                          sel
                            ? "bg-white text-zinc-900 border-white"
                            : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
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
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
                  Surface
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.values(StagingSurface).map((surface) => {
                    const sel = details.stagingSurface === surface;
                    return (
                      <div
                        key={surface}
                        onClick={() => handleChange("stagingSurface", surface)}
                        className={cn(
                          "cursor-pointer p-2 rounded-lg text-[11px] font-medium transition-all border",
                          sel
                            ? "bg-white text-zinc-900 border-white"
                            : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
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
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
                  Lighting
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.values(LightingMood).map((mood) => {
                    const sel = details.lightingMood === mood;
                    return (
                      <div
                        key={mood}
                        onClick={() => handleChange("lightingMood", mood)}
                        className={cn(
                          "cursor-pointer p-2 rounded-lg text-[11px] font-medium transition-all border",
                          sel
                            ? "bg-white text-zinc-900 border-white"
                            : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
                        )}
                      >
                        {mood}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scene Props */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
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
                            ? "bg-white/10 text-white"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                        )}
                      >
                        <div
                          className={cn(
                            "w-3 h-3 rounded border flex items-center justify-center shrink-0",
                            sel
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-zinc-500"
                          )}
                        >
                          {sel && (
                            <svg
                              className="w-2 h-2 text-white"
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
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
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
                    className="!bg-zinc-700 !border-zinc-600 text-white text-sm hover:!bg-zinc-600 focus:!bg-zinc-600"
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
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
                  Skin Tone
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {Object.values(ModelSkinTone).map((tone) => {
                    const sel = details.modelSkinTone === tone;
                    return (
                      <div
                        key={tone}
                        onClick={() => handleChange("modelSkinTone", tone)}
                        className={cn(
                          "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center",
                          sel
                            ? "bg-white text-zinc-900 border-white"
                            : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
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
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
                  Clothing
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {Object.values(ModelClothing).map((color) => {
                    const sel = details.modelClothing === color;
                    return (
                      <div
                        key={color}
                        onClick={() => handleChange("modelClothing", color)}
                        className={cn(
                          "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center",
                          sel
                            ? "bg-white text-zinc-900 border-white"
                            : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
                        )}
                      >
                        {color}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shot Type */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
                  Shot Type
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.values(ModelShotType).map((shot) => {
                    const sel = details.modelShotType === shot;
                    return (
                      <div
                        key={shot}
                        onClick={() => handleChange("modelShotType", shot)}
                        className={cn(
                          "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center",
                          sel
                            ? "bg-white text-zinc-900 border-white"
                            : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
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
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
                  Background
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.values(ModelBackground).map((bg) => {
                    const sel = details.modelBackground === bg;
                    return (
                      <div
                        key={bg}
                        onClick={() => handleChange("modelBackground", bg)}
                        className={cn(
                          "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center",
                          sel
                            ? "bg-white text-zinc-900 border-white"
                            : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
                        )}
                      >
                        {bg}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lighting */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
                  Lighting
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.values(ModelLighting).map((light) => {
                    const sel = details.modelLighting === light;
                    return (
                      <div
                        key={light}
                        onClick={() => handleChange("modelLighting", light)}
                        className={cn(
                          "cursor-pointer p-2 rounded-lg text-[10px] font-medium transition-all border text-center",
                          sel
                            ? "bg-white text-zinc-900 border-white"
                            : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
                        )}
                      >
                        {light}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetSelector;
