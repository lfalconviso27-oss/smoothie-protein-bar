export type ProductType = "smoothie" | "bowl" | "hydration" | "snack" | "enhancer" | "special";

export interface SmoothieBuildDetails {
  smoothieTypeId: string;
  smoothieTypeName: string;
  flavorId: string;
  flavorName: string;
  flavorCategory: string;
  boosterIds: string[];
  boosterNames: string[];
  hydrantFlavorId?: string;
  hydrantFlavorName?: string;
  aloeFlavorId?: string;
  aloeFlavorName?: string;
}

export interface BowlBuildDetails {
  bowlId: string;
  bowlName: string;
  flavorId?: string;
  flavorName?: string;
}

export interface SimpleProductDetails {
  itemId: string;
}

export interface CartItemNutrition {
  calories: number;
  protein: number;
}

export interface CartItem {
  id: string;
  productType: ProductType;
  name: string;
  quantity: number;
  unitPrice: number;
  details: SmoothieBuildDetails | BowlBuildDetails | SimpleProductDetails;
  nutrition: CartItemNutrition;
}
