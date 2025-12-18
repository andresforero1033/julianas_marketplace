export type VariantOption = {
  id: string;
  label: string;
  stock: number;
  priceModifier?: number;
  colorHex?: string;
};

export type VariantGroup = {
  id: string;
  name: string;
  type: 'color' | 'talla' | 'presentación' | 'acabado';
  options: VariantOption[];
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: 'ropa' | 'accesorios' | 'belleza';
  tags: string[];
  stock: number;
  rating: number;
  status?: 'nuevo' | 'destacado' | 'best-seller';
  image: string;
  variants?: VariantGroup[];
};

export const mockProducts: Product[] = [
  {
    id: 'prd-001',
    name: 'Vestido lino tonos tierra',
    brand: 'Casa Andina',
    price: 289000,
    category: 'ropa',
    tags: ['ecosostenible', 'hecho a mano'],
    stock: 12,
    rating: 4.9,
    status: 'destacado',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=70',
    variants: [
      {
        id: 'color',
        name: 'Color',
        type: 'color',
        options: [
          { id: 'arena', label: 'Arena', stock: 6, colorHex: '#D7B89A' },
          { id: 'terracota', label: 'Terracota', stock: 6, colorHex: '#B35C44', priceModifier: 15000 },
        ],
      },
      {
        id: 'talla',
        name: 'Talla',
        type: 'talla',
        options: [
          { id: 's', label: 'S', stock: 4 },
          { id: 'm', label: 'M', stock: 5 },
          { id: 'l', label: 'L', stock: 3 },
        ],
      },
    ],
  },
  {
    id: 'prd-002',
    name: 'Set de aretes geométricos',
    brand: 'Siento',
    price: 89000,
    category: 'accesorios',
    tags: ['hecho a mano'],
    stock: 0,
    rating: 4.7,
    status: 'best-seller',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=70',
    variants: [
      {
        id: 'acabado',
        name: 'Acabado',
        type: 'acabado',
        options: [
          { id: 'oro', label: 'Baño en oro', stock: 0, priceModifier: 20000 },
          { id: 'plata', label: 'Plata mate', stock: 8 },
        ],
      },
    ],
  },
  {
    id: 'prd-003',
    name: 'Set skincare glow',
    brand: 'Lunaria',
    price: 215000,
    category: 'belleza',
    tags: ['vegano'],
    stock: 25,
    rating: 4.5,
    status: 'nuevo',
    image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=600&q=70',
    variants: [
      {
        id: 'presentacion',
        name: 'Presentación',
        type: 'presentación',
        options: [
          { id: '30ml', label: '30 ml', stock: 15 },
          { id: '60ml', label: '60 ml', stock: 10, priceModifier: 38000 },
        ],
      },
    ],
  },
  {
    id: 'prd-004',
    name: 'Kimono bordado edición limitada',
    brand: 'Manos del Sur',
    price: 375000,
    category: 'ropa',
    tags: ['edición limitada'],
    stock: 6,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1453473552140-30cd52190704?auto=format&fit=crop&w=600&q=70',
    variants: [
      {
        id: 'talla',
        name: 'Talla única / amplia',
        type: 'talla',
        options: [
          { id: 'talla-1', label: 'XS - M', stock: 3 },
          { id: 'talla-2', label: 'M - XL', stock: 3 },
        ],
      },
    ],
  },
  {
    id: 'prd-005',
    name: 'Bolso circular en fique',
    brand: 'Minka',
    price: 165000,
    category: 'accesorios',
    tags: ['ecosostenible'],
    stock: 18,
    rating: 4.6,
    status: 'destacado',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=70',
    variants: [
      {
        id: 'color',
        name: 'Color de asa',
        type: 'color',
        options: [
          { id: 'natural', label: 'Natural', stock: 10, colorHex: '#C8B197' },
          { id: 'chocolate', label: 'Chocolate', stock: 8, colorHex: '#5B3A29' },
        ],
      },
    ],
  },
  {
    id: 'prd-006',
    name: 'Aceite capilar nutritivo',
    brand: 'Selva Viva',
    price: 98000,
    category: 'belleza',
    tags: ['vegano', 'best seller'],
    stock: 10,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=70',
    variants: [
      {
        id: 'presentacion',
        name: 'Presentación',
        type: 'presentación',
        options: [
          { id: '50ml', label: '50 ml', stock: 6 },
          { id: '100ml', label: '100 ml', stock: 4, priceModifier: 27000 },
        ],
      },
    ],
  },
];

export const productCategories = ['todos', 'ropa', 'accesorios', 'belleza'] as const;

export const productTags = ['hecho a mano', 'ecosostenible', 'vegano', 'edición limitada', 'best seller'];
