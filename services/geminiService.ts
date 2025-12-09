import { GoogleGenAI } from "@google/genai";
import { AssetType, GeneratedAsset, JewelryType } from "../types";

const getSystemInstruction = () => {
  return "You are an expert jewelry product photographer and copywriter. You specialize in high-end, luxurious aesthetics.";
};

// Helper to convert File to base64 string
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL part if present (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateAsset = async (
  files: File[],
  assetType: AssetType,
  prompt: string,
  logoFile?: File | null
): Promise<GeneratedAsset> => {
  if (!process.env.API_KEY) {
    throw new Error(
      "API Key is missing. Please check your environment variables."
    );
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Combine product files and optional logo file if it's a Staging Request
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

  let modelName = "gemini-2.5-flash-image"; // Default for images per "nano banana" mapping
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
        // Only include system instructions for text generation models or if supported by the image model
        systemInstruction: !isImageOutput ? getSystemInstruction() : undefined,
      },
    });

    let content = "";

    if (isImageOutput) {
      // Iterate through parts to find the image
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            content = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
      // Fallback if no inlineData but text (some models return text url) - unlikely with 2.5 flash image direct gen but good safety
      if (!content && response.text) {
        // If the model refused and returned text, we might want to throw it or return it
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
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Detect jewelry type from an uploaded image using Gemini
 */
export const detectJewelryType = async (file: File): Promise<JewelryType> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

    // Map response to JewelryType enum
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
