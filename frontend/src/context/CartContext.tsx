import { createContext } from 'react';
import type { Product } from '../data/products.ts';
import type { VariantDisplay, VariantSelectionMap } from '../utils/productVariants.ts';

export type CartItem = {
  lineId: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  variants: VariantDisplay[];
  selectionKey: string;
  maxQuantity: number;
};

export type AddToCartPayload = {
  product: Product;
  quantity?: number;
  selection?: VariantSelectionMap;
};

export type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  addItem: (payload: AddToCartPayload) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | undefined>(undefined);
