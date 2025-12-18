import type { Product } from '../data/products.ts';

export type VariantSelectionMap = Record<string, string>;

export type VariantDisplay = {
  groupId: string;
  groupName: string;
  optionId: string;
  optionLabel: string;
  priceModifier: number;
};

export function createDefaultVariantSelection(product?: Product): VariantSelectionMap {
  if (!product?.variants) {
    return {};
  }
  return product.variants.reduce<VariantSelectionMap>((acc, group) => {
    const preferred = group.options.find((option) => option.stock > 0) ?? group.options[0];
    if (preferred) {
      acc[group.id] = preferred.id;
    }
    return acc;
  }, {});
}

export function selectionToList(product: Product, selection: VariantSelectionMap): VariantDisplay[] {
  if (!product.variants) {
    return [];
  }
  return product.variants
    .map((group) => {
      const option = group.options.find((item) => item.id === selection[group.id]);
      if (!option) {
        return null;
      }
      return {
        groupId: group.id,
        groupName: group.name,
        optionId: option.id,
        optionLabel: option.label,
        priceModifier: option.priceModifier ?? 0,
      } satisfies VariantDisplay;
    })
    .filter((item): item is VariantDisplay => Boolean(item));
}

export function variantPriceAdjustment(product: Product, selection: VariantSelectionMap): number {
  if (!product.variants) {
    return 0;
  }
  return product.variants.reduce((total, group) => {
    const option = group.options.find((item) => item.id === selection[group.id]);
    return total + (option?.priceModifier ?? 0);
  }, 0);
}

export function variantStock(product: Product, selection: VariantSelectionMap): number {
  let stock = product.stock;
  if (!product.variants) {
    return stock;
  }
  product.variants.forEach((group) => {
    const option = group.options.find((item) => item.id === selection[group.id]);
    if (option) {
      stock = Math.min(stock, option.stock);
    }
  });
  return stock;
}

export function serializeSelection(selection: VariantSelectionMap): string {
  const entries = Object.entries(selection).sort(([a], [b]) => a.localeCompare(b));
  return entries.map(([groupId, optionId]) => `${groupId}:${optionId}`).join('|');
}
