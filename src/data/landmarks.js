import { getLocaleFromNavigator } from 'svelte-i18n';
import { landmarks_en } from './landmarks_en.js';
import { landmarks_fr } from './landmarks_fr.js';

const locale = getLocaleFromNavigator();

// ✅ Choose which dataset to export
export const landmarks = locale.startsWith('fr') ? landmarks_fr : landmarks_en;
