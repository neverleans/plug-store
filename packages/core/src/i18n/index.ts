export { pt } from './pt';
export { en } from './en';
export type Translations = typeof import('./pt').pt;
export type Language = 'pt' | 'en';
