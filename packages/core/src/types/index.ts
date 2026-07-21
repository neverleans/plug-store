export type IndustryTemplate =
  | 'fashion'
  | 'electronics'
  | 'food'
  | 'furniture'
  | 'beauty'
  | 'sports'
  | 'books'
  | 'pets'
  | 'automotive'
  | 'art'
  | 'jewelry'
  | 'homeware'
  | 'market'
  | 'wellness'
  | 'stationery'
  // Bebidas & Gastronomia
  | 'winery'
  | 'brewery'
  | 'coffee'
  | 'bakery'
  | 'spices'
  | 'chocolates'
  // Entretenimento
  | 'gaming'
  | 'geek'
  | 'music'
  | 'boardgames'
  | 'toys'
  // Casa & Trabalho
  | 'hardware'
  | 'lighting'
  | 'gardening'
  | 'office'
  | 'security'
  // Esportes & Lazer
  | 'cycling'
  | 'outdoors'
  | 'fishing'
  | 'fitness'
  | 'combat'
  // Automotivo & Saúde
  | 'motorcycles'
  | 'optics'
  | 'dental'
  | 'medical'
  | 'pharmacy'
  // Variedades & Luxo
  | 'watchmakers'
  | 'perfume'
  | 'handcrafted'
  | 'party'
  | 'flowers'
  | 'leather'
  | 'baby'
  | 'spiritual'
  | 'vintage'
  | string;

export interface ThemeConfig {
  id: string;
  name: string;
  tagline: string;
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    heroGradientFrom: string;
    heroGradientTo: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  heroStyle:
    | 'fullwidth'
    | 'split'
    | 'centered'
    | 'overlay'
    | 'minimal'
    | 'energetic'    // diagonal stripes, bold motion (sports)
    | 'editorial'    // typographic, serif-forward (books)
    | 'playful'      // wavy, big illustration (pets)
    | 'industrial'   // hard-edge, metallic (automotive)
    | 'gallery';     // mosaic of images (art)
  cardStyle:
    | 'rounded'
    | 'sharp'
    | 'elevated'
    | 'bordered'
    | 'minimal'
    | 'tilted'       // slight rotation on hover (sports)
    | 'paper'        // book-spine look (books)
    | 'soft'         // pastel pillow look (pets)
    | 'metal'        // sharp metal edges (automotive)
    | 'frame';       // gallery frame (art)
  navStyle: 'standard' | 'centered' | 'minimal' | 'bold' | 'elegant';
  /** Optional override for the hero background image path. */
  heroImage?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  rating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  tags: string[];
  inStock: boolean;
  industry: IndustryTemplate;
  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'size' | 'color' | 'weight' | 'material' | 'flavor';
  options: string[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  industry: IndustryTemplate;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shipping: ShippingInfo;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  date: string;
}
