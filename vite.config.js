import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    // --- TAMBAHKAN KODE INI DI BAWAH PLUGINS ---
    server: {
        host: '127.0.0.1', // Memaksa Vite menggunakan IP standar, bukan [::1]
        cors: true,        // Mengizinkan Laragon (CORS) mengambil file desain
    }
});