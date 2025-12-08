import React, { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_TEMPLATES, PromptTemplateKey } from "../prompts";
import { JewelryType, NecklaceLength } from "../types";

// Helper for necklace length descriptions (moved from prompts.ts)
const getNecklaceLengthDescription = (length: NecklaceLength): string => {
  switch (length) {
    case NecklaceLength.COLLAR:
      return "The necklace should fit tightly around the neck (12-14 inches).";
    case NecklaceLength.CHOKER:
      return "The necklace should sit at the base of the neck (14-16 inches).";
    case NecklaceLength.PRINCESS:
      return "The necklace should sit on the collarbone (17-19 inches).";
    case NecklaceLength.MATINEE:
      return "The necklace should sit between the collarbone and the bust (20-24 inches).";
    case NecklaceLength.OPERA:
      return "The necklace should hang low, below the bust (28-36 inches).";
    case NecklaceLength.ROPE:
      return "The necklace should hang very low, near the waist (over 36 inches).";
    default:
      return "";
  }
};

interface PromptContextType {
  templates: typeof DEFAULT_TEMPLATES;
  updateTemplate: (key: PromptTemplateKey, content: string) => void;
  resetTemplates: () => void;
  renderPrompt: (
    key: PromptTemplateKey,
    variables: Record<string, any>
  ) => string;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [templates, setTemplates] =
    useState<typeof DEFAULT_TEMPLATES>(DEFAULT_TEMPLATES);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("prompt_templates");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTemplates({ ...DEFAULT_TEMPLATES, ...parsed });
      } catch (e) {
        console.error("Failed to parse saved prompts");
      }
    }
  }, []);

  const updateTemplate = (key: PromptTemplateKey, content: string) => {
    const newTemplates = { ...templates, [key]: content };
    setTemplates(newTemplates);
    localStorage.setItem("prompt_templates", JSON.stringify(newTemplates));
  };

  const resetTemplates = () => {
    setTemplates(DEFAULT_TEMPLATES);
    localStorage.removeItem("prompt_templates");
  };

  const renderPrompt = (
    key: PromptTemplateKey,
    variables: Record<string, any>
  ): string => {
    let text = templates[key];

    // Pre-calculate derived variables if processing MODEL_NECKLACE
    if (key === "MODEL_NECKLACE" && variables.necklaceLength) {
      variables.lengthDescription = getNecklaceLengthDescription(
        variables.necklaceLength
      );
    }

    // Process variables
    Object.entries(variables).forEach(([name, value]) => {
      // Simple regex for {{name}}
      const regex = new RegExp(`{{${name}}}`, "g");
      text = text.replace(regex, String(value || ""));
    });

    // Cleanup empty derived vars if not present
    text = text.replace(/{{[a-zA-Z0-9]+}}/g, "");

    return text;
  };

  return (
    <PromptContext.Provider
      value={{ templates, updateTemplate, resetTemplates, renderPrompt }}
    >
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompts = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error("usePrompts must be used within a PromptProvider");
  }
  return context;
};
