# Android Tablete Yükleme

Bu proje artık APK üretmek için Capacitor Android projesi de içerir. APK istiyorsanız ana rehber:

```text
BUILD_APK.md
```

Aşağıdaki PWA yöntemi APK yerine tarayıcı üzerinden kurulum içindir.

## 1. Bilgisayarda build al

```bash
npm run build
```

Build çıktısı `dist/` klasörüne oluşur.

## 2. LocalSend ile tablete gönder

1. `dist/` klasörünü zip yap.
2. Zip dosyasını LocalSend veya benzeri bir gönderim uygulamasıyla tablete gönder.
3. Tablette zip dosyasını bir klasöre çıkar.

## 3. Tablette local server ile aç

Android'de Chrome PWA kurulumu için sayfanın `http://localhost:...` üzerinden açılması en sorunsuz yoldur.

1. Play Store'dan basit bir HTTP server uygulaması kur. Örnekler: `Simple HTTP Server`, `HTTP Server`, `KSWEB`.
2. Server uygulamasında çıkarılmış `dist/` klasörünü web root olarak seç.
3. Server'ı başlat.
4. Chrome'da server uygulamasının verdiği localhost adresini aç. Örnek: `http://127.0.0.1:8080`

## 4. Uygulama gibi kur

1. Chrome menüsünü aç.
2. `Uygulamayı yükle` veya `Ana ekrana ekle` seçeneğine dokun.
3. Kurulumdan sonra uygulama ikonuyla açılır, landscape ve standalone modda çalışır.

Not: Doğrudan `index.html` dosyasına dosya yöneticisinden dokunup açmak PWA kurulumu için yeterli değildir. Service worker ve offline çalışma için `localhost` ya da HTTPS gerekir.
