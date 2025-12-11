"use server";

import { GoogleGenAI } from "@google/genai";
import { AssetType, GeneratedAsset, JewelryType } from "@/types";

const getSystemInstruction = () => {
  return "You are an expert jewelry product photographer and copywriter. You specialize in high-end, luxurious aesthetics.";
};

// Helper to convert File to base64 string
const fileToGenerativePart = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64");
  return base64String;
};

export const generateAssetAction = async (
  formData: FormData
): Promise<GeneratedAsset> => {
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "API Key is missing. Please check your environment variables."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  // Extract data from FormData
  const assetType = formData.get("assetType") as AssetType;
  const prompt = formData.get("prompt") as string;
  const files = formData.getAll("files") as File[];
  const logoFile = formData.get("logoFile") as File | null;

  // Combine product files and optional logo file
  const filesToProcess = [...files];
  if (assetType === AssetType.STAGING && logoFile) {
    filesToProcess.push(logoFile);
  }

  // Convert all files to inlineData parts
  const imageParts = await Promise.all(
    filesToProcess.map(async (file) => ({
      inlineData: {
        data: await fileToGenerativePart(file),
        mimeType: file.type,
      },
    }))
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
