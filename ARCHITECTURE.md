# ARCHITECTURE.md — NotunuAl!

## 1. Teknoloji yığını ve gerekçeler

| Katman | Seçim | Neden |
|---|---|---|
| Masaüstü kabuğu | **Tauri v2** | Hafif (Electron'dan çok küçük), AppImage üretir, Linux/Wayland'de WebKitGTK kullanır |
| Arayüz | **React 18 + TypeScript (strict)** | Olgun ekosistem, TipTap ile uyumlu |
| Derleme | **Vite** | Hızlı geliştirme, basit yapılandırma |
| Stil | **Tailwind CSS** + CSS değişkenleri | Tema (açık/koyu) değişkenlerle |
| Durum | **Zustand** | Küçük, boilerplate'siz |
| Zengin metin | **TipTap** (ProseMirror) | Kalın, italik, renk, highlight, yazı tipi, boyut |
| Veritabanı | **Dexie.js** (IndexedDB) | Hafif, cihazda, hızlı |
| Arama | **Fuse.js** | Anlık bulanık arama |
| Dışa aktarma | `docx`, `xlsx` (SheetJS), `pptxgenjs`, `jspdf` | Tarayıcıda çalışır, sunucu gerekmez |
| Yerel dosya | `@tauri-apps/plugin-dialog` + `plugin-fs` | Native "Farklı Kaydet" penceresi |
| Test | **Vitest**, Testing Library, `fake-indexeddb`, **Playwright** | Birim → bileşen → uçtan uca |
| Lint/format | ESLint + Prettier | Tutarlı kod |
| Paket yöneticisi | **pnpm** | Hızlı, disk dostu |

> Yeni bağımlılık eklenirse bu tabloya satır eklenir.

## 2. Üst düzey mimari

```
┌──────────────────────── Tauri penceresi (WebKitGTK) ────────────────────────┐
│                                                                              │
│  UI (React)            Durum (Zustand)           Servisler                   │
│  ───────────           ───────────────           ─────────                   │
│  TopBar                notesStore                noteRepo  ── Dexie/IndexedDB│
│  SearchBar     ◄────►  settingsStore    ◄──────► settingsService ─ localStorage
│  NoteList/Grid         uiStore (seçim,           searchService ── Fuse.js    │
│  NoteEditor            odak, ekran)              exportService ── docx/xlsx/ │
│  Toolbar                                                         pptx/pdf/txt│
│                                                  fileService  ── Tauri dialog│
│  Shortcuts (registry) ───► eylemleri tetikler                  + fs          │
└──────────────────────────────────────────────────────────────────────────────┘
        Rust tarafı (src-tauri): pencere, eklentiler, izinler (minimum)
```

**Prensipler**
1. **UI saf:** bileşenler DB/dosya/Tauri'yi doğrudan çağırmaz; `services/` üzerinden gider.
2. **Tek yönlü akış:** UI → eylem → store → servis → store → UI.
3. **Kısayollar merkezi:** tek kayıt defteri, bağlama (context) duyarlı.
4. **Dışa aktarma ortak model üzerinden:** her format aynı ara modeli tüketir (bkz. §6).
5. **Çevrimdışı ve gizli:** hiçbir ağ çağrısı yok; CSP bunu zorlar.

## 3. Dizin yapısı

```
notunual/
├─ AGENTS.md  SPEC.md  ARCHITECTURE.md  TASKS.md  README.md
├─ package.json  pnpm-lock.yaml  vite.config.ts  tsconfig.json
├─ tailwind.config.ts  eslint.config.js  .prettierrc
├─ src/
│  ├─ main.tsx  App.tsx
│  ├─ i18n/tr.ts                  # tüm UI metinleri
│  ├─ theme/                      # CSS değişkenleri, tema uygulayıcı
│  ├─ shortcuts/
│  │   ├─ registry.ts             # kısayol tanımları
│  │   └─ useShortcuts.ts         # global dinleyici
│  ├─ store/                      # notesStore, settingsStore, uiStore
│  ├─ services/
│  │   ├─ db.ts                   # Dexie şeması
│  │   ├─ noteRepo.ts             # CRUD
│  │   ├─ settingsService.ts
│  │   ├─ searchService.ts
│  │   ├─ fileService.ts          # Tauri dialog/fs (web'de indirme yedeği)
│  │   └─ export/
│  │       ├─ model.ts            # TipTap JSON → ExportDoc
│  │       ├─ txt.ts  pdf.ts  docx.ts  xlsx.ts  pptx.ts
│  │       └─ fonts.ts            # gömülü TTF'ler
│  ├─ components/
│  │   ├─ TopBar/  SearchBar/  ThemeToggle/  NewNoteButton/
│  │   ├─ NoteList/  NoteRow.tsx  NoteGrid.tsx  ViewModeSwitch.tsx
│  │   └─ Editor/  NoteEditor.tsx  Toolbar.tsx  TitleField.tsx  ColorPicker.tsx
│  ├─ assets/fonts/               # yazı tipi dosyaları (OFL)
│  └─ types.ts
├─ tests/                         # e2e (Playwright)
├─ src-tauri/
│  ├─ tauri.conf.json  Cargo.toml  capabilities/default.json
│  ├─ icons/
│  └─ src/main.rs  lib.rs
└─ scripts/                       # build-appimage.sh, vb.
```

## 4. Veri modeli

```ts
// src/types.ts
export interface Note {
  id: string;               // uuid v4
  title: string;            // düz metin (listede kalın görünür)
  titleColor: string | null;// "#RRGGBB" veya null (tema rengi)
  titleFont: FontKey | null;
  body: JSONContent;        // TipTap JSON (kalın/italik/renk/highlight/yazı tipi/boyut)
  bodyText: string;         // düz metin kopyası (arama + liste açıklaması için)
  date: string | null;      // kullanıcı eklediyse ISO tarih (YYYY-MM-DD)
  createdAt: number;        // epoch ms
  updatedAt: number;        // epoch ms
}

export type FontKey = 'arial' | 'times' | 'georgia' | 'courier' | 'verdana';
export type ViewMode = 'rows' | 'icons' | 'home';
export type Theme = 'light' | 'dark';

export interface Settings {
  theme: Theme;
  viewMode: ViewMode;
  bodyFontSize: number;     // px
  bodyFont: FontKey;
}
```

**Dexie şeması:** `notes: 'id, updatedAt, createdAt, title'` (sürüm 1). Şema değişirse `version(n)` + migrasyon.

**Ayarlar:** küçük olduğu için `localStorage` anahtarı `notunual.settings.v1`. Okuma hatasında varsayılanlara dön.

## 5. Kritik davranışların tasarımı

### 5.1 Kısayol sistemi
- `registry.ts` her kısayolu `{ keys, when, run }` olarak tanımlar.
- Tek global `keydown` dinleyicisi (`useShortcuts`) kayıtları gezer.
- **`.` kuralı:** `event.target` bir `input`, `textarea` veya `contenteditable` ise **tetiklenmez**.
- `Ctrl+K`, `Ctrl+N`, `Ctrl+S` için `preventDefault()`; masaüstü WebView'de tarayıcı çakışması yok.
- Eylemler store üzerinden çalışır; bileşenler kısayol bilmez.

### 5.2 Arama + gezinme
- `searchService`: Fuse.js, anahtarlar `title` (ağırlık 2) ve `bodyText` (ağırlık 1); Türkçe için sorgu ve metin `toLocaleLowerCase('tr')` ile normalize edilir (+ aksan duyarsız).
- `uiStore.selectedIndex` varsayılan `0`; sorgu değişince `0`'a döner; ↑/↓ aralıkta kalır (döngü yok veya döngü: SPEC'e göre **kenarda durur**).
- Enter → `openNote(results[selectedIndex].id)`.

### 5.3 Otomatik kayıt
- Editörde değişiklikte **debounce ~800 ms** ile `noteRepo.upsert`.
- `dirty` bayrağı UI'da "●" gösterir; kaydedilince temizlenir.
- Ekrandan çıkarken (Esc / geri) bekleyen kayıt **flush** edilir.
- Boş not (başlık + gövde boş) çıkışta silinir.

### 5.4 Tema
- `<html data-theme="light|dark">`; renkler CSS değişkenleri (`--bg`, `--fg`, `--muted`, `--line`, `--accent`).
- Tailwind bu değişkenlere bağlanır. Tema değişimi anında, yanıp sönme olmadan (ilk boyamadan önce uygulanır).

### 5.5 Yazı tipleri
- Kullanıcıya görünen isimler: Arial, Times New Roman, Georgia, Courier New, Verdana.
- Linux'ta bu fontlar kurulu olmayabilir. Bu yüzden **metrik uyumlu açık lisanslı karşılıklar paketlenir** (`@font-face`, OFL lisanslı):
  - Arial → Liberation Sans
  - Times New Roman → Liberation Serif
  - Courier New → Liberation Mono
  - Verdana → DejaVu Sans
  - Georgia → Gelasio
- **Dışa aktarmada:** Word/PowerPoint'e **gerçek font adı** yazılır (Word'de doğru görünür); PDF'e paketlenmiş TTF gömülür.

## 6. Dışa aktarma hattı (Farklı Kaydet)

```
TipTap JSON ─► model.ts ─► ExportDoc ─► txt | pdf | docx | xlsx | pptx ─► Uint8Array ─► fileService.save()
```

```ts
interface ExportDoc {
  title: Run[];           // başlık parçaları
  titleColor: string | null;
  date: string | null;
  blocks: Block[];        // paragraflar, listeler
}
interface Run { text: string; bold?: boolean; italic?: boolean;
                color?: string; highlight?: string; font?: FontKey; size?: number }
```

- `model.ts` TipTap düğümlerini gezip `Run` listesine çevirir. **Tek yerde** test edilir; format yazıcıları bunu tüketir.
- **TXT:** başlık, boş satır, düz metin (+ tarih).
- **DOCX:** `docx` kütüphanesi; `TextRun` ile bold/italic/color/highlight/font/size.
- **PDF:** `jspdf`; gömülü TTF (Türkçe karakter için **şart**, standart PDF fontları ş/ğ/İ'yi göstermez); renk/kalınlık/italik destekler, sayfa taşmasını böler.
- **PPTX:** `pptxgenjs`; slayt 1: başlık (+ tarih); gövde slayta sığmazsa paragraf bazında ek slaytlara bölünür.
- **XLSX:** SheetJS; `A1` başlık, `A2` açıklama (düz metin), `A3` tarih; sütun genişliği ve satır kaydırma ayarlı.
- `fileService.save(bytes, defaultName, filters)`: Tauri'de native diyalog + `writeFile`; web (geliştirme) ortamında `Blob` indirme yedeği.
- Dosya adı temizleme: `/ \ : * ? " < > |` kaldırılır, boşsa `Adsiz-Not`.

## 7. Tauri / Rust tarafı

- Rust kodu **minimum**: pencere ayarı (başlık "NotunuAl!", min boyut), eklenti kayıtları (`dialog`, `fs`).
- **İzinler (capabilities):** yalnızca gereken: `dialog:default`, `fs:allow-write-file` (kullanıcının seçtiği yola). Geniş `fs` erişimi **verilmez**.
- **CSP:** `default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'none'` — ağ yok.
- Bundle hedefi: `appimage` (+ geliştirme için `deb`/`rpm` isteğe bağlı).

## 8. AppImage ve Wayland

- `tauri.conf.json` → `bundle.targets: ["appimage"]`.
- **Derleme ortamı:** CI'da `ubuntu-22.04` (eski glibc → Fedora/Arch'ta çalışır).
- Gerekirse `NO_STRIP=true` (Arch/linuxdeploy).
- Çalıştırma: yerel Wayland (zorla X11 yok). Boş pencere sorununda belgelenmiş geçici çözüm: `WEBKIT_DISABLE_DMABUF_RENDERER=1`.
- Veri yeri: WebView'in uygulama veri dizini (`~/.local/share/<bundle-id>/`). Kullanıcı verisi AppImage'in **dışında** olduğu için sürüm güncellemelerinde kaybolmaz.
- Bundle kimliği: `app.notunal.desktop` (değiştirilirse veri yolu da değişir; bu yüzden **erken sabitle**).
- Masaüstü girdisi + simge AppImage içine konur; ayrıca `README.md`'de `chmod +x` ve çalıştırma anlatılır.

## 9. Test stratejisi

| Katman | Araç | Örnek |
|---|---|---|
| Servis | Vitest + fake-indexeddb | CRUD, sıralama, ayar kalıcılığı |
| Arama | Vitest | Türkçe `İ/ı`, ağırlık, sıra |
| Dışa aktarma | Vitest | `model.ts` çıktısı, TXT içeriği, DOCX/XLSX/PPTX zip'i açılıp metin doğrulanır, PDF bayt başlığı ve boyutu |
| Bileşen | Testing Library | Liste satırı, tema anahtarı, kısayol davranışı |
| E2E | Playwright (web build) | `.` → arama, ↓ ↓ Enter → düzenle, Ctrl+N, Ctrl+K |
| Rust | `cargo test` | (az) yapılandırma doğrulama |

## 10. Önemli kararlar (ADR özeti)

| # | Karar | Gerekçe |
|---|---|---|
| 1 | Tauri (Electron değil) | Boyut/bellek, AppImage, Rust ekosistemi |
| 2 | IndexedDB + Dexie (SQLite değil) | Basitlik, ek Rust kodu gerekmez; bu ölçekte yeterli |
| 3 | TipTap JSON saklanır + düz metin kopyası | Biçim korunur, arama hızlı |
| 4 | Paketlenmiş açık fontlar | Linux'ta font tutarlılığı, PDF'te Türkçe |
| 5 | Ortak `ExportDoc` modeli | Beş format tek kaynaktan, test kolay |
| 6 | Kısayol kayıt defteri | Çakışma/bağlam yönetimi tek yerde |
| 7 | Ağ yok + sıkı CSP | Gizlilik ilkesi |
