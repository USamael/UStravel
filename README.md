# Seyahat Günlüğüm

Seyahat Günlüğüm, ziyaret edilen şehirleri, notları ve gelecek rotaları harita üzerinde takip etmek için hazırlanmış React/Vite tabanlı bir PWA uygulamasıdır. Aynı web uygulaması Capacitor ile Android APK olarak da paketlenebilir.

## Geliştirme

```bash
npm install
npm run dev
```

## Web build

```bash
npm run build
```

Üretim çıktısı `dist/` klasörüne alınır. Vercel için gerekli ayarlar `vercel.json` dosyasında hazırdır.

## Vercel

Vercel proje ayarları:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Android

```bash
npm run android:sync
npm run android:apk:local
```

Yerel Android SDK/JDK klasörleri ve build çıktıları GitHub'a dahil edilmez.
