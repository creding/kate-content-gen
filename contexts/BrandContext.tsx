import React, { createContext, useContext, useState, useEffect } from "react";

interface BrandSettings {
  logoDataUrl: string | null;
  logoFileName: string | null;
  defaultClaspType: string;
  defaultAccentDetail: string;
}

const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  logoDataUrl: null,
  logoFileName: null,
  defaultClaspType: "Lobster",
  defaultAccentDetail: "Signature Tag",
};

interface BrandContextType {
  settings: BrandSettings;
  updateSettings: (updates: Partial<BrandSettings>) => void;
  setLogo: (file: File) => Promise<void>;
  clearLogo: () => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<BrandSettings>(
    DEFAULT_BRAND_SETTINGS
  );

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("brand_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_BRAND_SETTINGS, ...parsed });
      } catch (e) {
        console.error("Failed to parse brand settings");
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("brand_settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<BrandSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const setLogo = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setSettings((prev) => ({
          ...prev,
          logoDataUrl: dataUrl,
          logoFileName: file.name,
        }));
        resolve();
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const clearLogo = () => {
    setSettings((prev) => ({
      ...prev,
      logoDataUrl: null,
      logoFileName: null,
    }));
  };

  return (
    <BrandContext.Provider
      value={{ settings, updateSettings, setLogo, clearLogo }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
};
