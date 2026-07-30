// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.wjkun.cn',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return (
          path !== '/404/' &&
          path !== '/search/' &&
          !path.startsWith('/tags/') &&
          !/^\/\d{4}\/\d{2}\/\d{2}\//.test(path)
        );
      },
    }),
  ],
});
