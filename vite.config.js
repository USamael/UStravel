import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@react-three/fiber") || id.includes("/three/")) {
            return "explore-globe";
          }

          if (id.includes("maplibre-gl")) {
            return "maplibre";
          }

          if (id.includes("react-leaflet") || id.includes("/leaflet/")) {
            return "leaflet";
          }

          if (id.includes("framer-motion")) {
            return "motion";
          }

          if (id.includes("/react/") || id.includes("react-dom")) {
            return "react-core";
          }

          return undefined;
        }
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "icons/pwa-icon-192.png",
        "icons/pwa-icon-512.png",
        "icons/pwa-maskable-512.png",
        "splash/splash-landscape.png"
      ],
      workbox: {
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
        globIgnores: ["**/assets/catalog-data-*.js"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[abcd]\.basemaps\.cartocdn\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "carto-map-tiles",
              expiration: {
                maxEntries: 240,
                maxAgeSeconds: 60 * 60 * 24 * 14
              }
            }
          }
        ]
      },
      manifest: {
        name: "Seyahat Günlüğüm",
        short_name: "Seyahat",
        description: "Ziyaret edilen şehirleri, notları ve gelecek rotaları canlı harita üzerinde takip edin.",
        lang: "tr",
        theme_color: "#050816",
        background_color: "#050816",
        display: "standalone",
        start_url: "/",
        scope: "/",
        categories: ["travel", "productivity", "lifestyle"],
        icons: [
          {
            src: "/icons/pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/pwa-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        screenshots: [
          {
            src: "/splash/splash-landscape.png",
            sizes: "2732x2048",
            type: "image/png",
            form_factor: "wide",
            label: "Seyahat Günlüğüm başlangıç ekranı"
          }
        ]
      }
    })
  ]
});
