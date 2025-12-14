"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import JewelryItemForm from "@/components/JewelryItemForm";
import { supabase } from "@/lib/supabase";
import { JewelryItemInsert } from "@/types";

export default function EditItemPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [initialData, setInitialData] =
    useState<Partial<JewelryItemInsert> | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase!
        .from("jewelry_items")
        .select("*")
        .eq("id", id)
        .single();

      if (data) setInitialData(data);
    };
    if (id) fetchItem();
  }, [id]);

  if (!initialData) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-medium">Edit Item</h1>
      </div>
      <JewelryItemForm
        mode="edit"
        initialData={initialData}
        onSuccess={() => router.push(`/items/${id}`)}
      />
    </div>
  );
}
