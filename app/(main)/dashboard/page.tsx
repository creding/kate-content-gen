"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Image as ImageIcon } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { JewelryItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<JewelryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase!
        .from("jewelry_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data as JewelryItem[]);
      }
      setLoading(false);
    };

    fetchItems();
  }, [user]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-foreground">
            Jewelry Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your items and generate content.
          </p>
        </div>
        <Link href="/items/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Item
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Link key={item.id} href={`/items/${item.id}`} className="group">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 hover:bg-card h-full flex flex-col">
                <div className="aspect-square bg-secondary relative overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-lg leading-tight group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                      {item.type}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-auto pt-4 text-xs text-muted-foreground/60">
                    Added {new Date(item.created_at!).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium">No items yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Get started by adding your first jewelry piece to the collection.
          </p>
          <Link href="/items/new">
            <Button variant="outline">Add First Item</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
