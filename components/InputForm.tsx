import React from "react";
import {
  AssetType,
  JewelryType,
  NecklaceLength,
  ProductDetails,
} from "../types";
import { Input, Label, Select, Textarea, Card, cn } from "./ui";

interface InputFormProps {
  details: ProductDetails;
  setDetails: React.Dispatch<React.SetStateAction<ProductDetails>>;
  logoFile: File | null;
  setLogoFile: React.Dispatch<React.SetStateAction<File | null>>;
  isLoading: boolean;
  selectedAssets: AssetType[];
}

const AVAILABLE_PROPS = [
  "Gift Box",
  "Woven Basket",
  "Greenery/Leaves",
  "Fresh Flowers",
  "Silk Ribbon",
  "Polished Marble Block",
  "Dried Wheat/Pampas",
  "Pearl Accents",
  "Vintage Book",
  "Linen Fabric",
];

// Helper component for field labels
const FieldLabel: React.FC<{
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}> = ({ children, required, hint }) => (
  <div className="flex items-baseline justify-between mb-1.5">
    <Label className="flex items-center gap-1">
      {children}
      {required && <span className="text-red-400 text-xs">*</span>}
    </Label>
    {hint && <span className="text-[10px] text-zinc-400">{hint}</span>}
  </div>
);

const InputForm: React.FC<InputFormProps> = ({
  details,
  setDetails,
  logoFile,
  setLogoFile,
  isLoading,
  selectedAssets,
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const isStagingSelected = selectedAssets.includes(AssetType.STAGING);

  return (
    <div className="space-y-6">
      <div>
        <FieldLabel required hint="Used in descriptions">
          Product Name
        </FieldLabel>
        <Input
          type="text"
          value={details.name}
          onChange={(e) => handleChange("name", e.target.value)}
          disabled={isLoading}
          placeholder="e.g. The Royal Amethyst"
          className="text-base"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Type</FieldLabel>
          <Select
            value={details.type}
            onChange={(e) =>
              handleChange("type", e.target.value as JewelryType)
            }
            disabled={isLoading}
          >
            {Object.values(JewelryType).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <div>
        <FieldLabel hint="Improves copy quality">
          Visual Characteristic
        </FieldLabel>
        <Textarea
          value={details.visualCharacteristic}
          onChange={(e) => handleChange("visualCharacteristic", e.target.value)}
          disabled={isLoading}
          rows={2}
          placeholder="e.g. deep blue with light refraction"
          className="resize-none"
        />
      </div>

      {details.type === JewelryType.NECKLACE && (
        <div className="p-4 bg-zinc-50/50 rounded-xl border border-zinc-100 animate-in fade-in slide-in-from-top-2">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
            Necklace Specifics
          </h4>
          <div className="space-y-4">
            <div>
              <FieldLabel hint="For model shots">Model Drape Length</FieldLabel>
              <Select
                value={details.necklaceLength || ""}
                onChange={(e) =>
                  handleChange(
                    "necklaceLength",
                    e.target.value as NecklaceLength
                  )
                }
                disabled={isLoading}
              >
                <option value="">-- Select Length --</option>
                {Object.values(NecklaceLength).map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel hint="e.g. 18">Length (inches)</FieldLabel>
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
                  placeholder="e.g. Lobster"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {details.type === JewelryType.EARRINGS && (
        <div className="p-4 bg-zinc-50/50 rounded-xl border border-zinc-100 animate-in fade-in slide-in-from-top-2">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
            Earring Specifics
          </h4>
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
        <FieldLabel hint="Optional">Accent Detail</FieldLabel>
        <Input
          type="text"
          value={details.accentDetail || ""}
          onChange={(e) => handleChange("accentDetail", e.target.value)}
          disabled={isLoading}
          placeholder="e.g. signature crown charm"
        />
      </div>

      {/* Conditional Staging Config Section */}
      {isStagingSelected && (
        <Card className="p-5 bg-zinc-900 text-white border-zinc-900 animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl shadow-zinc-900/10">
          <h4 className="text-sm font-serif font-medium text-white mb-5 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 border border-white/20">
              <svg
                className="w-3 h-3 text-emerald-400"
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
            Lifestyle Scene Options
          </h4>

          <div className="mb-5">
            <Label className="text-zinc-400 mb-2 block text-xs">
              Scene Props
            </Label>
            <div className="grid grid-cols-2 gap-1.5">
              {AVAILABLE_PROPS.map((prop) => {
                const isSelected = (details.stagingProps || []).includes(prop);
                return (
                  <div
                    key={prop}
                    onClick={() => toggleProp(prop)}
                    className={cn(
                      "group flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all border border-transparent",
                      isSelected
                        ? "bg-white/10 border-white/10"
                        : "hover:bg-white/5"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
                        isSelected
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-zinc-500 group-hover:border-zinc-400"
                      )}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
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
                    <span
                      className={cn(
                        "text-[11px] font-medium transition-colors",
                        isSelected
                          ? "text-white"
                          : "text-zinc-400 group-hover:text-zinc-300"
                      )}
                    >
                      {prop}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="text-zinc-400 mb-2 block text-xs">
              Brand Logo / Tag Image
            </Label>
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
              <label className="cursor-pointer shrink-0">
                <span className="inline-flex items-center justify-center rounded-lg text-xs font-bold uppercase tracking-wider transition-all h-8 px-3 bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm">
                  {logoFile ? "Replace" : "Upload"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
              {logoFile ? (
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={URL.createObjectURL(logoFile)}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <span className="text-xs font-medium text-emerald-400 truncate">
                    {logoFile.name}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-zinc-500 italic">
                  Optional branding overlay
                </span>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InputForm;
