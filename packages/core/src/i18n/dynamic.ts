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

/**
 * Per-theme hero description. The hero H1 shows the tagline; this is the
 * paragraph beneath it. Keyed by theme id so a theme's copy follows its niche —
 * previously the description was hardcoded per hero *layout*, so any theme
 * sharing a layout (e.g. coffee using the 'split' hero) showed the wrong niche's
 * text. Custom themes with no entry fall back to a generic line, never a wrong one.
 */
const heroSubtitles: Record<string, { pt: string; en: string }> = {
  fashion: { pt: 'Peças atemporais e curadoria premium para quem faz do estilo uma assinatura.', en: 'Timeless pieces and premium curation for those who make style their signature.' },
  electronics: { pt: 'Tecnologia de ponta, avaliada por especialistas e pronta para o futuro.', en: 'Cutting-edge tech, expert-reviewed and ready for what comes next.' },
  food: { pt: 'Produtos frescos e orgânicos, do produtor à sua mesa, todos os dias.', en: 'Fresh, organic goods from the grower to your table, every day.' },
  furniture: { pt: 'Móveis feitos à mão para transformar a casa em lar.', en: 'Handcrafted furniture that turns a house into a home.' },
  beauty: { pt: 'Cosméticos que realçam a sua beleza natural com ingredientes de verdade.', en: 'Cosmetics that bring out your natural beauty with honest ingredients.' },
  sports: { pt: 'Equipamentos de alta performance para quem não aceita ficar parado.', en: 'High-performance gear for those who refuse to stand still.' },
  books: { pt: 'Histórias selecionadas a dedo para acompanhar cada estação da vida.', en: 'Hand-picked stories to keep you company through every season.' },
  pets: { pt: 'Tudo o que o seu melhor amigo precisa para viver feliz e saudável.', en: 'Everything your best friend needs to live happy and healthy.' },
  automotive: { pt: 'Peças e acessórios de precisão para quem vive a estrada.', en: 'Precision parts and accessories for those who live for the road.' },
  art: { pt: 'Obras originais de artistas contemporâneos para colecionar e admirar.', en: 'Original works from contemporary artists to collect and admire.' },
  jewelry: { pt: 'Joias atemporais, criadas para marcar os momentos que importam.', en: 'Timeless jewelry, crafted to mark the moments that matter.' },
  homeware: { pt: 'Utensílios elegantes que elevam a mesa e o dia a dia.', en: 'Elegant homeware that elevates the table and the everyday.' },
  market: { pt: 'Ingredientes honestos e bem selecionados, direto dos melhores produtores.', en: 'Honest, well-sourced ingredients straight from the best producers.' },
  wellness: { pt: 'Rituais de autocuidado para desacelerar e cuidar de você.', en: 'Self-care rituals to slow down and care for yourself.' },
  stationery: { pt: 'Papelaria fina para quem ainda ama escrever com calma.', en: 'Fine stationery for those who still love to write slowly.' },
  winery: { pt: 'Rótulos selecionados e terroirs exclusivos para paladares exigentes.', en: 'Selected labels and exclusive terroirs for discerning palates.' },
  brewery: { pt: 'Cervejas artesanais de alta fermentação, criadas com paixão e caráter.', en: 'Craft, top-fermented beers brewed with passion and character.' },
  coffee: { pt: 'Cafés especiais e grãos selecionados, torrados no ponto certo.', en: 'Specialty coffees and select beans, roasted to perfection.' },
  bakery: { pt: 'Pães artesanais e doces finos, assados fresquinhos todos os dias.', en: 'Artisan breads and fine sweets, baked fresh every day.' },
  spices: { pt: 'Temperos puros e ervas aromáticas dos quatro cantos do mundo.', en: 'Pure spices and aromatic herbs from the four corners of the world.' },
  chocolates: { pt: 'Chocolates gourmet e bombons artesanais para momentos de puro prazer.', en: 'Gourmet chocolate and artisan bonbons for moments of pure pleasure.' },
  gaming: { pt: 'Consoles, periféricos e setups de alta performance para todo gamer.', en: 'Consoles, peripherals and high-performance setups for every gamer.' },
  geek: { pt: 'Action figures, colecionáveis e cultura pop para verdadeiros fãs.', en: 'Action figures, collectibles and pop culture for true fans.' },
  music: { pt: 'Instrumentos e equipamentos de áudio para dar voz ao seu som.', en: 'Instruments and audio gear to give voice to your sound.' },
  boardgames: { pt: 'Board games, RPG e jogos de estratégia para noites inesquecíveis.', en: 'Board games, RPGs and strategy games for unforgettable nights.' },
  toys: { pt: 'Brinquedos educativos e diversão sem fim para todas as idades.', en: 'Educational toys and endless fun for all ages.' },
  hardware: { pt: 'Ferramentas e equipamentos robustos para obras e projetos de verdade.', en: 'Rugged tools and equipment for real builds and projects.' },
  lighting: { pt: 'Luminárias de design que transformam qualquer ambiente com luz.', en: 'Designer lighting that transforms any space with light.' },
  gardening: { pt: 'Plantas, vasos e paisagismo para deixar cada canto mais verde.', en: 'Plants, planters and landscaping to make every corner greener.' },
  office: { pt: 'Móveis ergonômicos e soluções corporativas para trabalhar melhor.', en: 'Ergonomic furniture and corporate solutions to work better.' },
  security: { pt: 'Câmeras, fechaduras e alarmes para proteger o que é seu.', en: 'Cameras, locks and alarms to protect what is yours.' },
  cycling: { pt: 'Bicicletas, componentes e vestuário para pedalar mais longe.', en: 'Bikes, components and apparel to ride farther.' },
  outdoors: { pt: 'Equipamentos de camping e trilha para explorar a natureza sem limites.', en: 'Camping and trail gear to explore nature without limits.' },
  fishing: { pt: 'Varas, molinetes e artigos náuticos para a pescaria perfeita.', en: 'Rods, reels and nautical gear for the perfect catch.' },
  fitness: { pt: 'Suplementos e nutrição de alta performance para superar cada treino.', en: 'High-performance supplements and nutrition to crush every workout.' },
  combat: { pt: 'Equipamentos de luta e artes marciais para guerreiros de verdade.', en: 'Fight and martial-arts gear for true warriors.' },
  motorcycles: { pt: 'Capacetes, jaquetas e peças para viver a liberdade sobre duas rodas.', en: 'Helmets, jackets and parts to live the freedom of two wheels.' },
  optics: { pt: 'Armações de grau e óculos de sol com design que valoriza o olhar.', en: 'Prescription frames and sunglasses with design that flatters.' },
  dental: { pt: 'Produtos de higiene bucal e clareamento para um sorriso saudável.', en: 'Oral care and whitening products for a healthy smile.' },
  medical: { pt: 'Equipamentos médicos e ortopédicos para cuidar com segurança.', en: 'Medical and orthopedic equipment for safe, reliable care.' },
  pharmacy: { pt: 'Medicamentos, dermocosméticos e vitaminas com atendimento de confiança.', en: 'Medicines, dermocosmetics and vitamins you can trust.' },
  watchmakers: { pt: 'Relógios suíços e cronógrafos de luxo para colecionar o tempo.', en: 'Swiss watches and luxury chronographs to collect time itself.' },
  perfume: { pt: 'Fragrâncias exclusivas e perfumaria fina para uma assinatura olfativa única.', en: 'Exclusive fragrances and fine perfumery for a signature scent.' },
  handcrafted: { pt: 'Peças feitas à mão com afeto, do atelier direto para você.', en: 'Handmade pieces crafted with care, straight from the atelier.' },
  party: { pt: 'Tudo para a sua festa: balões, decoração e alegria de sobra.', en: 'Everything for your party: balloons, décor and joy to spare.' },
  flowers: { pt: 'Buquês frescos e arranjos delicados para todas as ocasiões.', en: 'Fresh bouquets and delicate arrangements for every occasion.' },
  leather: { pt: 'Bolsas, carteiras e calçados em couro legítimo, feitos para durar.', en: 'Genuine leather bags, wallets and shoes, made to last.' },
  baby: { pt: 'Enxoval, roupas macias e tudo para receber quem chega com amor.', en: 'Layette, soft clothes and everything to welcome the little one.' },
  spiritual: { pt: 'Cristais, incensos e artigos esotéricos para equilibrar as suas energias.', en: 'Crystals, incense and esoteric goods to balance your energy.' },
  vintage: { pt: 'Discos de vinil, vitrolas e antiguidades para amantes do retrô.', en: 'Vinyl records, turntables and antiques for lovers of all things retro.' },
};

const GENERIC_SUBTITLE = {
  pt: 'Uma seleção especial, pensada nos mínimos detalhes para você.',
  en: 'A curated selection, crafted down to the last detail, just for you.',
};

/** The hero description for a theme, localized. Never returns wrong-niche copy. */
export const localizeHeroSubtitle = (id: string, lang: Language): string => {
  const entry = heroSubtitles[id] || GENERIC_SUBTITLE;
  return lang === 'pt' ? entry.pt : entry.en;
};
