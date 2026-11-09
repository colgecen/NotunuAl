# NotunuAl!

Hızlı, klavye odaklı, **tamamen çevrimdışı** bir not alma uygulaması.
Notlar yalnızca cihazda (IndexedDB) durur; hesap, ağ isteği ve telemetri yoktur.

- Platform: **Fedora / Arch Linux, Wayland** (AppImage)
- Teknoloji: Tauri v2 + React + TypeScript + Vite

## Özellikler

- Not listesi: kalın başlık, sağda soluk tek satır açıklama
- Üç görünüm modu: satır satır, simge simge, uygulamanın ana hali
- Açık/koyu tema (sistem temasıyla başlar, seçim hatırlanır)
- Zengin metin: kalın, italik, yazı rengi, fosforlu kalem, 5 yazı tipi, 12–32 px boyut
- Otomatik kayıt (~0,8 sn) + `Ctrl+S`
- Beş biçimde dışa aktarma: `.xlsx`, `.docx`, `.pptx`, `.pdf`, `.txt`
- Türkçe karakterlere duyarlı anlık arama; 5.000 notta < 100 ms

## Kısayollar

| Kısayol | Eylem |
|---|---|
| `.` | Aramaya odaklan (metin alanı dışında) |
| `↑` / `↓` | Sonuçlarda gezin |
| `Enter` | Seçili notu aç |
| `Esc` | Aramayı temizle / editörden kaydederek çık |
| `Ctrl+N` | Yeni not |
| `Ctrl+K` | Tema değiştir |
| `Ctrl+S` | Kaydet |

## Geliştirme

Gereksinimler: Node 20+, `pnpm`, Rust (`rustup`).

```bash
pnpm install
pnpm dev          # yalnızca web (hızlı geliştirme)
pnpm tauri dev    # masaüstü penceresi
pnpm verify       # lint + typecheck + test + build:web
pnpm test:e2e     # Playwright (önce: pnpm exec playwright install chromium)
```

### Linux sistem bağımlılıkları

**Fedora:**

```bash
sudo dnf install webkit2gtk4.1-devel openssl-devel curl wget file \
  libappindicator-gtk3-devel librsvg2-devel libxdo-devel
sudo dnf group install "c-development"
```

**Arch:**

```bash
sudo pacman -S --needed webkit2gtk-4.1 base-devel curl wget file openssl \
  appmenu-gtk-module libappindicator-gtk3 librsvg xdotool
```

## AppImage derleme

```bash
pnpm build:appimage
```

veya doğrudan:

```bash
pnpm tauri build
```

Çıktı: `src-tauri/target/release/bundle/appimage/NotunuAl!_*.AppImage`

- AppImage'i **eski bir dağıtımda** (Ubuntu 22.04 tabanlı CI) derlemek glibc uyumunu garanti eder.
- Arch'ta `linuxdeploy` strip hatası alırsan: `NO_STRIP=true pnpm tauri build`.

## Çalıştırma

```bash
chmod +x NotunuAl!_*.AppImage
./NotunuAl!_*.AppImage
```

### Wayland notları

- Uygulama yerel Wayland'de çalışır; `GDK_BACKEND=x11` **kullanılmaz**.
- Bazı GPU/sürücülerde WebKitGTK boş/beyaz pencere verirse **yalnızca geçici çözüm** olarak:

  ```bash
  WEBKIT_DISABLE_DMABUF_RENDERER=1 ./NotunuAl!_*.AppImage
  ```

  Bu ayar varsayılan değildir; sorun yaşamıyorsanız kullanmayın.

## Veri ve gizlilik

- Notlar ve ayarlar cihazda kalır (IndexedDB + `localStorage`).
- Ağ isteği yoktur; CSP `connect-src 'none'` ile zorlanır.
- Silme işlemi onay ister ve geri alınamaz.

## Lisans

Uygulama kodu MIT. Gömülü PDF yazı tipleri Liberation Sans (SIL Open Font License);
ayrıntı: `src/assets/fonts/LICENSE`.
