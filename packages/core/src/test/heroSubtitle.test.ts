import { describe, it, expect } from 'vitest';
import { localizeHeroSubtitle } from '../i18n/dynamic';
import { themeConfigs } from '../themes/configs';

describe('localizeHeroSubtitle', () => {
  it('gives each theme its own niche copy, not another niche shared by layout', () => {
    // The original bug: coffee uses the 'split' hero layout, same as electronics,
    // so it rendered the electronics description ("Tecnologia de ponta…").
    const coffee = localizeHeroSubtitle('coffee', 'pt');
    const electronics = localizeHeroSubtitle('electronics', 'pt');
    expect(coffee).not.toBe(electronics);
    expect(coffee.toLowerCase()).toContain('café');
    expect(electronics.toLowerCase()).toContain('tecnologia');
  });

  it('covers every built-in theme in both languages', () => {
    for (const id of Object.keys(themeConfigs)) {
      const pt = localizeHeroSubtitle(id, 'pt');
      const en = localizeHeroSubtitle(id, 'en');
      expect(pt.length).toBeGreaterThan(10);
      expect(en.length).toBeGreaterThan(10);
      expect(pt).not.toBe(en);
    }
  });

  it('falls back to a generic line for an unknown (custom) theme, never wrong-niche', () => {
    const pt = localizeHeroSubtitle('my-custom-brand', 'pt');
    const en = localizeHeroSubtitle('my-custom-brand', 'en');
    expect(pt).toBe('Uma seleção especial, pensada nos mínimos detalhes para você.');
    expect(en).toContain('curated selection');
  });
});
