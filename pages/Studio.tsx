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
import {
  Card,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn,
} from "../components/ui";
import { usePrompts } from "../contexts/PromptContext";
import { PromptTemplateKey } from "../prompts";

const Studio: React.FC = () => {
  const { renderPrompt } = usePrompts();
  const [files, setFiles] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("visuals");

  // Selection state - Default to nothing or just Description to prompt user action
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
        return "WHITE_BG_GENERAL"; // Fallback
    }
  };

  const getPromptVariables = (details: ProductDetails) => {
    // Calculate derived variables
    const propsInstruction =
      details.stagingProps && details.stagingProps.length > 0
        ? `Add props such as ${details.stagingProps.join(
            ", "
          )} that accent the ${details.type.toLowerCase()}.`
        : "";

    const typeSpecificInstruction =
      details.type === JewelryType.EARRINGS
        ? "Lay the earrings flat and have the camera lens be from above to give an aerial viewpoint. The camera lens is above, creating an arial viewpoint of the layout."
        : "Do not add any lengths to the piece.";

    return {
      ...details,
      propsInstruction,
      typeSpecificInstruction,
      // Normalize simple fields
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

    // Switch to visuals tab initially if any visual asset is selected, otherwise copy
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

      if (errors.length > 0) {
        setError(`Some assets failed to generate: ${errors.join(", ")}`);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const visualAssets = generatedAssets.filter((a) => a.isImage);
  const textAssets = generatedAssets.filter((a) => !a.isImage);

  // Group assets for better display
  const visualTypes = [AssetType.WHITE_BG, AssetType.STAGING, AssetType.MODEL];
  const copyTypes = [AssetType.DESCRIPTION, AssetType.SOCIAL_POST];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* LEFT SIDEBAR - WIZARD INPUTS */}
      <div className="xl:col-span-4 space-y-6 lg:sticky lg:top-28">
        {/* STEP 1: SCOPE */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              1. Project Scope
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-zinc-900 mb-3">
                Visual Assets
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {visualTypes.map((type) => (
                  <div
                    key={type}
                    onClick={() => !isLoading && toggleAssetSelection(type)}
                    className={cn(
                      "relative flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200",
                      selectedAssets.includes(type)
                        ? "border-zinc-900 bg-zinc-900 text-white shadow-md shadow-zinc-900/10"
                        : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-600"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors",
                        selectedAssets.includes(type)
                          ? "border-white bg-white"
                          : "border-zinc-300"
                      )}
                    >
                      {selectedAssets.includes(type) && (
                        <div className="w-2 h-2 bg-zinc-900 rounded-[1px]"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-zinc-900 mb-3">
                Copywriting
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {copyTypes.map((type) => (
                  <div
                    key={type}
                    onClick={() => !isLoading && toggleAssetSelection(type)}
                    className={cn(
                      "relative flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200",
                      selectedAssets.includes(type)
                        ? "border-zinc-900 bg-zinc-900 text-white shadow-md shadow-zinc-900/10"
                        : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-600"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors",
                        selectedAssets.includes(type)
                          ? "border-white bg-white"
                          : "border-zinc-300"
                      )}
                    >
                      {selectedAssets.includes(type) && (
                        <div className="w-2 h-2 bg-zinc-900 rounded-[1px]"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* STEP 2: IMAGERY */}
        <Card className="p-6">
          <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
            2. Visual Context
          </h2>
          <div className="group relative border-2 border-dashed border-zinc-200 rounded-xl p-8 text-center hover:bg-zinc-50/80 transition-all hover:border-zinc-300 cursor-pointer">
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
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 group-hover:text-zinc-700 transition-colors">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <span className="block text-sm font-semibold text-zinc-900">
                {files.length > 0
                  ? `${files.length} images selected`
                  : "Upload raw photos"}
              </span>
              <span className="mt-1 block text-xs text-zinc-400">
                Drag & drop or click to browse
              </span>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* STEP 3: DETAILS */}
        <Card className="p-6 border-zinc-200 shadow-sm relative overflow-hidden">
          <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
            3. Product Intelligence
          </h2>
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
                  Crafting Assets...
                </span>
              ) : (
                "Generate Collection"
              )}
            </Button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 text-center font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* RIGHT CONTENT - RESULTS */}
      <div className="xl:col-span-8 relative min-h-[calc(100vh-8rem)]">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          {/* Sticky Header for Results */}
          <div className="sticky top-20 z-30 bg-zinc-50/95 backdrop-blur-sm py-2 mb-6 border-b border-zinc-200/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
              <h2 className="text-2xl font-serif text-zinc-900 tracking-tight">
                Generated Collection
              </h2>
              <TabsList className="w-full md:w-auto">
                <TabsTrigger
                  value="visuals"
                  activeValue={activeTab}
                  onClick={setActiveTab}
                  className="flex-1 md:flex-none px-6"
                >
                  Visual Studio
                </TabsTrigger>
                <TabsTrigger
                  value="copy"
                  activeValue={activeTab}
                  onClick={setActiveTab}
                  className="flex-1 md:flex-none px-6"
                >
                  Copywriting
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="flex-grow">
            {/* LOADING STATE */}
            {isLoading && (
              <div className="h-[600px] flex flex-col items-center justify-center bg-white/50 rounded-2xl border border-zinc-200 border-dashed animate-pulse">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-serif font-bold text-zinc-900 text-xl">
                    J
                  </div>
                </div>
                <p className="mt-8 text-lg font-medium text-zinc-900">
                  Curating your collection
                </p>
                <p className="text-sm text-zinc-500">
                  Gemini Nano is analyzing visuals and generating content...
                </p>
              </div>
            )}

            {/* EMPTY STATE */}
            {!isLoading && generatedAssets.length === 0 && (
              <div className="h-[600px] flex flex-col items-center justify-center bg-white rounded-2xl border border-zinc-200 border-dashed shadow-sm">
                <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100 shadow-inner">
                  <svg
                    className="w-10 h-10 text-zinc-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-medium text-zinc-900">
                  Workspace Ready
                </h3>
                <p className="text-zinc-500 max-w-sm text-center mt-3 leading-relaxed">
                  Start by selecting your asset types and uploading imagery on
                  the left.
                </p>
              </div>
            )}

            {/* VISUALS TAB */}
            <TabsContent
              value="visuals"
              activeValue={activeTab}
              className="mt-0 h-full"
            >
              {!isLoading && generatedAssets.length > 0 && (
                <>
                  {visualAssets.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                      {visualAssets.map((asset, index) => (
                        <AssetCard key={`visual-${index}`} asset={asset} />
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-zinc-400 bg-white rounded-xl border border-zinc-100 italic">
                      No visual assets selected for generation.
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* COPY TAB */}
            <TabsContent
              value="copy"
              activeValue={activeTab}
              className="mt-0 h-full"
            >
              {!isLoading && generatedAssets.length > 0 && (
                <>
                  {textAssets.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 pb-20 max-w-3xl mx-auto">
                      {textAssets.map((asset, index) => (
                        <AssetCard key={`text-${index}`} asset={asset} />
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-zinc-400 bg-white rounded-xl border border-zinc-100 italic">
                      No text assets selected for generation.
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Studio;
