/**
 * CLI copy, in Portuguese and English.
 *
 * The CLI used to greet in English and then ask every question in Portuguese,
 * which reads like a bug. Language is resolved once, at startup:
 *   --lang en | --lang pt   →  explicit wins
 *   LANG / LC_ALL env       →  starts with "pt" means Portuguese
 *   otherwise               →  English
 */

export type Lang = 'pt' | 'en';

export interface Messages {
  /** Tagline printed next to the "PlugStore CLI" wordmark. */
  tagline: string;
  invalidTheme: (value: string, accepted: string) => string;
  invalidCurrency: (value: string, accepted: string) => string;
  invalidLang: (value: string) => string;
  askProjectName: string;
  askCompanyName: string;
  defaultCompanyName: string;
  askTheme: string;
  askCurrency: string;
  currencyChoices: Record<'BRL' | 'USD' | 'EUR', string>;
  askWhatsapp: string;
  askPixKey: string;
  askPixCity: string;
  cancelled: string;
  dirExists: (name: string) => string;
  creating: (dir: string) => string;
  created: (company: string) => string;
  labelFolder: string;
  labelTheme: string;
  labelCurrency: string;
  labelWhatsapp: string;
  labelPix: string;
  nextSteps: string;
  docsHint: string;
}

const pt: Messages = {
  tagline: 'Gerador de Projetos',
  invalidTheme: (value, accepted) =>
    `✖ Tema inválido: "${value}". Valores aceitos: ${accepted}`,
  invalidCurrency: (value, accepted) =>
    `✖ Moeda inválida: "${value}". Valores aceitos: ${accepted}`,
  invalidLang: (value) => `✖ Idioma inválido: "${value}". Valores aceitos: pt, en`,
  askProjectName: 'Nome da pasta do projeto:',
  askCompanyName: 'Nome da Loja / Empresa:',
  defaultCompanyName: 'Minha Loja Plug',
  askTheme: 'Escolha o Nicho / Tema inicial:',
  askCurrency: 'Moeda principal:',
  currencyChoices: {
    BRL: 'BRL (R$ - Real Brasileiro)',
    USD: 'USD ($ - Dólar Americano)',
    EUR: 'EUR (€ - Euro)',
  },
  askWhatsapp: 'Número do WhatsApp (opcional, ex: 5511999999999):',
  askPixKey: 'Chave Pix (opcional — CPF, e-mail, telefone ou chave aleatória):',
  askPixCity: 'Cidade do recebedor para o Pix (ex: Sao Paulo):',
  cancelled: 'Operação cancelada',
  dirExists: (name) =>
    `⚠️  A pasta "${name}" já existe. Escolha outro nome ou apague a pasta.`,
  creating: (dir) => `⏳ Criando projeto PlugStore em ${dir}...`,
  created: (company) => `Projeto ${company} criado com sucesso!`,
  labelFolder: '📁 Pasta:',
  labelTheme: '🎨 Tema:',
  labelCurrency: '💰 Moeda:',
  labelWhatsapp: '💬 WhatsApp:',
  labelPix: '💳 Chave Pix:',
  nextSteps: 'Para iniciar:',
  docsHint: 'Documentação: https://neverleans.github.io/plug-store/pt-BR/',
};

const en: Messages = {
  tagline: 'Project Generator',
  invalidTheme: (value, accepted) =>
    `✖ Invalid theme: "${value}". Accepted values: ${accepted}`,
  invalidCurrency: (value, accepted) =>
    `✖ Invalid currency: "${value}". Accepted values: ${accepted}`,
  invalidLang: (value) => `✖ Invalid language: "${value}". Accepted values: pt, en`,
  askProjectName: 'Project folder name:',
  askCompanyName: 'Store / company name:',
  defaultCompanyName: 'My Plug Store',
  askTheme: 'Pick a starting industry theme:',
  askCurrency: 'Primary currency:',
  currencyChoices: {
    BRL: 'BRL (R$ - Brazilian Real)',
    USD: 'USD ($ - US Dollar)',
    EUR: 'EUR (€ - Euro)',
  },
  askWhatsapp: 'WhatsApp number (optional, e.g. 5511999999999):',
  askPixKey: 'Pix key (optional — CPF, e-mail, phone or random key):',
  askPixCity: 'Pix recipient city (e.g. Sao Paulo):',
  cancelled: 'Operation cancelled',
  dirExists: (name) =>
    `⚠️  The folder "${name}" already exists. Pick another name or delete it.`,
  creating: (dir) => `⏳ Creating your PlugStore project in ${dir}...`,
  created: (company) => `Project ${company} created successfully!`,
  labelFolder: '📁 Folder:',
  labelTheme: '🎨 Theme:',
  labelCurrency: '💰 Currency:',
  labelWhatsapp: '💬 WhatsApp:',
  labelPix: '💳 Pix key:',
  nextSteps: 'To get started:',
  docsHint: 'Documentation: https://neverleans.github.io/plug-store/',
};

export const MESSAGES: Record<Lang, Messages> = { pt, en };

export function resolveLang(flag: string | boolean | undefined): Lang | null {
  if (typeof flag === 'string') {
    const normalized = flag.toLowerCase();
    if (normalized === 'pt' || normalized === 'pt-br') return 'pt';
    if (normalized === 'en') return 'en';
    return null; // caller reports the error
  }

  // No flag: follow the machine's locale. A Brazilian dev gets Portuguese
  // without passing anything; everyone else gets English instead of a
  // half-translated prompt they can't read.
  const env = process.env.LC_ALL || process.env.LANG || '';
  return env.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}
