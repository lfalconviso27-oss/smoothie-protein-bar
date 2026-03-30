export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          fitness_goal: "bulk" | "cut" | "maintain" | "energy" | null;
          daily_calorie_target: number | null;
          daily_protein_target: number | null;
          daily_carb_target: number | null;
          daily_fat_target: number | null;
          loyalty_points: number;
          loyalty_tier: "bronze" | "silver" | "gold" | "platinum";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          fitness_goal?: string | null;
          daily_calorie_target?: number | null;
          daily_protein_target?: number | null;
          daily_carb_target?: number | null;
          daily_fat_target?: number | null;
          loyalty_points?: number;
          loyalty_tier?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      smoothie_types: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          protein: number;
          calories: number;
          base_price: number;
          available: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          protein: number;
          calories: number;
          base_price: number;
          available?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["smoothie_types"]["Insert"]>;
      };
      flavor_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          color: string | null;
          icon: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          color?: string | null;
          icon?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["flavor_categories"]["Insert"]>;
      };
      flavors: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category_id: string;
          available: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category_id: string;
          available?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["flavors"]["Insert"]>;
      };
      boosters: {
        Row: {
          id: string;
          name: string;
          slug: string;
          grams: number | null;
          price: number;
          available: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          grams?: number | null;
          price?: number;
          available?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["boosters"]["Insert"]>;
      };
      enhancers: {
        Row: {
          id: string;
          name: string;
          slug: string;
          benefits: string[];
          price: number;
          available: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          benefits?: string[];
          price?: number;
          available?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["enhancers"]["Insert"]>;
      };
      hydration_items: {
        Row: {
          id: string;
          name: string;
          slug: string;
          hydration_type: "hydrant" | "aloe" | "base";
          calories: number;
          sugar: number;
          price: number;
          available: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          hydration_type: string;
          calories?: number;
          sugar?: number;
          price?: number;
          available?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["hydration_items"]["Insert"]>;
      };
      snacks: {
        Row: {
          id: string;
          name: string;
          slug: string;
          protein: number;
          calories: number;
          price: number;
          available: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          protein?: number;
          calories?: number;
          price?: number;
          available?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["snacks"]["Insert"]>;
      };
      bowls: {
        Row: {
          id: string;
          name: string;
          slug: string;
          protein: number;
          calories: number;
          base_price: number;
          available: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          protein: number;
          calories: number;
          base_price: number;
          available?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["bowls"]["Insert"]>;
      };
      daily_specials: {
        Row: {
          id: string;
          day_of_week: number;
          day_name: string;
          item_name: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          day_of_week: number;
          day_name: string;
          item_name: string;
          description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["daily_specials"]["Insert"]>;
      };
      saved_builds: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          smoothie_type_id: string | null;
          flavor_id: string | null;
          booster_ids: string[];
          hydration_id: string | null;
          total_protein: number;
          total_calories: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          smoothie_type_id?: string | null;
          flavor_id?: string | null;
          booster_ids?: string[];
          hydration_id?: string | null;
          total_protein?: number;
          total_calories?: number;
          total_price?: number;
        };
        Update: Partial<Database["public"]["Tables"]["saved_builds"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status: "pending" | "confirmed" | "preparing" | "ready" | "picked_up" | "delivered" | "cancelled";
          order_type: string;
          subtotal: number;
          tax: number;
          delivery_fee: number;
          discount: number;
          total: number;
          loyalty_points_earned: number;
          loyalty_points_redeemed: number;
          stripe_payment_intent_id: string | null;
          stripe_payment_status: string | null;
          delivery_address: Json | null;
          scheduled_at: string | null;
          estimated_ready_at: string | null;
          notes: string | null;
          promo_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number: string;
          status?: string;
          order_type: string;
          subtotal: number;
          tax: number;
          delivery_fee?: number;
          discount?: number;
          total: number;
          loyalty_points_earned?: number;
          loyalty_points_redeemed?: number;
          stripe_payment_intent_id?: string | null;
          stripe_payment_status?: string | null;
          delivery_address?: Json | null;
          scheduled_at?: string | null;
          estimated_ready_at?: string | null;
          notes?: string | null;
          promo_code?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_type: string;
          name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          build_details: Json | null;
          customizations: Json | null;
          nutrition_snapshot: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_type?: string;
          name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          build_details?: Json | null;
          customizations?: Json | null;
          nutrition_snapshot?: Json | null;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      order_status_events: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: string;
          message?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["order_status_events"]["Insert"]>;
      };
      loyalty_transactions: {
        Row: {
          id: string;
          user_id: string;
          order_id: string | null;
          points: number;
          type: "earned" | "redeemed";
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_id?: string | null;
          points: number;
          type: string;
          description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["loyalty_transactions"]["Insert"]>;
      };
    };
  };
}

// Convenience row types
export type SmoothieType = Database["public"]["Tables"]["smoothie_types"]["Row"];
export type FlavorCategory = Database["public"]["Tables"]["flavor_categories"]["Row"];
export type Flavor = Database["public"]["Tables"]["flavors"]["Row"];
export type Booster = Database["public"]["Tables"]["boosters"]["Row"];
export type Enhancer = Database["public"]["Tables"]["enhancers"]["Row"];
export type HydrationItem = Database["public"]["Tables"]["hydration_items"]["Row"];
export type Snack = Database["public"]["Tables"]["snacks"]["Row"];
export type Bowl = Database["public"]["Tables"]["bowls"]["Row"];
export type DailySpecial = Database["public"]["Tables"]["daily_specials"]["Row"];
export type SavedBuild = Database["public"]["Tables"]["saved_builds"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type StatusEvent = Database["public"]["Tables"]["order_status_events"]["Row"];
export type LoyaltyTransaction = Database["public"]["Tables"]["loyalty_transactions"]["Row"];
