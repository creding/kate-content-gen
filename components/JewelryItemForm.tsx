"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import { Button, Input, Label, Textarea, Card } from "./ui";
// Removed bad imports
import {
  JewelryType,
  JewelryItemInsert,
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
} from "@/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import AttributeInput from "./AttributeInput";

interface JewelryItemFormProps {
  initialData?: Partial<JewelryItemInsert>;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

export default function JewelryItemForm({
  initialData,
  mode = "create",
  onSuccess,
}: JewelryItemFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [type, setType] = useState<JewelryType>(
    (initialData?.type as JewelryType) || JewelryType.NECKLACE
  );

  // Details State
  const initialDetails =
    (initialData?.details as unknown as ProductDetails) || {};
  const [details, setDetails] = useState<ProductDetails>({
    // Spread initial first
    ...initialDetails,
    // Overrides and Defaults
    name: name,
    type: type,
    stone: initialDetails.stone || "",
    shape: initialDetails.shape || "",
    material: initialDetails.material || "",
    visualCharacteristic: initialDetails.visualCharacteristic || "",
    stoneDimensions: initialDetails.stoneDimensions || "",
    stoneGrade: initialDetails.stoneGrade || "",
    necklaceLengthValue: initialDetails.necklaceLengthValue || "",
    claspType: initialDetails.claspType || "",
    chainMaterial: initialDetails.chainMaterial || "",
    charmDetails: initialDetails.charmDetails || "",
    idealWear: initialDetails.idealWear || "Built for everyday use",

    // Generation Defaults
    stagingProps: initialDetails.stagingProps || [
      "Gift Box",
      "Fresh Flowers",
      "Silk Ribbon",
    ],
    stagingSurface: initialDetails.stagingSurface || StagingSurface.MARBLE,
    lightingMood: initialDetails.lightingMood || LightingMood.SOFT,
    stagingLayout: initialDetails.stagingLayout || StagingLayout.DRAPED,
    whiteBgAngle: initialDetails.whiteBgAngle || WhiteBgAngle.TOP_DOWN,
    whiteBgFraming:
      initialDetails.whiteBgFraming || WhiteBgFraming.FULL_PRODUCT,
    whiteBgShadow: initialDetails.whiteBgShadow || WhiteBgShadow.NONE,
    modelSkinTone: initialDetails.modelSkinTone || ModelSkinTone.LIGHT,
    modelShotType: initialDetails.modelShotType || ModelShotType.CLOSE_UP,
    modelBackground:
      initialDetails.modelBackground || ModelBackground.LIFESTYLE,
    modelLighting: initialDetails.modelLighting || ModelLighting.SOFT_NATURAL,
    modelClothing: initialDetails.modelClothing || ModelClothing.WHITE,
  });

  // Images State
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images || []
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = supabase;
    if (!user || !client) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Upload New Images
      const uploadedUrls: string[] = [];

      // Helper to save attributes
      const saveAttribute = async (category: string, value: string) => {
        if (!value || !value.trim()) return;
        // Check if exists could be skipped via UNIQUE constraint + ON CONFLICT DO NOTHING
        // but Supabase JS doesn't expose easy ON CONFLICT without setup.
        // We'll trust the unique constraint or check locally.
        // Simpler: Just try insert and ignore error.
        try {
          await client
            .from("jewelry_attributes")
            .insert({ category, value: value.trim(), user_id: user.id })
            .select();
        } catch (e) {
          // Ignore duplicate error
        }
      };

      // Save attributes
      await Promise.all([
        saveAttribute("material", details.material || ""),
        saveAttribute("gemstone", details.stone || ""),
        saveAttribute("shape", details.shape || ""),
        saveAttribute(
          "visual_characteristic",
          details.visualCharacteristic || ""
        ),
        saveAttribute("stone_dimensions", details.stoneDimensions || ""),
        saveAttribute("stone_grade", details.stoneGrade || ""),
        saveAttribute("chain_material", details.chainMaterial || ""),
        saveAttribute("charm_detail", details.charmDetails || ""),
        saveAttribute("clasp_type", details.claspType || ""),
        saveAttribute("ideal_wear", details.idealWear || ""),
      ]);

      // Upload files
      for (const file of newFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await client.storage
          .from("jewelry-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = client.storage.from("jewelry-images").getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      // 2. Save Item to DB
      const itemData: JewelryItemInsert = {
        user_id: user.id,
        name,
        description,
        type,
        images: [...existingImages, ...uploadedUrls],
        details: {
          ...details,
          name, // Sync name
          type, // Sync type
        } as any, // Cast to any for JSONB compatibility if needed
      };

      if (mode === "edit" && initialData?.id) {
        const { error } = await client
          .from("jewelry_items")
          .update(itemData)
          .eq("id", initialData.id);
        if (error) throw error;
      } else {
        const { error } = await client.from("jewelry_items").insert(itemData);
        if (error) throw error;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Error saving item:", err);
      setError(err.message || "Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setDetails((prev) => ({ ...prev, name: e.target.value }));
            }}
            placeholder="e.g. Sapphire Pendant"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <div className="relative">
            <select
              id="type"
              className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={type}
              onChange={(e) => {
                const t = e.target.value as JewelryType;
                setType(t);
                setDetails((prev) => ({ ...prev, type: t }));
              }}
            >
              {Object.values(JewelryType).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Internal notes or base description..."
            rows={3}
          />
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Product Details</h2>
        <p className="text-sm text-muted-foreground">Used for AI generation.</p>

        <div className="grid grid-cols-2 gap-4">
          <AttributeInput
            category="material"
            label="Material"
            value={details.material}
            onChange={(v) => setDetails((prev) => ({ ...prev, material: v }))}
            placeholder="e.g. 18k Gold"
          />
          <AttributeInput
            category="gemstone"
            label="Gemstone"
            value={details.stone}
            onChange={(v) => setDetails((prev) => ({ ...prev, stone: v }))}
            placeholder="e.g. Diamond"
          />
          <AttributeInput
            category="shape"
            label="Shape/Cut"
            value={details.shape}
            onChange={(v) => setDetails((prev) => ({ ...prev, shape: v }))}
            placeholder="e.g. Oval"
          />
          <AttributeInput
            category="visual_characteristic"
            label="Visual Characteristic"
            value={details.visualCharacteristic}
            onChange={(v) =>
              setDetails((prev) => ({ ...prev, visualCharacteristic: v }))
            }
            placeholder="e.g. Vintage"
          />
          <div className="space-y-2">
            <Label>Stone Dimensions</Label>
            <Input
              value={details.stoneDimensions}
              onChange={(e) =>
                setDetails((prev) => ({
                  ...prev,
                  stoneDimensions: e.target.value,
                }))
              }
              placeholder="e.g. 5.5mm x 6.7mm"
            />
          </div>
          <div className="space-y-2">
            <Label>Stone Grade</Label>
            <Input
              value={details.stoneGrade}
              onChange={(e) =>
                setDetails((prev) => ({ ...prev, stoneGrade: e.target.value }))
              }
              placeholder="e.g. AA+ to AAA"
            />
          </div>

          {/* New Fields for Description Completeness */}
          <div className="space-y-2">
            <Label>Length (inches)</Label>
            <Input
              value={details.necklaceLengthValue}
              onChange={(e) =>
                setDetails((prev) => ({
                  ...prev,
                  necklaceLengthValue: e.target.value,
                }))
              }
              placeholder="e.g. 18"
            />
          </div>
          <div className="space-y-2">
            <Label>Clasp Type</Label>
            <Input
              value={details.claspType}
              onChange={(e) =>
                setDetails((prev) => ({ ...prev, claspType: e.target.value }))
              }
              placeholder="e.g. Spring ring"
            />
          </div>

          <div className="space-y-2">
            <Label>Chain/Base Material</Label>
            <Input
              value={details.chainMaterial}
              onChange={(e) =>
                setDetails((prev) => ({
                  ...prev,
                  chainMaterial: e.target.value,
                }))
              }
              placeholder="e.g. Freshwater Pearls"
            />
          </div>
          <div className="space-y-2">
            <Label>Charm/Detail</Label>
            <Input
              value={details.charmDetails}
              onChange={(e) =>
                setDetails((prev) => ({
                  ...prev,
                  charmDetails: e.target.value,
                }))
              }
              placeholder="e.g. Crown charm"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Ideal Wear</Label>
            <Input
              value={details.idealWear}
              onChange={(e) =>
                setDetails((prev) => ({ ...prev, idealWear: e.target.value }))
              }
              placeholder="e.g. Built for everyday use"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Images</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Existing Images */}
          {existingImages.map((src, idx) => (
            <div
              key={`existing-${idx}`}
              className="relative aspect-square rounded-md overflow-hidden border border-border"
            >
              <img
                src={src}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(idx)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {/* New Files */}
          {newFiles.map((file, idx) => (
            <div
              key={`new-${idx}`}
              className="relative aspect-square rounded-md overflow-hidden border border-border bg-secondary/20"
            >
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-full object-cover opacity-80"
              />
              <button
                type="button"
                onClick={() => removeNewFile(idx)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-1 right-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                New
              </div>
            </div>
          ))}

          {/* Upload Button */}
          <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-secondary/50 transition-colors">
            <Upload className="w-6 h-6 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground">Add Image</span>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/*"
            />
          </label>
        </div>
      </Card>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {mode === "create" ? "Create Item" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
