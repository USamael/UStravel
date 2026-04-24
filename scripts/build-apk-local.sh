#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCAL_SDK="$PROJECT_DIR/.android-sdk"
LOCAL_JDK="$(find "$PROJECT_DIR/.jdks" -maxdepth 1 -type d -name 'jdk-21*' | sort | tail -n 1)"
APK_PATH="$PROJECT_DIR/android/app/build/outputs/apk/debug/app-debug.apk"

if [[ -z "$LOCAL_JDK" || ! -x "$LOCAL_JDK/bin/java" ]]; then
  echo "Java 21 bulunamadi: $PROJECT_DIR/.jdks/jdk-21*"
  exit 1
fi

if [[ ! -d "$LOCAL_SDK/platforms/android-36" ]]; then
  echo "Android SDK bulunamadi: $LOCAL_SDK"
  exit 1
fi

export JAVA_HOME="$LOCAL_JDK"
export ANDROID_HOME="$LOCAL_SDK"
export ANDROID_SDK_ROOT="$LOCAL_SDK"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

cd "$PROJECT_DIR"
npm run build
npx cap sync android

cd "$PROJECT_DIR/android"
./gradlew assembleDebug

echo
echo "APK hazir: $APK_PATH"
