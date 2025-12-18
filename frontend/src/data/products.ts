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
  },
];

export const productCategories = ['todos', 'ropa', 'accesorios', 'belleza'] as const;

export const productTags = ['hecho a mano', 'ecosostenible', 'vegano', 'edición limitada', 'best seller'];
