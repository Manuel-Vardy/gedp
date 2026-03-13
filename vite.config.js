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
                'gedp-admin-login': resolve(__dirname, 'gedp-admin-login.html'),
                'gedp-admin': resolve(__dirname, 'gedp-admin.html'),
                gallery: resolve(__dirname, 'gallery.html'),
                assurance: resolve(__dirname, 'assurance/index.html'),
                promotion: resolve(__dirname, 'promotion/index.html'),
                recruitment: resolve(__dirname, 'recruitment-portal/index.html'),
                school: resolve(__dirname, 'school-placement/index.html'),
                'study-leave': resolve(__dirname, 'study-leave/index.html'),
                transfer: resolve(__dirname, 'transfer/index.html'),
                upgrading: resolve(__dirname, 'upgrading/index.html'),
            },
        },
    },
    publicDir: 'public',
});
