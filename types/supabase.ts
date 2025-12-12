export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      jewelry_items: {
        Row: {
          created_at: string | null;
          description: string | null;
          details: Json | null;
          id: string;
          images: string[] | null;
          name: string;
          type: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          details?: Json | null;
          id?: string;
          images?: string[] | null;
          name: string;
          type: string;
          user_id?: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          details?: Json | null;
          id?: string;
          images?: string[] | null;
          name?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          created_at: string | null;
          default_accent_detail: string | null;
          default_clasp_type: string | null;
          id: string;
          logo_data_url: string | null;
          logo_file_name: string | null;
          use_default_logo: boolean | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          default_accent_detail?: string | null;
          default_clasp_type?: string | null;
          id?: string;
          logo_data_url?: string | null;
          logo_file_name?: string | null;
          use_default_logo?: boolean | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          default_accent_detail?: string | null;
          default_clasp_type?: string | null;
          id?: string;
          logo_data_url?: string | null;
          logo_file_name?: string | null;
          use_default_logo?: boolean | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
