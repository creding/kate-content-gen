"use server";

import { GoogleGenAI } from "@google/genai";
import { AssetType, GeneratedAsset, JewelryType } from "@/types";
import fs from "fs/promises";
import path from "path";

const getSystemInstruction = () => {
  return "You are an expert jewelry product photographer and copywriter. You specialize in high-end, luxurious aesthetics.";
};

// Helper to get base64 from URL (remote, data URI, or local public file)
const urlToGenerativePart = async (
  url: string
): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  // Handle Data URIs
  if (url.startsWith("data:")) {
    const mimeType = url.substring(5, url.indexOf(";"));
    const data = url.substring(url.indexOf(",") + 1);
    return {
      inlineData: {
        data,
        mimeType,
      },
    };
  }

  // Handle Local Public Files (Relative URLs)
  if (url.startsWith("/")) {
    try {
      const filePath = path.join(process.cwd(), "public", url);
      const buffer = await fs.readFile(filePath);
      const base64String = buffer.toString("base64");

      const ext = path.extname(url).toLowerCase();
      let mimeType = "image/jpeg";
      if (ext === ".png") mimeType = "image/png";
      if (ext === ".webp") mimeType = "image/webp";

      return {
        inlineData: {
          data: base64String,
          mimeType,
        },
      };
    } catch (e) {
      console.error(`Failed to read local file ${url}:`, e);
      throw new Error(`Failed to load local asset: ${url}`);
    }
  }

  // Handle Remote URLs
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${url}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = response.headers.get("content-type") || "image/jpeg";
  return {
    inlineData: {
      data: base64String,
      mimeType,
    },
  };
};

interface GenerateAssetParams {
  assetType: AssetType;
  prompt: string;
  imageUrls: string[];
  logoUrl?: string | null;
}

export const generateAssetAction = async ({
  assetType,
  prompt,
  imageUrls,
  logoUrl,
}: GenerateAssetParams): Promise<GeneratedAsset> => {
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "API Key is missing. Please check your environment variables."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  console.log("--- GEMINI PROMPT BEGIN ---");
  console.log(prompt);
  console.log("--- GEMINI PROMPT END ---");
  console.log(`Processing ${imageUrls.length} images...`);

  // Combine product files and optional logo file
  const urlsToProcess = [...imageUrls];
  if (assetType === AssetType.STAGING && logoUrl) {
    urlsToProcess.push(logoUrl);
  }

  // Convert all URLs to inlineData parts
  const imageParts = await Promise.all(
    urlsToProcess.map((url) => urlToGenerativePart(url))
  );

  let modelName = "gemini-3-pro-image-preview";
  let isImageOutput = true;

  // Determine model and output type based on AssetType
  switch (assetType) {
    case AssetType.DESCRIPTION:
    case AssetType.SOCIAL_POST:
      modelName = "gemini-2.5-flash"; // Text model
      isImageOutput = false;
      break;
    default:
      // Keep default for images
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        // @ts-ignore - type definition might slightly differ for single object but this is valid for SDK
        role: "user",
        parts: [...imageParts, { text: prompt }],
      },
      config: {
        systemInstruction: !isImageOutput ? getSystemInstruction() : undefined,
      },
    });

    let content = "";

    if (isImageOutput) {
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            content = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
      if (!content && response.text) {
        // Sometimes it returns text explaining why it failed or if it misunderstood
        throw new Error(`Generation failed: ${response.text}`);
      }
    } else {
      content = response.text || "No text generated.";
    }

    if (!content) {
      throw new Error("No content generated.");
    }

    return {
      type: assetType,
      content,
      isImage: isImageOutput,
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(
      error.message || "An unexpected error occurred during generation."
    );
  }
};

// Helper to convert File to base64 string (Keep for detection)
const fileToGenerativePart = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64");
  return base64String;
};

export const detectJewelryTypeAction = async (
  formData: FormData
): Promise<JewelryType> => {
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file uploaded for detection.");
  }

  const imageData = await fileToGenerativePart(file);

  const prompt = `Look at this jewelry image and identify what type of jewelry it is.
  
Respond with ONLY ONE of these exact words:
- Necklace
- Earrings
- Ring
- Bracelet
- Other

Just the single word, nothing else.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: imageData, mimeType: file.type } },
            { text: prompt },
          ],
        },
      ],
    });

    const text = response.text?.trim() || "";

    const typeMap: Record<string, JewelryType> = {
      necklace: JewelryType.NECKLACE,
      earrings: JewelryType.EARRINGS,
      ring: JewelryType.RING,
      bracelet: JewelryType.BRACELET,
      other: JewelryType.OTHER,
    };

    const detected = typeMap[text.toLowerCase()] || JewelryType.OTHER;
    return detected;
  } catch (error) {
    console.error("Error detecting jewelry type:", error);
    return JewelryType.NECKLACE; // Default fallback
  }
};
