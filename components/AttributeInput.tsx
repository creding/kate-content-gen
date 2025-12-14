"use client";

import React, { useEffect, useState } from "react";
import { Input, Label } from "./ui";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Check, ChevronDown, Plus } from "lucide-react";

interface AttributeInputProps {
  label: string;
  category: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AttributeInput({
  label,
  category,
  value,
  onChange,
  placeholder,
  className,
}: AttributeInputProps) {
  const { user } = useAuth();
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Use a unique ID for the datalist to avoid collisions
  const listId = `list-${category.replace(/\s+/g, "-").toLowerCase()}`;

  useEffect(() => {
    if (!user) return;

    // Fetch unique values for this category
    const fetchOptions = async () => {
      // setLoading(true); // Don't block UI on this
      const { data, error } = await supabase!
        .from("jewelry_attributes")
        .select("value")
        .eq("category", category)
        .order("value");

      if (!error && data) {
        setOptions(Array.from(new Set(data.map((d) => d.value))));
      }
      // setLoading(false);
    };

    fetchOptions();
  }, [user, category]);

  // Filter options based on input
  // If the user types, show matching options. If empty, show all options.
  const filteredOptions = value
    ? options.filter((opt) => opt.toLowerCase().includes(value.toLowerCase()))
    : options;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="relative group">
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          // Delay blur to allow click on option
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          autoComplete="off"
          className="pr-8"
        />
        <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-3.5 pointer-events-none" />

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground border border-border rounded-md shadow-md max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur
                    onChange(opt);
                    setIsOpen(false);
                  }}
                >
                  {opt}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground italic">
                No existing "{category}" found.
              </div>
            )}
            {/* Always show the "Create new" option if value is not empty and not in list */}
            {value && !options.includes(value) && (
              <div
                className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-t border-border flex items-center gap-2"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                }}
              >
                <Plus className="w-3 h-3" /> Create "{value}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
