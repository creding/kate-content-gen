import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Type,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Sparkles,
} from "lucide-react";
import { Button, Card, Label, Textarea, cn } from "../components/ui";
import { usePrompts } from "../contexts/PromptContext";
import { PromptTemplateKey } from "../prompts";

const Settings: React.FC = () => {
  const { templates, updateTemplate, resetTemplates } = usePrompts();
  const [activeSection, setActiveSection] = useState("prompts-visuals");

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all prompts to their defaults? This cannot be undone."
      )
    ) {
      resetTemplates();
    }
  };

  const sections = [
    {
      id: "general",
      label: "General",
      icon: SettingsIcon,
      content: (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-zinc-900 mb-4">
            General Settings
          </h3>
          <p className="text-sm text-zinc-500">
            Global application settings will appear here.
          </p>
        </Card>
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
              className="h-9 w-9 rounded-full bg-white hover:bg-zinc-50 border-zinc-200"
            >
              <ArrowLeft className="h-4 w-4 text-zinc-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-medium text-zinc-900">
              Settings
            </h1>
            <p className="text-zinc-500 text-sm">
              Manage studio preferences and AI templates
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleReset}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-zinc-200"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Defaults
        </Button>
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
                  ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/10"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <section.icon
                className={cn(
                  "w-4 h-4",
                  activeSection === section.id
                    ? "text-zinc-300"
                    : "text-zinc-500"
                )}
              />
              {section.label}
            </button>
          ))}

          <div className="mt-8 px-4">
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/60">
              <div className="flex items-center gap-2 text-zinc-900 font-serif font-medium mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Pro Tip
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Use{" "}
                <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-700">
                  {"{{name}}"}
                </code>{" "}
                variable in templates to dynamically insert the product name.
              </p>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-9 space-y-6">
          {activeContent?.isPrompt ? (
            <div className="space-y-6">
              <div className="mb-2">
                <h2 className="text-lg font-medium text-zinc-900">
                  {activeContent.label}
                </h2>
                <p className="text-sm text-zinc-500">
                  {activeContent.description}
                </p>
              </div>

              {Object.entries(templates)
                .filter(([key]) => activeContent.filter!(key))
                .map(([key, content]) => (
                  <Card
                    key={key}
                    className="overflow-hidden border-zinc-200 shadow-sm transition-all hover:border-zinc-300"
                  >
                    <div className="bg-zinc-50/50 border-b border-zinc-100 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-zinc-600 bg-zinc-200/50 px-2 py-1 rounded">
                          {key}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
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
                        className="font-mono text-sm leading-relaxed p-4 h-48 border-0 shadow-none focus-visible:ring-0 resize-y bg-white text-zinc-800 rounded-none w-full"
                        placeholder="Enter prompt template..."
                        spellCheck={false}
                      />
                    </div>
                    <div className="bg-zinc-50 px-4 py-2 border-t border-zinc-100 text-[10px] text-zinc-400 flex justify-end gap-2 font-mono">
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
