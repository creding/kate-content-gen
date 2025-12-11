"use client";

import React, { useState, useMemo } from "react";
import { AssetType, JewelryType, ProductDetails } from "@/types";
import { generateAsset, detectJewelryType } from "@/services/geminiService";
import {
  Card,
  Button,
  Input,
  Label,
  Select,
  Textarea,
  cn,
} from "@/components/ui";
import { usePrompts } from "@/contexts/PromptContext";
import { useToast } from "@/contexts/ToastContext";
import { useBrand } from "@/contexts/BrandContext";
import { PromptTemplateKey } from "@/prompts";
import {
  Upload,
  X,
  FileText,
  Share2,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

const Copywriting: React.FC = () => {
  const { renderPrompt } = usePrompts();
  const { addToast } = useToast();
  const { settings: brandSettings } = useBrand();

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [generationType, setGenerationType] = useState<
    "description" | "social" | "both"
  >("both");

  // Generated content
  const [description, setDescription] = useState("");
  const [socialPost, setSocialPost] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [details, setDetails] = useState<ProductDetails>({
    name: "",
    type: JewelryType.NECKLACE,
    stone: "",
    shape: "",
    material: "",
    visualCharacteristic: "",
    necklaceLengthValue: "",
    accentDetail: brandSettings.defaultAccentDetail,
    claspType: brandSettings.defaultClaspType,
    stagingProps: [],
  });

  const handleChange = (field: keyof ProductDetails, value: any) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setFile(newFile);

      // Auto-detect jewelry type
      setIsDetecting(true);
      try {
        const detectedType = await detectJewelryType(newFile);
        setDetails((prev) => ({ ...prev, type: detectedType }));
        addToast(`Detected: ${detectedType}`, "success");
      } catch (err) {
        console.error("Auto-detect failed:", err);
      } finally {
        setIsDetecting(false);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const getTemplateKey = (
    type: "description" | "social"
  ): PromptTemplateKey => {
    if (type === "description") {
      return details.type === JewelryType.EARRINGS
        ? "DESCRIPTION_EARRINGS"
        : "DESCRIPTION_NECKLACE";
    }
    return "SOCIAL";
  };

  const getPromptVariables = () => {
    const lengthDescription = details.necklaceLengthValue
      ? `The necklace is ${details.necklaceLengthValue} inches long.`
      : "";

    return {
      ...details,
      lengthDescription,
      type: details.type.toLowerCase(),
    };
  };

  const handleGenerate = async () => {
    if (!file) {
      addToast("Please upload a product image", "error");
      return;
    }

    setIsLoading(true);
    const variables = getPromptVariables();

    try {
      // Generate description
      if (generationType === "description" || generationType === "both") {
        const descPrompt = renderPrompt(
          getTemplateKey("description"),
          variables
        );
        const descResult = await generateAsset(
          [file],
          AssetType.DESCRIPTION,
          descPrompt,
          null
        );
        setDescription(descResult.content);
      }

      // Generate social post
      if (generationType === "social" || generationType === "both") {
        const socialPrompt = renderPrompt(getTemplateKey("social"), variables);
        const socialResult = await generateAsset(
          [file],
          AssetType.SOCIAL_POST,
          socialPrompt,
          null
        );
        setSocialPost(socialResult.content);
      }

      addToast("Copy generated successfully!", "success");
    } catch (err: any) {
      addToast(`Generation failed: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (type: "description" | "social") => {
    if (!file) return;

    setIsLoading(true);
    const variables = getPromptVariables();

    try {
      if (type === "description") {
        const prompt = renderPrompt(getTemplateKey("description"), variables);
        const result = await generateAsset(
          [file],
          AssetType.DESCRIPTION,
          prompt,
          null
        );
        setDescription(result.content);
      } else {
        const prompt = renderPrompt(getTemplateKey("social"), variables);
        const result = await generateAsset(
          [file],
          AssetType.SOCIAL_POST,
          prompt,
          null
        );
        setSocialPost(result.content);
      }
      addToast(
        `${
          type === "description" ? "Description" : "Social post"
        } regenerated!`,
        "success"
      );
    } catch (err: any) {
      addToast(`Regeneration failed: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    addToast("Copied to clipboard!", "success");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const hasContent = description || socialPost;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Copywriting Studio
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate product descriptions and social media posts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Input Form */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Product Image
              </h2>

              {!file ? (
                <div
                  onClick={() => document.getElementById("copyFile")?.click()}
                  className="relative cursor-pointer rounded-xl border-2 border-dashed border-border bg-background p-8 text-center hover:border-zinc-300 hover:bg-secondary transition-all"
                >
                  <input
                    id="copyFile"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center">
                    <div className="mb-2 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Click to upload product image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Product"
                    className="w-full h-48 object-contain rounded-lg bg-secondary"
                  />
                  <button
                    onClick={removeFile}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  {isDetecting && (
                    <div className="absolute bottom-2 left-2 text-xs text-white bg-black/60 px-2 py-1 rounded">
                      Detecting type...
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Product Details */}
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                Product Details
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Jewelry Type</Label>
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
                    <Label className="text-xs">Product Name</Label>
                    <Input
                      value={details.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="e.g. The Royal Amethyst"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Material</Label>
                    <Input
                      value={details.material}
                      onChange={(e) => handleChange("material", e.target.value)}
                      placeholder="e.g. 14k Gold"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Stone Type</Label>
                    <Input
                      value={details.stone}
                      onChange={(e) => handleChange("stone", e.target.value)}
                      placeholder="e.g. Sapphire"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Stone Shape</Label>
                    <Input
                      value={details.shape}
                      onChange={(e) => handleChange("shape", e.target.value)}
                      placeholder="e.g. Oval"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Visual Trait</Label>
                    <Input
                      value={details.visualCharacteristic}
                      onChange={(e) =>
                        handleChange("visualCharacteristic", e.target.value)
                      }
                      placeholder="e.g. deep blue"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {details.type === JewelryType.NECKLACE && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Length (inches)</Label>
                      <Input
                        value={details.necklaceLengthValue || ""}
                        onChange={(e) =>
                          handleChange("necklaceLengthValue", e.target.value)
                        }
                        placeholder="18"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Clasp Type</Label>
                      <Input
                        value={details.claspType || ""}
                        onChange={(e) =>
                          handleChange("claspType", e.target.value)
                        }
                        placeholder="Lobster"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {details.type === JewelryType.EARRINGS && (
                  <div>
                    <Label className="text-xs">Hook/Post Type</Label>
                    <Input
                      value={details.hookType || ""}
                      onChange={(e) => handleChange("hookType", e.target.value)}
                      placeholder="e.g. French Hook"
                      disabled={isLoading}
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Generation Options */}
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                Generate
              </h2>

              <div className="flex gap-2 mb-4">
                {[
                  { value: "both", label: "Both", icon: Sparkles },
                  {
                    value: "description",
                    label: "Description",
                    icon: FileText,
                  },
                  { value: "social", label: "Social Post", icon: Share2 },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setGenerationType(value as any)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all",
                      generationType === value
                        ? "bg-primary text-white border-zinc-900"
                        : "bg-card text-muted-foreground border-border hover:border-zinc-300"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isLoading || !file}
                className="w-full"
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
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Generate Copy
                  </span>
                )}
              </Button>
            </Card>
          </div>

          {/* RIGHT: Generated Content */}
          <div className="space-y-6">
            {!hasContent ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center text-muted-foreground">
                  <FileText className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm">
                    Upload an image and fill in product details
                  </p>
                  <p className="text-xs mt-1">
                    Generated copy will appear here
                  </p>
                </div>
              </Card>
            ) : (
              <>
                {/* Product Description */}
                {description && (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Product Description
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRegenerate("description")}
                          disabled={isLoading}
                          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title="Regenerate"
                        >
                          <RefreshCw
                            className={cn(
                              "w-4 h-4",
                              isLoading && "animate-spin"
                            )}
                          />
                        </button>
                        <button
                          onClick={() =>
                            copyToClipboard(description, "description")
                          }
                          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title="Copy"
                        >
                          {copiedField === "description" ? (
                            <Check className="w-4 h-4 text-accent" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[200px] text-sm"
                      placeholder="Generated description will appear here..."
                    />
                  </Card>
                )}

                {/* Social Media Post */}
                {socialPost && (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Social Media Post
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRegenerate("social")}
                          disabled={isLoading}
                          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title="Regenerate"
                        >
                          <RefreshCw
                            className={cn(
                              "w-4 h-4",
                              isLoading && "animate-spin"
                            )}
                          />
                        </button>
                        <button
                          onClick={() => copyToClipboard(socialPost, "social")}
                          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title="Copy"
                        >
                          {copiedField === "social" ? (
                            <Check className="w-4 h-4 text-accent" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Textarea
                      value={socialPost}
                      onChange={(e) => setSocialPost(e.target.value)}
                      className="min-h-[150px] text-sm"
                      placeholder="Generated social post will appear here..."
                    />
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Copywriting;
