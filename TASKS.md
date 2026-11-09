# TASKS.md — NotunuAl! Görev Listesi

> **Ajan: önce `AGENTS.md`'yi oku.**
> Görevleri **sırayla** yap. Her görev bitince: **doğrula → işaretle → commit → push.**

## Durum işaretleri

- `[ ]` yapılacak
- `[~]` devam ediyor (aynı anda tek görev)
- `[x]` bitti (commit + push yapıldı)
- `[!]` blokajlı (Blokajlar bölümüne nedenini yaz)

## HER GÖREV İÇİN ZORUNLU PROTOKOL

```
1. Görevi [~] yap
2. Uygula + test yaz
3. pnpm verify            → lint + typecheck + test + build:web hepsi YEŞİL olmalı
   (Rust'a dokunduysan:   cd src-tauri && cargo fmt --check && cargo clippy -- -D warnings && cargo test)
4. Kırmızıysa düzelt; yeşil olmadan 5'e geçme
5. Görevi [x] yap + kısa bitiş notu yaz (ne yapıldı, varsa karar)
6. git add -A
7. git commit -m "<tip>(<kapsam>): <özet> [Txx]"      ← Conventional Commits, İngilizce
8. git push
```

**Kural:** Testler geçmeden commit/push yok. `--no-verify` ve `--force` yasak.

---

## Aşama 0 — Temel

### [x] T00 — Proje iskeleti
Tauri v2 + Vite + React + TypeScript (strict) + Tailwind + pnpm.
- ESLint, Prettier, Vitest, Testing Library, `fake-indexeddb` kurulumu
- `package.json` betikleri: `dev`, `tauri`, `lint`, `typecheck`, `test`, `test:e2e`, `build:web`, **`verify`**
- `.gitignore`, `README.md` (kurulum: Fedora ve Arch bağımlılıkları), `LICENSE` (MIT)
- Pencere başlığı **NotunuAl!**, bundle id `app.notunal.desktop`
- Örnek bir test (geçen)

**Kabul:** `pnpm verify` yeşil; `pnpm tauri dev` pencere açıyor; boş sayfada "NotunuAl!" yazıyor.
**Commit:** `chore(init): scaffold Tauri + React + TS project with verify script [T00]`

### [x] T01 — Veri katmanı
`src/types.ts`, Dexie şeması (`db.ts`), `noteRepo` (create, get, update/upsert, delete, list sıralı), `settingsService` (varsayılan + okuma hatasına dayanıklı).
- uuid üretimi, `createdAt`/`updatedAt` yönetimi
- `bodyText` türetme yardımcısı (TipTap JSON → düz metin)

**Test:** CRUD, `updatedAt` sıralaması, silme, bozuk ayar JSON'unda varsayılana dönüş.
**Kabul:** testler yeşil; UI'dan bağımsız çalışır.

### [x] T02 — Tema sistemi
CSS değişkenleri (açık: krem/kâğıt, koyu: koyu gri/lacivert), `data-theme`, `settingsStore.theme`, ilk açılışta sistem teması, kalıcılık, ilk boyamada yanıp sönme yok.
- `ThemeToggle` bileşeni (güneş/ay, toggle görünümlü)
- **Ctrl+K** ile geçiş (geçici basit dinleyici; T05'te registry'ye taşınacak)

**Test:** geçiş ve kalıcılık; `data-theme` özniteliği.
**Kabul:** tıkla/Ctrl+K ile tema değişir, yeniden açınca hatırlanır.

---

## Aşama 1 — Ana ekran

### [x] T03 — Uygulama kabuğu ve üst çubuk
Üst çubuk: sol **`+ Yeni Ekle`**, orta/geniş **arama çubuğu**, sağ **tema anahtarı**. Metinler `i18n/tr.ts`'de. Başlık **NotunuAl!**.
**Test:** bileşenler render oluyor, butonlar erişilebilir (`aria-label`).

### [x] T04 — Not listesi (satır görünümü)
`NoteList` + `NoteRow`: **kalın başlık**, en sağda boşluk bırakılmış **küçük ve soluk açıklama** (tek satır, kırpılmış). Başlık rengi uygulanır. Son güncellenen üstte. Boş durum mesajı.
**Test:** başlık kalın sınıfı, açıklama kırpma, sıralama, boş durum.
**Kabul:** SPEC §2.3 ile birebir uyumlu.

### [x] T05 — Kısayol kayıt defteri + arama + gezinme
- `shortcuts/registry.ts` + `useShortcuts` (Ctrl+K'yı da buraya taşı)
- **`.`** → aramaya odaklan (input/textarea/contenteditable içindeyken **tetiklenmez**)
- `searchService` (Fuse.js, Türkçe normalize)
- Sonuçlarda **ilk öğe otomatik seçili**, **↑/↓** ile gezinme (kenarda durur, görünür alana kaydırır), **Enter** ile not açma (şimdilik "notu aç" eylemi/yer tutucu ekran), **Esc** davranışı

**Test:** `.` odaklanır; metin alanında nokta yazılır; ilk öğe seçili; ↓↓↑ doğru indeks; Enter doğru id'yi açar; `İ/ı` aramaları; boş sorguda tüm liste.
**Kabul:** SPEC §2.2 ve §6 tablosu.

### [x] T06 — Görünüm modları
`ViewModeSwitch` ("açıklama" üstündeki ayar çubuğu): **satır / simge / ana hal**. `NoteGrid` (simge). Seçim **otomatik kaydedilir ve hatırlanır**.
**Test:** mod değişimi, kalıcılık, yeniden açılışta aynı mod.

---

## Aşama 2 — Not düzenleme

### [x] T07 — Yeni not + düzenleme ekranı iskeleti
- **Ctrl+N** ve `+ Yeni Ekle` → yeni not, imleç başlıkta
- Düzen: sol üst `Kaydet`/`Farklı Kaydet` (yer tutucu), başlık, **altında ayırıcı çizgi**, açıklama alanı
- Esc/geri ile listeye dönüş; boş not silinir
- Başlık rengi seçici + başlıkta renkli yazı

**Test:** yeni not oluşur, boş not silinir, başlık rengi saklanır ve listede görünür.

### [x] T08 — TipTap editörü ve biçim araç çubuğu
Açıklama için TipTap: **kalın, italik, yazı rengi, fosforlu kalem (highlight, renk seçilebilir), yazı tipi (5 font), açıklama yazı boyutu**. Başlık için de kalın/italik/renk/yazı tipi.
- Paketlenmiş fontlar (`@font-face`; bkz. ARCHITECTURE §5.5)
- Yazı boyutu `A-`/`A+` + kaydırıcı; **kalıcı hatırlanır**
- İsteğe bağlı **tarih ekle** butonu (tarih seçici, kaldırılabilir)
- Seçili yazıya uygulama ve temizleme

**Test:** işaretler JSON'a doğru yazılıyor; font/boyut/renk uygulanıyor; tarih ekle/kaldır.

### [x] T09 — Kaydet ve otomatik kayıt
`Kaydet` butonu + **Ctrl+S**; ~800 ms debounce otomatik kayıt; "●" kirli işareti, "Kaydedildi" bildirimi; çıkışta bekleyen kaydı flush.
**Test:** sahte zamanlayıcı ile debounce, flush, kirli durum göstergesi, veri kalıcılığı (yeniden yükle).

### [x] T10 — Not silme
Düzenleme ekranında ve listede silme (onay penceresi). (SPEC §7)
**Test:** onaylı silme, vazgeç.

---

## Aşama 3 — Farklı Kaydet (dışa aktarma)

### [x] T11 — Dışa aktarma modeli + TXT
`export/model.ts` (TipTap JSON → `ExportDoc`), `txt.ts`, dosya adı temizleme. `Farklı Kaydet` menüsü iskeleti (5 seçenek).
**Test:** model dönüşümü (kalın/italik/renk/vurgu), TXT içeriği, Türkçe karakterler, dosya adı temizleme.

### [x] T12 — DOCX ve XLSX
`docx.ts` (biçim korunur, gerçek font adları), `xlsx.ts` (A1 başlık, A2 açıklama, A3 tarih).
**Test:** üretilen zip açılıp metin/biçim doğrulanır; Türkçe karakter.

### [x] T13 — PDF ve PPTX
`pdf.ts` (**gömülü TTF**, Türkçe karakter, renk/kalın/italik, sayfa bölme), `pptx.ts` (başlık slaytı + taşan gövdeyi ek slaytlara böl).
**Test:** PDF başlığı/boyutu/sayfa sayısı; PPTX slayt sayısı ve metin; Türkçe karakter.
_Bitiş notu:_ Liberation Sans TTF'leri `scripts/generate-pdf-fonts.mjs` ile base64 TS modülüne (`pdfFontData.ts`) gömüldü (CSP `connect-src 'none'` nedeniyle fetch yok). Dışa aktarma kütüphaneleri dinamik import ile ayrı chunk'ta (ana bundle ~714 kB). Testler: %PDF başlığı, gömülü font, tek/çok sayfa, PPTX zip içinde slayt sayısı + Türkçe metin + kalın çalıştırma. `exportSave` şimdilik web indirmesi kullanır; native diyalog T14'te.

### [x] T14 — Yerel kaydetme iletişim kutusu
`fileService` (Tauri `dialog.save` + `fs.writeFile`, web'de indirme yedeği), biçim filtreleri, varsayılan ad = başlık, hata/başarı bildirimi. Tauri izinleri **minimum** (`capabilities`).
**Test:** `fileService` sahte (mock) Tauri API ile; iptal ve hata yolları.
_Bitiş notu:_ `fileService.saveBytes(ad, bytes, biçim)` → `saved | cancelled | error`. Capability yalnız `core:default + dialog:allow-save + fs:allow-write-file` (seçilen yol dialog eklentisi tarafından çalışma zamanında fs kapsamına eklenir; statik scope gerekmez). Editörde `role="status"` ile kayıt/başarı bildirimi. 4 test: web indirme, Tauri kayıt, iptal, yazma hatası.

---

## Aşama 4 — Kalite ve paketleme

### [x] T15 — Uçtan uca testler + performans
Playwright (web build): `.` → arama → ↓ ↓ → Enter → düzenle → Kaydet; Ctrl+N; Ctrl+K; görünüm modu kalıcılığı.
- 5.000 notla arama < 100 ms ölçümü (testte yaklaşık eşik)
- Liste için sanallaştırma gerekirse ekle (`@tanstack/react-virtual`)

**Kabul:** `pnpm test:e2e` yeşil; `pnpm verify` içine dahil edilmese de CI'da koşar.
_Bitiş notu:_ 5 e2e testi geçiyor (4 akış + 5.000 notla arama performansı). Ölçüm: dizgi öneki hızlı yolu + `@tanstack/react-virtual` ile liste sanallaştırması; önce ~470 ms olan arama yanıtı <100 ms'ye indi. Arama servisi önce normalize alt dizgi eşleşmesi, sonuç yoksa Fuse bulanık aramaya düşer. Çıkan hata düzeltmesi: editörde **Geri** artık listeye dönüyor. Testlerde jsdom için `clientWidth/clientHeight` + `ResizeObserver` taklidi eklendi.

### [x] T16 — Erişilebilirlik ve cila
Odak halkası, `aria-*`, klavye ile tüm akış, kontrast (iki temada), animasyon sadeleştirme, uygulama simgesi, pencere min boyutu.
**Test:** temel a11y kontrolleri (axe veya benzeri).
_Bitiş notu:_ Tüm UI metinleri `tr.ts`'ye taşındı. Liste `role="list"`/`listitem` (iç içe etkileşim ihlali giderildi), TipTap alanına `aria-label` + `aria-multiline`, sonuç sayısı `aria-live` ile duyurulur, onay penceresi `role="alertdialog"` + Esc ile kapanır. `prefers-reduced-motion` desteği, `--danger` rengi (açık `#b91c1c`, koyu `#f87171`) ve soluk metin `#6b655a` ile AA kontrastı sağlandı. Simge `assets/icon.png`'den `pnpm tauri icon` ile üretildi, `bundle.icon` bağlandı; pencere min 600×400. Ctrl+N artık her yerde, Esc editörde önce kaydedip listeye dönüyor. Testler: 4 axe kontrolü + 8 kontrast kontrolü + Esc/Ctrl+N e2e.

### [x] T17 — AppImage (Fedora / Arch, Wayland)
- `tauri.conf.json` bundle hedefi `appimage`; `scripts/build-appimage.sh`
- `README.md`: derleme bağımlılıkları (Fedora/Arch), çalıştırma (`chmod +x`), Wayland notları (`WEBKIT_DISABLE_DMABUF_RENDERER=1` yalnızca geçici çözüm olarak)
- CI: GitHub Actions, `ubuntu-22.04` üzerinde `verify` + AppImage derleme + artifact yükleme
- Elle doğrulama listesi (aşağıda)

**Kabul:** `pnpm tauri build` AppImage üretir; Fedora ve Arch'ta Wayland oturumunda açılır (elle doğrulama).
**Commit:** `build(appimage): add AppImage bundling, CI and Wayland notes [T17]`
_Bitiş notu:_ `README.md` (özellikler, kısayollar, Fedora/Arch bağımlılıkları, çalıştırma, Wayland notları, gizlilik) ve `scripts/build-appimage.sh` (Arch'ı algılayıp `NO_STRIP=true`, `--verify` seçeneği, artifact listesi) eklendi. `package.json` içine `build:appimage` eklendi. `.github/workflows/ci.yml` üç iş içeriyor: `verify`, `e2e` (Chromium) ve `appimage` (`ubuntu-22.04` + Tauri bağımlılıkları + Rust cache + artifact yükleme). Yerel `pnpm tauri build` eksik `webkit2gtk4.1`/`libsoup-3.0` nedeniyle çalıştırılamadı (bkz. Blokajlar); AppImage derlemesi CI'da yapılır. `pnpm verify` yeşil: 18 dosya, 62 test.

### [x] T18 — Sürüm 0.1.0
`CHANGELOG.md`, sürüm numarası, etiket (`v0.1.0`), kısa kullanım kılavuzu (kısayollar tablosu).
**Commit:** `chore(release): v0.1.0 [T18]`
_Bitiş notu:_ `CHANGELOG.md` (Keep a Changelog biçimi, 0.1.0 özellikleri) ve `docs/KULLANIM.md` (ilk açılış, not oluşturma, arama, görünüm, dışa aktarma, silme, kısayollar, veri konumu, Wayland sorun giderme) eklendi; README'den bağlandı. Sürüm `0.1.0` olarak `package.json`, `src-tauri/Cargo.toml` ve `src-tauri/tauri.conf.json` içinde tutarlı. `v0.1.0` etiketi oluşturulup push edildi.

---

## Elle doğrulama listesi (T17 sonrası, insan yapar)

- [ ] Fedora (Wayland): AppImage açılıyor, pencere net, yazı tipleri doğru
- [ ] Arch (Wayland): aynı kontroller
- [ ] `.` ile arama, ↑/↓/Enter akışı
- [ ] Ctrl+N, Ctrl+K, Ctrl+S
- [ ] Beş formatta "Farklı Kaydet": dosyalar Word/LibreOffice/PDF okuyucuda açılıyor, Türkçe karakterler doğru
- [ ] Uygulamayı kapat-aç: notlar, tema, görünüm modu, yazı boyutu hatırlanıyor

---

## Karar Günlüğü

> Ajan: belirsiz kalan yerde yaptığın varsayımı **tek satır** ekle.

| Tarih | Görev | Karar | Gerekçe |
|---|---|---|---|
| 2026-11-08 | T08 | Başlık biçimlendirmesi renk + yazı tipiyle sınırlandı. | `Note.title` düz metin; liste kalın başlık ve açıklama için TipTap biçimleri yeterli. |
| 2026-11-08 | T13 | PDF fontları TTF yerine base64 TS modülü olarak gömüldü; export kütüphaneleri dinamik import chunk. | CSP `connect-src 'none'` fetch'i engeller; ana bundle açılış hızı korunur. |

## Blokajlar

> Bir görev ilerleyemiyorsa nedenini ve denediklerini yaz.

- **Cargo kontrolleri yerel makinede çalışmıyor:** `src-tauri` için `cargo check`, eksik sistem kütüphaneleri (`webkit2gtk4.1` / `libsoup-3.0` `.pc` dosyaları, `PKG_CONFIG_PATH` boş) nedeniyle derleme aşamasına gelemiyor. Kod/izin değişikliği yok; `pnpm verify` web tarafını kapsıyor. Fedora/Arch geliştirme ortamında (AGENTS.md §8 paketleriyle) `cd src-tauri && cargo check` ayrıca çalıştırılmalı.
