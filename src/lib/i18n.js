import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';

// Register translations (lazy-loaded)
register('en', () => import('../locales/en.json'));
register('fr', () => import('../locales/fr.json'));

// Initialize i18n
init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator() || 'en'
});

// ✅ Set locale explicitly (use .set(), not $locale)
locale.set(getLocaleFromNavigator() || 'en');
