import { Database } from "./supabase";
import { ProductDetails } from "./core";

export type JewelryItemRow =
  Database["public"]["Tables"]["jewelry_items"]["Row"];
export type JewelryItemInsert =
  Database["public"]["Tables"]["jewelry_items"]["Insert"];
export type JewelryItemUpdate =
  Database["public"]["Tables"]["jewelry_items"]["Update"];

export interface JewelryItem extends Omit<JewelryItemRow, "details"> {
  details: ProductDetails;
}
