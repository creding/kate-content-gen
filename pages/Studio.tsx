import React, { useState } from "react";
import {
  AssetType,
  GeneratedAsset,
  JewelryType,
  ProductDetails,
} from "../types";
import InputForm from "../components/InputForm";
import AssetCard from "../components/AssetCard";
import { generateAsset } from "../services/geminiService";
import { Card, Button, cn } from "../components/ui";
import { usePrompts } from "../contexts/PromptContext";
import { useToast } from "../contexts/ToastContext";
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
} from "lucide-react";

// Friendly asset type definitions with descriptions
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
  const [files, setFiles] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("visuals");

  const [selectedAssets, setSelectedAssets] = useState<AssetType[]>([
    AssetType.WHITE_BG,
  ]);

  const [details, setDetails] = useState<ProductDetails>({
    name: "",
    type: JewelryType.NECKLACE,
    stone: "",
    shape: "",
    material: "",
    visualCharacteristic: "",
    necklaceLengthValue: "",
    accentDetail: "",
    stagingProps: [],
  });

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

    return {
      ...details,
      propsInstruction,
      typeSpecificInstruction,
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
        return generateAsset(files, assetType, prompt, logoFile);
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
        setError(`Some assets failed to generate: ${errors.join(", ")}`);
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

    setIsLoading(true);
    try {
      const templateKey = getTemplateKey(assetType, details);
      const variables = getPromptVariables(details);
      const prompt = renderPrompt(templateKey, variables);
      const newAsset = await generateAsset(files, assetType, prompt, logoFile);

      setGeneratedAssets((prev) =>
        prev.map((a) => (a.type === assetType ? newAsset : a))
      );
      addToast(`${ASSET_TYPE_INFO[assetType].label} regenerated!`, "success");
    } catch (err: any) {
      addToast(`Failed to regenerate: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const visualAssets = generatedAssets.filter((a) => a.isImage);
  const textAssets = generatedAssets.filter((a) => !a.isImage);

  const visualTypes = [AssetType.WHITE_BG, AssetType.STAGING, AssetType.MODEL];
  const copyTypes = [AssetType.DESCRIPTION, AssetType.SOCIAL_POST];

  // Calculate step completion
  const step1Complete = selectedAssets.length > 0;
  const step2Complete = files.length > 0;
  const step3Complete = details.name.trim() !== "";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* LEFT SIDEBAR - WIZARD INPUTS */}
      <div className="xl:col-span-4 space-y-6 lg:sticky lg:top-28">
        {/* STEP 1: SCOPE */}
        <Card className="p-6 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-5">
            <div
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors",
                step1Complete
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-200 text-zinc-500"
              )}
            >
              {step1Complete ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <span>1</span>
              )}
            </div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Select Assets
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Visual Assets
              </h3>
              <div className="space-y-2">
                {visualTypes.map((type) => {
                  const info = ASSET_TYPE_INFO[type];
                  const Icon = info.icon;
                  return (
                    <div
                      key={type}
                      onClick={() => !isLoading && toggleAssetSelection(type)}
                      className={cn(
                        "relative flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200",
                        selectedAssets.includes(type)
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                          : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-600"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                          selectedAssets.includes(type)
                            ? "bg-white/10"
                            : "bg-zinc-100"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4",
                            selectedAssets.includes(type)
                              ? "text-white"
                              : "text-zinc-500"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium block">
                          {info.label}
                        </span>
                        <span
                          className={cn(
                            "text-[11px] block mt-0.5",
                            selectedAssets.includes(type)
                              ? "text-zinc-300"
                              : "text-zinc-400"
                          )}
                        >
                          {info.description}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors mt-0.5",
                          selectedAssets.includes(type)
                            ? "border-white bg-white"
                            : "border-zinc-300"
                        )}
                      >
                        {selectedAssets.includes(type) && (
                          <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Copywriting
              </h3>
              <div className="space-y-2">
                {copyTypes.map((type) => {
                  const info = ASSET_TYPE_INFO[type];
                  const Icon = info.icon;
                  return (
                    <div
                      key={type}
                      onClick={() => !isLoading && toggleAssetSelection(type)}
                      className={cn(
                        "relative flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200",
                        selectedAssets.includes(type)
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                          : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-600"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                          selectedAssets.includes(type)
                            ? "bg-white/10"
                            : "bg-zinc-100"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4",
                            selectedAssets.includes(type)
                              ? "text-white"
                              : "text-zinc-500"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium block">
                          {info.label}
                        </span>
                        <span
                          className={cn(
                            "text-[11px] block mt-0.5",
                            selectedAssets.includes(type)
                              ? "text-zinc-300"
                              : "text-zinc-400"
                          )}
                        >
                          {info.description}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors mt-0.5",
                          selectedAssets.includes(type)
                            ? "border-white bg-white"
                            : "border-zinc-300"
                        )}
                      >
                        {selectedAssets.includes(type) && (
                          <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* STEP 2: IMAGERY */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors",
                step2Complete
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-200 text-zinc-500"
              )}
            >
              {step2Complete ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <span>2</span>
              )}
            </div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Upload Photos
            </h2>
          </div>

          <div className="group relative border-2 border-dashed border-zinc-200 rounded-xl p-6 text-center hover:bg-zinc-50/80 transition-all hover:border-zinc-300 cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="file-upload"
              disabled={isLoading}
            />
            <div className="flex flex-col items-center pointer-events-none">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 transition-colors">
                <Upload className="h-5 w-5" />
              </div>
              <span className="block text-sm font-medium text-zinc-700">
                {files.length > 0
                  ? `${files.length} image${
                      files.length > 1 ? "s" : ""
                    } selected`
                  : "Click or drag to upload"}
              </span>
              <span className="mt-0.5 block text-xs text-zinc-400">
                PNG, JPG up to 10MB each
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

        {/* STEP 3: DETAILS */}
        <Card className="p-6 border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors",
                step3Complete
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-200 text-zinc-500"
              )}
            >
              {step3Complete ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <span>3</span>
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                Product Details
              </h2>
              <p className="text-[10px] text-zinc-400">
                Fields improve generation accuracy
              </p>
            </div>
          </div>

          <InputForm
            details={details}
            setDetails={setDetails}
            logoFile={logoFile}
            setLogoFile={setLogoFile}
            isLoading={isLoading}
            selectedAssets={selectedAssets}
          />

          <div className="mt-8 pt-6 border-t border-zinc-100">
            <Button
              onClick={handleGenerate}
              disabled={
                isLoading || files.length === 0 || selectedAssets.length === 0
              }
              className="w-full h-12 text-base shadow-xl shadow-zinc-900/10"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 text-center font-medium animate-in fade-in">
                {error}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* RIGHT CONTENT - RESULTS */}
      <div className="xl:col-span-8 relative min-h-[calc(100vh-8rem)]">
        {/* Tab Headers */}
        <div className="sticky top-20 z-30 bg-zinc-50/95 backdrop-blur-sm py-2 mb-6 border-b border-zinc-200/50">
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
                Visual Studio
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
                Copywriting
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow">
          {/* LOADING STATE */}
          {isLoading && (
            <div className="h-[500px] flex flex-col items-center justify-center bg-white/50 rounded-2xl border border-zinc-200 border-dashed">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
              </div>
              <p className="mt-6 text-base font-medium text-zinc-900">
                Generating your assets...
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                This may take a moment
              </p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && generatedAssets.length === 0 && (
            <div className="h-[500px] flex flex-col items-center justify-center bg-white rounded-2xl border border-zinc-200 border-dashed shadow-sm">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100">
                <Sparkles className="w-8 h-8 text-zinc-300" />
              </div>
              <h3 className="text-xl font-serif font-medium text-zinc-900">
                Ready to Create
              </h3>
              <p className="text-zinc-500 max-w-xs text-center mt-3 leading-relaxed text-sm">
                Select asset types, upload your product photos, and add details
                to generate stunning content.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-zinc-400">
                <Circle className="w-2 h-2 fill-current" />
                <span>Complete the 3 steps on the left to begin</span>
              </div>
            </div>
          )}

          {/* VISUALS TAB */}
          {activeTab === "visuals" &&
            !isLoading &&
            generatedAssets.length > 0 && (
              <>
                {visualAssets.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                    {visualAssets.map((asset, index) => (
                      <AssetCard
                        key={`visual-${index}`}
                        asset={asset}
                        onRegenerate={handleRegenerate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-zinc-400 bg-white rounded-xl border border-zinc-100 italic">
                    No visual assets were selected for generation.
                  </div>
                )}
              </>
            )}

          {/* COPY TAB */}
          {activeTab === "copy" && !isLoading && generatedAssets.length > 0 && (
            <>
              {textAssets.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 pb-20 max-w-3xl mx-auto">
                  {textAssets.map((asset, index) => (
                    <AssetCard
                      key={`text-${index}`}
                      asset={asset}
                      onRegenerate={handleRegenerate}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-zinc-400 bg-white rounded-xl border border-zinc-100 italic">
                  No text assets were selected for generation.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Studio;
