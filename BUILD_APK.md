# APK Oluşturma ve Tablete Kurma

Proje artık Capacitor Android projesi içerir. CachyOS'ta APK üretimini kolaylaştırmak için tek komutluk script eklendi.

## En Kolay Yol

Projede terminal aç:

```bash
cd "/home/uralseneren/Masaüstü/TRAVEL APP"
npm run apk:cachyos
```

Bu script:

1. Gerekli CachyOS paketlerini kontrol eder.
2. Java 17 ortamını ayarlar.
3. Android SDK ortam değişkenlerini ayarlar.
4. Android lisanslarını kabul etmeyi dener.
5. Web build alır.
6. Android projesini senkronlar.
7. Debug APK üretir.

Başarılı olursa APK şu konuma oluşur:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Android Studio Gerekiyorsa

Script Android SDK klasörünü bulamazsa Android Studio'yu bir kez açıp SDK kurulumunu tamamlaman gerekir:

```bash
android-studio
```

Sonra tekrar çalıştır:

```bash
npm run apk:cachyos
```

## Manuel APK üretme

```bash
npm run android:apk
```

Başarılı olursa APK şu konuma oluşur:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Bu debug APK test için uygundur.

## Android Studio ile üretme

Terminalde:

```bash
npm run android:open
```

Android Studio açılınca:

1. Gradle sync tamamlanmasını bekle.
2. Menüden `Build > Build Bundle(s) / APK(s) > Build APK(s)` seç.
3. APK yine `android/app/build/outputs/apk/debug/app-debug.apk` altında oluşur.

## Tablete LocalSend ile gönderme

1. `app-debug.apk` dosyasını LocalSend ile Android tablete gönder.
2. Tablette APK dosyasına dokun.
3. Gerekirse `Bilinmeyen uygulamaları yükle` iznini aç.
4. Kurulumu tamamla.

## Notlar

- Uygulama tabletin ekran yonune gore donebilir.
- Uygulama adı `Seyahat Günlüğüm` olarak görünür.
- Paket adı `com.seyahatgunlugum.app`.
- İlk kurulumda Android, debug APK olduğu için güvenlik uyarısı gösterebilir. Bu normaldir.
