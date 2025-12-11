"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Image as ImageIcon } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { JewelryItem } from "@/types";
import AssetGenerator from "@/components/AssetGenerator";

export default function ItemDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [item, setItem] = useState<JewelryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase!
        .from("jewelry_items")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching item:", error);
        router.push("/dashboard");
      } else {
        setItem(data as JewelryItem);
      }
      setLoading(false);
    };

    if (id) fetchItem();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-lg bg-secondary overflow-hidden border border-border flex-shrink-0">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="text-muted-foreground/50" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-serif font-medium">{item.name}</h1>
                <Badge
                  variant="secondary"
                  className="text-xs uppercase tracking-wider"
                >
                  {item.type}
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                {item.description || "No description provided."}
              </p>
              <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                {item.details.material && (
                  <span>
                    <strong>Material:</strong> {item.details.material}
                  </span>
                )}
                {item.details.stone && (
                  <span>
                    <strong>Gemstone:</strong> {item.details.stone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link href={`/items/${id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Generator Section */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Content Studio</h2>
        <AssetGenerator item={item} />
      </div>
    </div>
  );
}
