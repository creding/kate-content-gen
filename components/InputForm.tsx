import React from "react";
import {
  AssetType,
  JewelryType,
  NecklaceLength,
  ProductDetails,
  StagingSurface,
  LightingMood,
  StagingLayout,
} from "../types";
import { Input, Label, Select, Textarea, Card, cn } from "./ui";

interface InputFormProps {
  details: ProductDetails;
  setDetails: React.Dispatch<React.SetStateAction<ProductDetails>>;
  isLoading: boolean;
  selectedAssets: AssetType[];
  showCopywritingFields?: boolean;
  showStagingFields?: boolean;
  showModelFields?: boolean;
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

const FieldLabel: React.FC<{
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}> = ({ children, required, hint }) => (
  <div className="flex items-baseline justify-between mb-1">
    <Label className="flex items-center gap-1 text-xs">
      {children}
      {required && <span className="text-red-400">*</span>}
    </Label>
    {hint && <span className="text-[10px] text-zinc-400">{hint}</span>}
  </div>
);

const InputForm: React.FC<InputFormProps> = ({
  details,
  setDetails,
  isLoading,
  selectedAssets,
  showCopywritingFields = true,
  showStagingFields = false,
  showModelFields = false,
}) => {
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

  // If no special fields are needed and no copywriting, show minimal form
  const showMinimalForm =
    !showCopywritingFields && !showStagingFields && !showModelFields;

  return (
    <div className="space-y-4">
      {/* Always show type selector */}
      <div>
        <FieldLabel required>Jewelry Type</FieldLabel>
        <Select
          value={details.type}
          onChange={(e) => handleChange("type", e.target.value as JewelryType)}
          disabled={isLoading}
        >
          {Object.values(JewelryType).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>

      {/* Copywriting fields - only when description/social selected */}
      {showCopywritingFields && (
        <>
          <div>
            <FieldLabel required>Product Name</FieldLabel>
            <Input
              type="text"
              value={details.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={isLoading}
              placeholder="e.g. The Royal Amethyst"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel hint="Optional">Material</FieldLabel>
              <Input
                type="text"
                value={details.material}
                onChange={(e) => handleChange("material", e.target.value)}
                disabled={isLoading}
                placeholder="e.g. 14k Gold"
              />
            </div>
            <div>
              <FieldLabel hint="Optional">Stone Type</FieldLabel>
              <Input
                type="text"
                value={details.stone}
                onChange={(e) => handleChange("stone", e.target.value)}
                disabled={isLoading}
                placeholder="e.g. Sapphire"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel hint="Optional">Stone Shape</FieldLabel>
              <Input
                type="text"
                value={details.shape}
                onChange={(e) => handleChange("shape", e.target.value)}
                disabled={isLoading}
                placeholder="e.g. Oval"
              />
            </div>
            <div>
              <FieldLabel>Visual Trait</FieldLabel>
              <Input
                type="text"
                value={details.visualCharacteristic}
                onChange={(e) =>
                  handleChange("visualCharacteristic", e.target.value)
                }
                disabled={isLoading}
                placeholder="e.g. deep blue"
              />
            </div>
          </div>

          {/* Necklace-specific fields */}
          {details.type === JewelryType.NECKLACE && (
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-3">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Necklace Details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Length (inches)</FieldLabel>
                  <Input
                    type="text"
                    value={details.necklaceLengthValue || ""}
                    onChange={(e) =>
                      handleChange("necklaceLengthValue", e.target.value)
                    }
                    disabled={isLoading}
                    placeholder="18"
                  />
                </div>
                <div>
                  <FieldLabel>Clasp Type</FieldLabel>
                  <Input
                    type="text"
                    value={details.claspType || ""}
                    onChange={(e) => handleChange("claspType", e.target.value)}
                    disabled={isLoading}
                    placeholder="Lobster"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Earring-specific fields */}
          {details.type === JewelryType.EARRINGS && (
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Earring Details
              </p>
              <div>
                <FieldLabel>Hook/Post Type</FieldLabel>
                <Input
                  type="text"
                  value={details.hookType || ""}
                  onChange={(e) => handleChange("hookType", e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g. French Hook"
                />
              </div>
            </div>
          )}

          <div>
            <FieldLabel>Accent Detail</FieldLabel>
            <Input
              type="text"
              value={details.accentDetail || ""}
              onChange={(e) => handleChange("accentDetail", e.target.value)}
              disabled={isLoading}
              placeholder="e.g. Signature Tag"
            />
          </div>
        </>
      )}

      {/* Model fields - length dropdown for necklaces */}
      {showModelFields &&
        details.type === JewelryType.NECKLACE &&
        !showCopywritingFields && (
          <div>
            <FieldLabel hint="For model drape">Necklace Length</FieldLabel>
            <Select
              value={details.necklaceLength || ""}
              onChange={(e) =>
                handleChange("necklaceLength", e.target.value as NecklaceLength)
              }
              disabled={isLoading}
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

      {/* Staging fields - surface, lighting, props */}
      {showStagingFields && (
        <Card className="p-4 bg-zinc-900 text-white border-zinc-900 shadow-lg space-y-4">
          <h4 className="text-xs font-semibold text-white flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </span>
            Scene Settings
          </h4>

          {/* Layout Selector */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
              Layout Style
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.values(StagingLayout).map((layout) => {
                const isSelected = details.stagingLayout === layout;
                return (
                  <div
                    key={layout}
                    onClick={() => handleChange("stagingLayout", layout)}
                    className={cn(
                      "cursor-pointer p-2 rounded-lg text-[11px] font-medium transition-all border",
                      isSelected
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

          {/* Surface Selector */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
              Surface
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.values(StagingSurface).map((surface) => {
                const isSelected = details.stagingSurface === surface;
                return (
                  <div
                    key={surface}
                    onClick={() => handleChange("stagingSurface", surface)}
                    className={cn(
                      "cursor-pointer p-2 rounded-lg text-[11px] font-medium transition-all border",
                      isSelected
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

          {/* Lighting Selector */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
              Lighting
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.values(LightingMood).map((mood) => {
                const isSelected = details.lightingMood === mood;
                return (
                  <div
                    key={mood}
                    onClick={() => handleChange("lightingMood", mood)}
                    className={cn(
                      "cursor-pointer p-2 rounded-lg text-[11px] font-medium transition-all border",
                      isSelected
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

          {/* Props */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
              Scene Props
            </label>
            <div className="grid grid-cols-2 gap-1">
              {AVAILABLE_PROPS.map((prop) => {
                const isSelected = (details.stagingProps || []).includes(prop);
                return (
                  <div
                    key={prop}
                    onClick={() => toggleProp(prop)}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer p-1.5 rounded-md transition-all text-[11px]",
                      isSelected
                        ? "bg-white/10 text-white"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    )}
                  >
                    <div
                      className={cn(
                        "w-3 h-3 rounded border flex items-center justify-center shrink-0",
                        isSelected
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-zinc-500"
                      )}
                    >
                      {isSelected && (
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
        </Card>
      )}

      {/* Minimal form message */}
      {showMinimalForm && (
        <div className="text-center py-4 text-sm text-zinc-400">
          <p>No additional details needed for selected assets.</p>
          <p className="text-xs mt-1">You can generate now!</p>
        </div>
      )}
    </div>
  );
};

export default InputForm;
