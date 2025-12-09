import React from "react";
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
import { Input, Label, Select, Textarea, Card, cn } from "./ui";

interface InputFormProps {
  details: ProductDetails;
  setDetails: React.Dispatch<React.SetStateAction<ProductDetails>>;
  isLoading: boolean;
  selectedAssets: AssetType[];
  showCopywritingFields?: boolean;
}

const FieldLabel: React.FC<{
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}> = ({ children, required, hint }) => (
  <div className="flex items-baseline justify-between mb-1">
    <Label className="flex items-center gap-1 text-xs">
      {children}
      {required && <span className="text-destructive">*</span>}
    </Label>
    {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
  </div>
);

const InputForm: React.FC<InputFormProps> = ({
  details,
  setDetails,
  isLoading,
  selectedAssets,
  showCopywritingFields = true,
}) => {
  const handleChange = (field: keyof ProductDetails, value: any) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  // If no copywriting fields needed, show minimal form message
  const showMinimalForm = !showCopywritingFields;

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
            <div className="p-3 bg-muted rounded-lg border border-border space-y-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
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
            <div className="p-3 bg-muted rounded-lg border border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
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

      {/* Minimal form message */}
      {showMinimalForm && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          <p>No additional details needed for selected assets.</p>
          <p className="text-xs mt-1">You can generate now!</p>
        </div>
      )}
    </div>
  );
};

export default InputForm;
