import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  RotateCcw,
  Type,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Sparkles,
  Tag,
  Upload,
  X,
} from "lucide-react";
import { Button, Card, Label, Textarea, Input, cn } from "../components/ui";
import { usePrompts } from "../contexts/PromptContext";
import { useBrand } from "../contexts/BrandContext";
import { useToast } from "../contexts/ToastContext";
import { PromptTemplateKey } from "../prompts";

const Settings: React.FC = () => {
  const { templates, updateTemplate, resetTemplates } = usePrompts();
  const {
    settings: brandSettings,
    updateSettings: updateBrand,
    setLogo,
    clearLogo,
  } = useBrand();
  const { addToast } = useToast();
  const [activeSection, setActiveSection] = useState("brand");

  const handleResetPrompts = () => {
    if (
      confirm(
        "Are you sure you want to reset all prompts to their defaults? This cannot be undone."
      )
    ) {
      resetTemplates();
      addToast("Prompts reset to defaults", "success");
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await setLogo(e.target.files[0]);
      addToast("Logo saved!", "success");
    }
  };

  const sections = [
    {
      id: "brand",
      label: "Brand Assets",
      icon: Tag,
      content: (
        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-1">
              Brand Logo
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              This logo will automatically be used for Lifestyle Scene staging
              photos.
            </p>

            {brandSettings.logoDataUrl ? (
              <div className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border">
                <div className="w-16 h-16 rounded-lg bg-card border border-border flex items-center justify-center overflow-hidden shadow-sm">
                  <img
                    src={brandSettings.logoDataUrl}
                    alt="Brand Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {brandSettings.logoFileName}
                  </p>
                  <p className="text-xs text-muted-foreground">Saved to browser</p>
                </div>
                <div className="flex gap-2">
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center justify-center rounded-lg text-xs font-medium h-8 px-3 bg-secondary text-foreground hover:bg-muted transition-colors">
                      Replace
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <Button
                    variant="outline"
                    onClick={() => {
                      clearLogo();
                      addToast("Logo removed", "info");
                    }}
                    className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-background hover:border-zinc-300 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:bg-muted group-hover:text-muted-foreground transition-colors">
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className="block text-sm font-medium text-foreground">
                    Upload your brand logo
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    PNG or JPG, will be used on product tags
                  </span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-1">
              Default Form Values
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              These values will be pre-filled in the Studio form.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Default Clasp Type</Label>
                <Input
                  type="text"
                  value={brandSettings.defaultClaspType}
                  onChange={(e) =>
                    updateBrand({ defaultClaspType: e.target.value })
                  }
                  placeholder="e.g. Lobster"
                />
              </div>
              <div>
                <Label className="mb-1.5 block">Default Accent Detail</Label>
                <Input
                  type="text"
                  value={brandSettings.defaultAccentDetail}
                  onChange={(e) =>
                    updateBrand({ defaultAccentDetail: e.target.value })
                  }
                  placeholder="e.g. Signature Tag"
                />
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: "prompts-visuals",
      label: "Visual Prompts",
      icon: ImageIcon,
      description: "Customize generation for images",
      isPrompt: true,
      filter: (key: string) =>
        ["STAGING", "MODEL", "WHITE"].some((k) => key.includes(k)),
    },
    {
      id: "prompts-copy",
      label: "Copywriting Prompts",
      icon: Type,
      description: "Customize text generation",
      isPrompt: true,
      filter: (key: string) =>
        ["DESCRIPTION", "SOCIAL"].some((k) => key.includes(k)),
    },
    {
      id: "general",
      label: "General",
      icon: SettingsIcon,
      content: (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            General Settings
          </h3>
          <p className="text-sm text-muted-foreground">
            Additional settings will appear here in future updates.
          </p>
        </Card>
      ),
    },
  ];

  const activeContent = sections.find((s) => s.id === activeSection);

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full bg-card hover:bg-background border-border"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-medium text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage studio preferences and AI templates
            </p>
          </div>
        </div>

        {activeSection.startsWith("prompts") && (
          <Button
            variant="outline"
            onClick={handleResetPrompts}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-border"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Prompts
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 flex flex-col gap-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left",
                activeSection === section.id
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <section.icon
                className={cn(
                  "w-4 h-4",
                  activeSection === section.id
                    ? "text-zinc-300"
                    : "text-muted-foreground"
                )}
              />
              {section.label}
            </button>
          ))}

          <div className="mt-8 px-4">
            <div className="p-4 bg-background rounded-xl border border-border/60">
              <div className="flex items-center gap-2 text-foreground font-serif font-medium mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Pro Tip
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-foreground">
                  {"{{name}}"}
                </code>{" "}
                in prompts to insert the product name dynamically.
              </p>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-9 space-y-6">
          {activeContent?.isPrompt ? (
            <div className="space-y-6">
              <div className="mb-2">
                <h2 className="text-lg font-medium text-foreground">
                  {activeContent.label}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeContent.description}
                </p>
              </div>

              {Object.entries(templates)
                .filter(([key]) => activeContent.filter!(key))
                .map(([key, content]) => (
                  <Card
                    key={key}
                    className="overflow-hidden border-border shadow-sm transition-all hover:border-zinc-300"
                  >
                    <div className="bg-background/50 border-b border-border px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                          {key}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                        Template
                      </span>
                    </div>

                    <div className="p-0">
                      <Label htmlFor={key} className="sr-only">
                        Template Content
                      </Label>
                      <Textarea
                        id={key}
                        value={content}
                        onChange={(e) =>
                          updateTemplate(
                            key as PromptTemplateKey,
                            e.target.value
                          )
                        }
                        className="font-mono text-sm leading-relaxed p-4 h-48 border-0 shadow-none focus-visible:ring-0 resize-y bg-card text-zinc-800 rounded-none w-full"
                        placeholder="Enter prompt template..."
                        spellCheck={false}
                      />
                    </div>
                    <div className="bg-background px-4 py-2 border-t border-border text-[10px] text-muted-foreground flex justify-end gap-2 font-mono">
                      {(content.match(/{{[a-zA-Z0-9]+}}/g) || []).join("  ") ||
                        "No variables"}
                    </div>
                  </Card>
                ))}
            </div>
          ) : (
            activeContent?.content
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
