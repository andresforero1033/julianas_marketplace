import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { CartContext, type AddToCartPayload, type CartItem } from './CartContext.tsx';
import { createDefaultVariantSelection, selectionToList, serializeSelection, variantPriceAdjustment, variantStock } from '../utils/productVariants.ts';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((payload: AddToCartPayload) => {
    const { product } = payload;
    const quantity = payload.quantity ?? 1;
    const selection = payload.selection ?? createDefaultVariantSelection(product);
    const selectionKey = serializeSelection(selection);
    const variants = selectionToList(product, selection);
    const price = product.price + variantPriceAdjustment(product, selection);
    const maxQuantity = variantStock(product, selection);

    setItems((prev) => {
      if (maxQuantity <= 0) {
        return prev;
      }
      const existing = prev.find((item) => item.productId === product.id && item.selectionKey === selectionKey);
      if (existing) {
        const nextQuantity = Math.min(existing.quantity + quantity, maxQuantity);
        return prev.map((item) => (item.lineId === existing.lineId ? { ...item, quantity: nextQuantity, maxQuantity } : item));
      }

      const lineId = `${product.id}-${selectionKey || 'default'}-${Date.now()}`;
      const nextItem: CartItem = {
        lineId,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        price,
        quantity: Math.min(quantity, maxQuantity || quantity),
        variants,
        selectionKey,
        maxQuantity: maxQuantity || product.stock,
      };

      return [...prev, nextItem];
    });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.lineId !== lineId) {
          return item;
        }
        const safeQuantity = Math.max(1, Math.min(quantity, item.maxQuantity));
        return { ...item, quantity: safeQuantity };
      }),
    );
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [addItem, clearCart, items, removeItem, subtotal, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
