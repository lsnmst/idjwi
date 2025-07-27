/* import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
} */

import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter(),
    paths: {
      base: '/your-repo-name' // replace with your repo name
    }
  }
};
