import { getLocaleFromNavigator } from 'svelte-i18n';
import { points_en } from './points_en.js';
import { points_fr } from './points_fr.js';

const locale = getLocaleFromNavigator();

// ✅ Choose which dataset to export
export const points = locale.startsWith('fr') ? points_fr : points_en;
