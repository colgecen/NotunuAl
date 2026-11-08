# AGENTS.md — NotunuAl! (AI Ajan Talimatları)

Bu dosya, bu repoda çalışan **her AI ajanın** ilk okuyacağı dosyadır.
Sırayla oku: `AGENTS.md` → `SPEC.md` → `ARCHITECTURE.md` → `TASKS.md`.

## 1. Proje özeti

**NotunuAl!** — hızlı, klavye odaklı, çevrimdışı bir not alma masaüstü uygulaması.

- Hedef platform: **Fedora ve Arch Linux, Wayland oturumu**
- Dağıtım: **AppImage**
- Teknoloji: **Tauri v2 + React + TypeScript + Vite**
- Veri: cihazda (IndexedDB / Dexie), sunucu yok, hesap yok, ağ isteği yok

Ürün gereksinimleri `SPEC.md` içindedir. Oradaki bir madde ile kendi fikrin çelişirse **SPEC kazanır**.

## 2. Çalışma kuralları (ZORUNLU)

1. **Sadece `TASKS.md` içindeki sıradaki görevi yap.** Görev dışı iş yapma, kapsam genişletme.
2. Bir seferde **tek görev**. Bitmeden diğerine geçme.
3. Görev bitince **Görev Tamamlama Protokolü** (aşağıda) birebir uygulanır.
4. Emin olmadığın üründe karar için `SPEC.md`'ye bak. Orada yoksa varsayım yap, `TASKS.md` altındaki **Karar Günlüğü**'ne tek satır yaz ve devam et. Kullanıcıyı gereksiz soruyla bekletme.
5. Yeni bağımlılık eklemeden önce: gerçekten gerekli mi, bakımı sürüyor mu, boyutu makul mü? Evetse ekle ve `ARCHITECTURE.md` bağımlılık tablosunu güncelle.
6. Testsiz özellik **bitmiş sayılmaz**.
7. Kırık (kırmızı) durumu **asla** `push` etme.
8. Gizli bilgi, anahtar, kullanıcı verisi commit'leme.

## 3. Görev Tamamlama Protokolü

Her görev için sırayla:

```
1. TASKS.md'de görevi [~] (devam ediyor) yap
2. Kodu yaz + testleri yaz
3. Doğrula:      pnpm verify
                 (Rust'a dokunduysan ayrıca: cd src-tauri && cargo fmt --check && cargo clippy -- -D warnings && cargo test)
4. Kırmızıysa düzelt, 3'e dön. Yeşil olmadan ilerleme.
5. TASKS.md'de görevi [x] yap, bitiş notunu yaz
6. git add -A
7. git commit -m "<tip>(<kapsam>): <özet> [T07]"
8. git push
```

- `pnpm verify` = `lint` + `typecheck` + `test` + `build:web`. Hepsi geçmeli.
- Push başarısızsa (ağ, uzak ayar) bunu `TASKS.md` Blokajlar bölümüne yaz, commit'i yerelde tut.
- Bir görev = genelde **tek commit**. Gerekirse küçük ek commit'lere bölünebilir ama hepsi aynı görev kimliğini taşır.

## 4. Commit kuralı (Conventional Commits)

Biçim: `<tip>(<kapsam>): <kısa emir kipinde özet> [Txx]`

| Tip | Ne zaman |
|---|---|
| `feat` | Yeni özellik |
| `fix` | Hata düzeltme |
| `test` | Sadece test |
| `refactor` | Davranış değiştirmeyen düzenleme |
| `docs` | Dokümantasyon |
| `chore` | Araç, bağımlılık, yapılandırma |
| `build` | Paketleme, AppImage, CI |
| `style` | Biçimlendirme |

Örnekler:

```
feat(search): add "." shortcut to focus search and select first result [T05]
test(repo): cover note CRUD and ordering [T01]
build(appimage): add Wayland-safe AppImage bundle script [T15]
```

Commit mesajları **İngilizce**, kısa ve emir kipinde.

## 5. Kod standardı

- **TypeScript strict** açık. `any` yasak (zorunluysa nedenini yorumla).
- Bileşenler fonksiyonel React, hook kullan. Durum için **Zustand**.
- Dosya adları: bileşen `PascalCase.tsx`, diğerleri `camelCase.ts`.
- Bir dosya ~300 satırı geçmesin; geçerse böl.
- UI metinleri **Türkçe**, kodda isimler **İngilizce**.
- Metinler tek yerde: `src/i18n/tr.ts` (sabit nesne). Bileşen içine gömülü string yazma.
- Klavye kısayolları **tek yerde** tanımlı: `src/shortcuts/registry.ts`.
- Yan etki (DB, dosya, Tauri) UI bileşeninde değil, `src/services/` altında.
- Erişilebilirlik: her buton `aria-label`, odak halkası görünür, tüm akış klavyeyle yürür.

## 6. Test standardı

- Birim/bileşen: **Vitest** + **Testing Library**
- IndexedDB testleri: `fake-indexeddb`
- Uçtan uca (görev T16'dan itibaren): **Playwright** (web build üzerinde)
- Rust: `cargo test`
- Her yeni davranış için en az **bir başarılı yol + bir sınır/hata durumu** testi
- Testler deterministik olmalı: gerçek zaman, rastgelelik, ağ kullanma (sahte saat kullan)

## 7. Komutlar

```bash
pnpm install            # bağımlılıklar
pnpm dev                # sadece web (Vite), hızlı geliştirme
pnpm tauri dev          # masaüstü penceresiyle geliştirme
pnpm lint               # eslint
pnpm typecheck          # tsc --noEmit
pnpm test               # vitest run
pnpm test:e2e           # playwright
pnpm build:web          # vite build
pnpm verify             # lint + typecheck + test + build:web  (commit öncesi ZORUNLU)
pnpm tauri build        # AppImage dahil paketler
```

## 8. Linux geliştirme ortamı

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

Ortak: Rust (`rustup`), Node 20+, `pnpm`.

### Wayland notları
- Zorla X11 kullandırma (`GDK_BACKEND=x11` **koyma**). Uygulama yerel Wayland'de çalışmalı.
- Bazı GPU/sürücülerde WebKitGTK boş/beyaz pencere verirse **yalnızca geçici çözüm** olarak:
  `WEBKIT_DISABLE_DMABUF_RENDERER=1`. Bunu varsayılan yapma; sorun yaşanırsa `README.md`'de belgele.
- AppImage'i **eski bir dağıtımda** (Ubuntu 22.04 tabanlı CI) derle; böylece Fedora ve Arch'ta glibc uyumu sorunsuz olur.
- Arch'ta AppImage derlerken `NO_STRIP=true` gerekebilir (linuxdeploy strip hatası).

## 9. Yapılmaması gerekenler

- Ağ isteği, telemetri, analitik **yok**.
- Kullanıcı notlarını loglama.
- `TASKS.md` dışı büyük yeniden yapılandırma.
- `--no-verify` ile commit, `--force` ile push.
- Testi geçirmek için testi silmek/gevşetmek.

## 10. Bitmiş sayılma ölçütü (Definition of Done)

- [ ] Görevin kabul ölçütleri sağlanıyor
- [ ] Yeni/yenilenen testler yazıldı ve geçiyor
- [ ] `pnpm verify` yeşil (+ Rust'a dokunulduysa cargo kontrolleri)
- [ ] Gerekliyse `ARCHITECTURE.md` / `SPEC.md` güncellendi
- [ ] `TASKS.md` işaretlendi
- [ ] Commit atıldı ve **push** edildi
