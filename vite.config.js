import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                modules: resolve(__dirname, 'modules.html'),
                training: resolve(__dirname, 'training.html'),
                blog: resolve(__dirname, 'blog.html'),
                about: resolve(__dirname, 'about.html'),
                portals: resolve(__dirname, 'portals.html'),
            },
        },
    },
});
