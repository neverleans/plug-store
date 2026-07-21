import type { Language } from '@/i18n';
import type { IndustryTemplate } from '@/types';

/** Category names in source data are in English. This map provides PT translations. */
const categoryNamePt: Record<string, string> = {
  // Fashion
  Apparel: 'Vestuário', Tops: 'Blusas', Bottoms: 'Calças', Outerwear: 'Casacos',
  Dresses: 'Vestidos', Knitwear: 'Tricô', Shoes: 'Calçados', Footwear: 'Calçados',
  Accessories: 'Acessórios', Bags: 'Bolsas',
  // Electronics
  Laptops: 'Notebooks', Audio: 'Áudio', Cameras: 'Câmeras', Wearables: 'Vestíveis',
  Monitors: 'Monitores', Peripherals: 'Periféricos', Tablets: 'Tablets',
  // Food / Market
  'Fresh Produce': 'Hortifrúti', Produce: 'Hortifrúti', Bakery: 'Padaria',
  Dairy: 'Laticínios', 'Dairy & Eggs': 'Laticínios e Ovos', Beverages: 'Bebidas',
  Pantry: 'Despensa', Snacks: 'Snacks', Meat: 'Carnes', Seafood: 'Frutos do Mar',
  Tea: 'Chás', Breakfast: 'Café da Manhã', Food: 'Alimentos',
  // Furniture / Homeware
  'Living Room': 'Sala de Estar', Bedroom: 'Quarto', Dining: 'Sala de Jantar',
  Office: 'Escritório', Outdoor: 'Externos', Lighting: 'Iluminação', Storage: 'Armazenamento',
  Beds: 'Camas', Decor: 'Decoração', Textiles: 'Têxteis', Dinnerware: 'Louças',
  Glassware: 'Cristais', Cutlery: 'Talheres', Serving: 'Servir', Mugs: 'Canecas',
  // Beauty / Wellness
  Skincare: 'Skincare', Makeup: 'Maquiagem', Haircare: 'Cabelos', Fragrance: 'Perfumes',
  Bath: 'Banho', Body: 'Corpo', Aromatherapy: 'Aromaterapia', Sleep: 'Sono',
  Movement: 'Movimento',
  // Sports
  Running: 'Corrida', Cycling: 'Ciclismo', Fitness: 'Fitness', Strength: 'Musculação',
  Aquatic: 'Aquático', Combat: 'Combate', Walking: 'Caminhada',
  // Books
  Fiction: 'Ficção', 'Self-Help': 'Autoajuda', History: 'História', 'Sci-Fi': 'Ficção Científica',
  Tech: 'Tecnologia', Psychology: 'Psicologia',
  // Pets
  Dog: 'Cães', Cat: 'Gatos', Toys: 'Brinquedos', Travel: 'Viagem',
  // Automotive
  Wheels: 'Rodas', Brakes: 'Freios', Suspension: 'Suspensão', Engine: 'Motor',
  Exhaust: 'Escape', Aero: 'Aerodinâmica', Interior: 'Interior', Tools: 'Ferramentas',
  // Art
  Paintings: 'Pinturas', Sculpture: 'Esculturas', Photography: 'Fotografia',
  Ceramics: 'Cerâmica', Drawings: 'Desenhos', Prints: 'Gravuras',
  // Jewelry
  Rings: 'Anéis', Necklaces: 'Colares', Earrings: 'Brincos', Bracelets: 'Pulseiras',
  // Stationery
  Notebooks: 'Cadernos', Writing: 'Escrita', Cards: 'Cartões', Planners: 'Planners',
  Desk: 'Mesa', Paper: 'Papelaria',
  // Cleaning (just in case)
  Cleaning: 'Limpeza',
};

export const localizeCategory = (name: string, lang: Language): string =>
  lang === 'pt' ? categoryNamePt[name] || name : name;

/** Theme template labels (used by ThemeSwitcher). */
export const templateLabels: Record<IndustryTemplate, { emoji: string; pt: string; en: string }> = {
  fashion:     { emoji: '👗', en: 'Fashion',        pt: 'Moda' },
  electronics: { emoji: '💻', en: 'Electronics',    pt: 'Eletrônicos' },
  food:        { emoji: '🥑', en: 'Food & Grocery', pt: 'Alimentos' },
  furniture:   { emoji: '🛋️', en: 'Furniture',     pt: 'Móveis' },
  beauty:      { emoji: '💄', en: 'Beauty',         pt: 'Beleza' },
  sports:      { emoji: '🏃', en: 'Sports',         pt: 'Esportes' },
  books:       { emoji: '📚', en: 'Books',          pt: 'Livros' },
  pets:        { emoji: '🐾', en: 'Pets',           pt: 'Pets' },
  automotive:  { emoji: '🏎️', en: 'Automotive',    pt: 'Automotivo' },
  art:         { emoji: '🎨', en: 'Art Gallery',    pt: 'Galeria de Arte' },
  jewelry:     { emoji: '💎', en: 'Jewelry',        pt: 'Joalheria' },
  homeware:    { emoji: '🍽️', en: 'Homeware',      pt: 'Casa & Mesa' },
  market:      { emoji: '🥖', en: 'Market',         pt: 'Mercado' },
  wellness:    { emoji: '🌿', en: 'Wellness',       pt: 'Bem-estar' },
  stationery:  { emoji: '✒️', en: 'Stationery',    pt: 'Papelaria' },
};

export const localizeTemplate = (id: IndustryTemplate, lang: Language): string =>
  lang === 'pt' ? templateLabels[id].pt : templateLabels[id].en;

/** PT translations of theme taglines (theme.tagline is in EN by default). */
const taglinesPt: Record<IndustryTemplate, string> = {
  fashion: 'Eleve o Seu Estilo',
  electronics: 'Tecnologia do Futuro',
  food: 'Da Fazenda à Mesa',
  furniture: 'Feito para Viver',
  beauty: 'Irradie Confiança',
  sports: 'Supere Seus Limites',
  books: 'Histórias Que Ficam Com Você',
  pets: 'Amor, com Rabinho Abanando',
  automotive: 'Engenharia para a Velocidade',
  art: 'Onde a Visão Vira Forma',
  jewelry: 'Discretamente Brilhante',
  homeware: 'O Cotidiano, Elevado',
  market: 'Comida Honesta, Bem Selecionada',
  wellness: 'Beleza Lenta, Ritual Diário',
  stationery: 'Para Quem Escreve com Calma',
};

export const localizeTagline = (id: IndustryTemplate, fallback: string, lang: Language): string =>
  lang === 'pt' ? taglinesPt[id] || fallback : fallback;
