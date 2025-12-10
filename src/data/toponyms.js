import { getLocaleFromNavigator } from 'svelte-i18n';
import { toponyms_en } from './toponyms_en.js';
import { toponyms_fr } from './toponyms_fr.js';

const locale = getLocaleFromNavigator();

// ✅ Choose which dataset to export
export const toponyms = locale.startsWith('fr') ? toponyms_fr : toponyms_en;
