"use client";

import React from "react";
import JewelryItemForm from "@/components/JewelryItemForm";

export default function NewItemPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-medium">Add New Item</h1>
        <p className="text-muted-foreground">
          Upload images and definition details for your jewelry piece.
        </p>
      </div>
      <JewelryItemForm mode="create" />
    </div>
  );
}
