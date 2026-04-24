#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APK_PATH="$PROJECT_DIR/android/app/build/outputs/apk/debug/app-debug.apk"

info() {
  printf "\n\033[1;36m%s\033[0m\n" "$1"
}

warn() {
  printf "\n\033[1;33m%s\033[0m\n" "$1"
}

fail() {
  printf "\n\033[1;31m%s\033[0m\n" "$1"
  exit 1
}

has_command() {
  command -v "$1" >/dev/null 2>&1
}

ensure_pacman_packages() {
  local missing=()

  for package_name in "$@"; do
    if ! pacman -Qi "$package_name" >/dev/null 2>&1; then
      missing+=("$package_name")
    fi
  done

  if ((${#missing[@]} > 0)); then
    info "Eksik sistem paketleri kuruluyor: ${missing[*]}"
    sudo pacman -S --needed "${missing[@]}"
  fi
}

ensure_android_studio_hint() {
  if has_command android-studio; then
    return
  fi

  warn "android-studio komutu bulunamadi."
  cat <<'EOF'
Android Studio kurulu degilse su komutlardan biriyle kur:

sudo pacman -S --needed android-studio

Eger pacman paket bulamazsa:

sudo pacman -S --needed base-devel git
git clone https://aur.archlinux.org/paru.git /tmp/paru
cd /tmp/paru
makepkg -si
paru -S android-studio

Sonra Android Studio'yu bir kez acip SDK kurulum sihirbazini tamamla:

android-studio
EOF
}

ensure_java() {
  if ! has_command java; then
    info "Java bulunamadi, jdk17-openjdk kuruluyor."
    sudo pacman -S --needed jdk17-openjdk
  fi

  if has_command archlinux-java && archlinux-java status | grep -q "java-17-openjdk"; then
    sudo archlinux-java set java-17-openjdk
  fi

  export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-17-openjdk}"
  export PATH="$JAVA_HOME/bin:$PATH"

  if ! java -version >/dev/null 2>&1; then
    fail "Java calismiyor. Android Studio veya jdk17-openjdk kurulumunu kontrol et."
  fi
}

ensure_android_env() {
  export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
  export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
  export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

  if [[ ! -d "$ANDROID_HOME" ]]; then
    warn "Android SDK klasoru bulunamadi: $ANDROID_HOME"
    cat <<EOF
Android Studio'yu ac ve SDK kurulumunu tamamla:

android-studio

Kurulumdan sonra bu script'i tekrar calistir:

bash "$PROJECT_DIR/scripts/build-apk-cachyos.sh"
EOF
    exit 1
  fi
}

persist_shell_env() {
  local bashrc="$HOME/.bashrc"

  grep -q "JAVA_HOME=/usr/lib/jvm/java-17-openjdk" "$bashrc" 2>/dev/null || {
    {
      echo ''
      echo '# Android APK build ortamı'
      echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk'
      echo 'export ANDROID_HOME="$HOME/Android/Sdk"'
      echo 'export ANDROID_SDK_ROOT="$HOME/Android/Sdk"'
      echo 'export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"'
    } >> "$bashrc"
  }
}

accept_android_licenses() {
  if has_command sdkmanager; then
    info "Android SDK lisanslari kabul ediliyor."
    yes | sdkmanager --licenses >/dev/null || true
  else
    warn "sdkmanager bulunamadi. Android Studio SDK Command-line Tools kurulu olmayabilir."
  fi
}

build_apk() {
  cd "$PROJECT_DIR"

  info "Node paketleri kontrol ediliyor."
  npm install

  info "Web build Android projesine senkronlanıyor."
  npm run android:sync

  info "Debug APK uretiliyor."
  cd "$PROJECT_DIR/android"
  ./gradlew assembleDebug

  if [[ -f "$APK_PATH" ]]; then
    info "APK hazir:"
    printf "%s\n" "$APK_PATH"
    printf "\nLocalSend ile tablete bu dosyayi gonder:\n%s\n" "$APK_PATH"
  else
    fail "Build bitti ama APK bulunamadi: $APK_PATH"
  fi
}

info "CachyOS Android APK build hazirligi basladi."

ensure_pacman_packages jdk17-openjdk android-tools unzip zip git
ensure_android_studio_hint
ensure_java
ensure_android_env
persist_shell_env
accept_android_licenses
build_apk
