import { GoogleGenAI } from "@google/genai";
import { AssetType, GeneratedAsset, JewelryType, NecklaceLength, ProductDetails } from "../types";
import { DESCRIPTION_PROMPT, MODEL_PROMPT, SOCIAL_PROMPT, STAGING_PROMPT, WHITE_BG_PROMPT } from "../prompts";

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
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateAsset = async (
  files: File[], 
  assetType: AssetType, 
  details: ProductDetails,
  logoFile?: File | null
): Promise<GeneratedAsset> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Combine product files and optional logo file if it's a Staging Request
  const filesToProcess = [...files];
  if (assetType === AssetType.STAGING && logoFile) {
    filesToProcess.push(logoFile);
  }

  // Convert all files to inlineData parts
  const imageParts = await Promise.all(filesToProcess.map(async (file) => ({
    inlineData: {
      data: await fileToGenerativePart(file),
      mimeType: file.type
    }
  })));

  let modelName = 'gemini-2.5-flash-image'; // Default for images per "nano banana" mapping
  let prompt = '';
  let isImageOutput = true;

  switch (assetType) {
    case AssetType.STAGING:
      prompt = STAGING_PROMPT(details.type, details.stagingProps);
      break;
    case AssetType.MODEL:
      prompt = MODEL_PROMPT(details);
      break;
    case AssetType.WHITE_BG:
      prompt = WHITE_BG_PROMPT(details.type);
      break;
    case AssetType.DESCRIPTION:
      modelName = 'gemini-2.5-flash'; // Text model
      prompt = DESCRIPTION_PROMPT(details);
      isImageOutput = false;
      break;
    case AssetType.SOCIAL_POST:
      modelName = 'gemini-2.5-flash'; // Text model
      prompt = SOCIAL_PROMPT;
      isImageOutput = false;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [...imageParts, { text: prompt }]
      },
      config: {
        // Only include system instructions for text generation models or if supported by the image model
        systemInstruction: !isImageOutput ? getSystemInstruction() : undefined,
      }
    });

    let content = '';

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
      isImage: isImageOutput
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};