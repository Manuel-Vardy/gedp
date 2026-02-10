import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                modules: resolve(__dirname, 'modules.html'),
                blog: resolve(__dirname, 'blog.html'),
                about: resolve(__dirname, 'about.html'),
                portals: resolve(__dirname, 'portals.html'),
                privacy: resolve(__dirname, 'privacy.html'),
                terms: resolve(__dirname, 'terms.html'),
                'blog-post': resolve(__dirname, 'blog-post.html'),
                'admin-login': resolve(__dirname, 'admin-login.html'),
                admin: resolve(__dirname, 'admin.html'),
                gallery: resolve(__dirname, 'gallery.html'),
            },
        },
    },
    publicDir: 'public',
});
