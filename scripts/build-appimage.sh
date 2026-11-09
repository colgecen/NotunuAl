#!/usr/bin/env bash
# NotunuAl! AppImage derleme betiği.
#
# Kullanım:
#   ./scripts/build-appimage.sh            # hızlı derleme
#   ./scripts/build-appimage.sh --verify   # önce pnpm verify
#
# Notlar:
# - AppImage'i eski bir dağıtımda (Ubuntu 22.04 tabanlı CI) derlemek
#   Fedora/Arch'ta glibc uyumunu garanti eder.
# - Arch'ta linuxdeploy strip hatası alırsan NO_STRIP=true ile çalıştır.
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ "${1:-}" == "--verify" ]]; then
  echo "==> pnpm verify"
  pnpm verify
fi

if [[ "$(uname -s)" == "Linux" && "$(uname -m)" == "x86_64" ]]; then
  if command -v pacman >/dev/null 2>&1 && [[ -z "${NO_STRIP:-}" ]]; then
    echo "==> Arch tespit edildi: NO_STRIP=true"
    export NO_STRIP=true
  fi
fi

echo "==> pnpm tauri build"
pnpm tauri build

shopt -s nullglob
artifacts=(src-tauri/target/release/bundle/appimage/*.AppImage)
if (( ${#artifacts[@]} == 0 )); then
  echo "HATA: AppImage üretilmedi." >&2
  exit 1
fi

echo
echo "Üretilen AppImage:"
for f in "${artifacts[@]}"; do
  printf '  %s (%s)\n' "$f" "$(du -h "$f" | cut -f1)"
done
echo
echo "Çalıştırmak için: chmod +x '<dosya>.AppImage' && ./<dosya>.AppImage"
