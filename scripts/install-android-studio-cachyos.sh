#!/usr/bin/env bash
set -euo pipefail

info() {
  printf "\n\033[1;36m%s\033[0m\n" "$1"
}

warn() {
  printf "\n\033[1;33m%s\033[0m\n" "$1"
}

has_command() {
  command -v "$1" >/dev/null 2>&1
}

install_paru_if_missing() {
  if has_command paru; then
    return
  fi

  info "paru bulunamadi, AUR helper kuruluyor."
  sudo pacman -S --needed base-devel git
  rm -rf /tmp/paru-bin
  git clone https://aur.archlinux.org/paru-bin.git /tmp/paru-bin
  cd /tmp/paru-bin
  makepkg -si
}

install_android_studio() {
  if has_command android-studio; then
    info "Android Studio zaten kurulu."
    return
  fi

  if sudo pacman -S --needed --noconfirm android-studio; then
    info "Android Studio pacman ile kuruldu."
    return
  fi

  warn "pacman android-studio paketini bulamadi. AUR uzerinden kurulacak."
  install_paru_if_missing
  paru -S --needed android-studio
}

persist_env() {
  local bashrc="$HOME/.bashrc"
  local fish_config="$HOME/.config/fish/config.fish"

  mkdir -p "$(dirname "$fish_config")"

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

  grep -q "ANDROID_HOME.*Android/Sdk" "$fish_config" 2>/dev/null || {
    {
      echo ''
      echo '# Android APK build ortamı'
      echo 'set -gx JAVA_HOME /usr/lib/jvm/java-17-openjdk'
      echo 'set -gx ANDROID_HOME $HOME/Android/Sdk'
      echo 'set -gx ANDROID_SDK_ROOT $HOME/Android/Sdk'
      echo 'fish_add_path $JAVA_HOME/bin $ANDROID_HOME/platform-tools $ANDROID_HOME/cmdline-tools/latest/bin'
    } >> "$fish_config"
  }
}

info "Android Studio kurulumu basliyor."
sudo pacman -S --needed jdk17-openjdk android-tools unzip zip git
sudo archlinux-java set java-17-openjdk || true
install_android_studio
persist_env

info "Kurulum hazir."
cat <<'EOF'
Simdi Android Studio acilacak.

Yapman gerekenler:
1. Setup Wizard ekraninda Standard sec.
2. Android SDK, Platform Tools ve Build Tools kurulumunu onayla.
3. Kurulum bitince Android Studio'yu kapat.
4. Terminale geri donup sunu calistir:

npm run apk:cachyos
EOF

android-studio
