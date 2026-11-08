# SPEC.md — NotunuAl! Ürün Gereksinimleri

Uygulama adı: **NotunuAl!** (ünlem dahil, pencere başlığında ve üst çubukta aynen yazılır)

## 1. Genel

- Not defteri hissinde, hafif ve hızlı bir not alma uygulaması.
- İki tema: **açık** ve **koyu**.
- Notlar **cihazda** saklanır (çevrimdışı, hesapsız).
- Platform: Fedora / Arch Linux, Wayland, AppImage.

## 2. Ana ekran

### 2.1 Üst çubuk
Soldan sağa:
1. **`+ Yeni Ekle`** butonu (sol üst)
2. **Arama çubuğu** (en üstte, geniş)
3. **Tema anahtarı** (sağ üst, toggle şeklinde; güneş/ay simgesi)

### 2.2 Arama
- Uygulamada **`.` (nokta) tuşuna** basınca arama çubuğuna odaklanılır.
  - Kullanıcı zaten bir metin alanında/editörde yazıyorsa nokta **normal karakter** olarak yazılır, odaklanma tetiklenmez.
- Arama başlık ve açıklamada, yazdıkça anlık çalışır (Türkçe karakter ve büyük/küçük harf duyarsız; `İ/ı` farkı doğru ele alınır).
- Sonuçlarda **en üstteki öğe otomatik seçili** gelir.
- **↑ / ↓** ile seçim değişir, seçili öğe görünür alanda kalır (scrollIntoView).
- **Enter** seçili notu **düzenleme ekranında** açar.
- **Esc**: arama kutusu doluysa temizler, boşsa odağı listeye bırakır.
- Arama boşken liste tüm notları gösterir; liste üzerinde de ↑/↓/Enter çalışır.

### 2.3 Not listesi
- Notlar **aşağı doğru** sıralanır (varsayılan: son güncellenen üstte).
- Listede **sadece başlık** görünür; başlık **kalın (bold)**.
- Başlığın **en sağında**, biraz boşluk bırakılarak, **küçük ve soluk renkli açıklama** (kısaltılmış, tek satır) yazar.
- Başlık rengi kullanıcının seçtiği renk ise listede de o renkte görünür.
- Liste boşsa: dostça bir boş durum mesajı + `+ Yeni Ekle` çağrısı.

### 2.4 Görünüm modu
Açıklama (not alanı) üstündeki ayar çubuğundan seçilir:
- **Satır satır** (liste) — varsayılan
- **Simge simge** (ızgara kartlar)
- **Uygulamanın ana hali** (yukarıdaki 2.3 tasarımı: başlık + sağda soluk açıklama)

Seçim **otomatik kaydedilir**, uygulama yeniden açılınca hatırlanır.

## 3. Tema

- Açık/koyu tema; **fare tıklamasıyla** veya **Ctrl+K** ile değişir.
- Seçim kalıcıdır. İlk açılışta sistem temasına (`prefers-color-scheme`) bakılır.
- Not defteri teması: açık temada kâğıt rengi / krem tonları, koyu temada koyu gri/lacivert tonları. Başlık altı çizgisi ve vurgu renkleri tema ile uyumlu.

## 4. Yeni not

- **Ctrl+N** veya sol üstteki **`+ Yeni Ekle`** ile açılır.
- Yeni not hemen düzenleme ekranında, imleç başlıkta olacak şekilde açılır.
- Boş bırakılan not (başlık ve açıklama boş) kaydedilmez, silinir.

## 5. Not düzenleme ekranı

### 5.1 Düzen (yukarıdan aşağı)
1. **Sol üst:** `Kaydet` ve `Farklı Kaydet` butonları (+ geri/Esc)
2. **Başlık alanı** — seçilen renkte yazılabilir
3. **Başlığın altında ayırıcı çizgi**
4. **Biçim araç çubuğu** (başlık ve açıklama için ayrı ya da bağlama duyarlı)
5. **Açıklama alanı** (ana metin) — arka plan tema rengi; metin biçimlendirilebilir
6. İsteğe bağlı **tarih** (kullanıcı eklemek isterse; "Tarih ekle" butonu, tarih seçici)

### 5.2 Biçimlendirme (hem başlık hem açıklama için)
- **Kalın**, **italik**
- **Yazı rengi** seçme (renk paleti + özel renk)
- **Fosforlu kalem** (vurgulama / highlight) — önemli yerleri işaretlemek için, renk seçilebilir
- **Yazı tipi** seçme — **5 resmî/yaygın yazı tipi:**
  1. Arial
  2. Times New Roman
  3. Georgia
  4. Courier New
  5. Verdana
- **Açıklama yazı boyutu** ayarlanabilir (örn. 12–32 px; `A-` / `A+` ve kaydırıcı). Seçim kalıcı hatırlanır.
- Başlık için ek olarak **başlık rengi** seçici.

### 5.3 Kaydet
- **`Kaydet`:** notu cihaza kaydeder (otomatik kayıt da vardır: yazmayı bıraktıktan ~1 sn sonra).
- Kaydedilmemiş değişiklik varsa görünür bir işaret ("●") bulunur; kaydedilince "Kaydedildi" bilgisi kısa süre görünür.
- **Ctrl+S** de kaydeder.

### 5.4 Farklı Kaydet
Sol üstteki `Farklı Kaydet` menüsü, notu dosya olarak dışa aktarır:
- **Excel** (`.xlsx`)
- **Word** (`.docx`)
- **PowerPoint** (`.pptx`)
- **PDF** (`.pdf`)
- **Metin belgesi** (`.txt`)

Kurallar:
- Yerel dosya iletişim kutusu açılır (varsayılan dosya adı = not başlığı, geçersiz karakterler temizlenir).
- Biçimlendirme (kalın, italik, renk, vurgu, yazı tipi, boyut) Word/PDF/PPTX'te **korunmaya çalışılır**. Excel ve TXT'te düz metin yazılır (Excel: A1 başlık, A2 açıklama, A3 tarih).
- Türkçe karakterler (ç, ğ, ı, İ, ö, ş, ü) **tüm biçimlerde** doğru görünmeli.

## 6. Kısayollar

| Kısayol | Eylem | Bağlam |
|---|---|---|
| `.` | Aramaya odaklan | Ana ekran, metin alanı dışında |
| `↑` / `↓` | Sonuçlarda gezin | Arama/liste |
| `Enter` | Seçili notu aç | Arama/liste |
| `Esc` | Aramayı temizle / geri dön | Genel |
| `Ctrl+K` | Tema değiştir | Her yerde |
| `Ctrl+N` | Yeni not | Her yerde |
| `Ctrl+S` | Kaydet | Düzenleme |

## 7. Veri ve saklama

- Notlar yerel veritabanında (IndexedDB) tutulur; hafif ve hızlıdır, binlerce not sorunsuz çalışır.
- Ayarlar (tema, görünüm modu, yazı tipi, yazı boyutu) kalıcıdır; kullanıcı **tekrar seçmek zorunda kalmaz**.
- Ağ erişimi yoktur; veri cihaz dışına çıkmaz.
- Not silme: onaylı silme (geri alınamaz uyarısı).

## 8. Performans ve kalite hedefleri

- Açılış < 1 sn (modern donanımda).
- 5.000 notta arama gecikmesi < 100 ms.
- Tüm akış **klavye ile** kullanılabilir.
- Yerel Wayland'de bulanıklık/boş pencere olmadan çalışır.
- Boyut: AppImage mümkün olduğunca küçük (hedef < 30 MB).

## 9. Kapsam dışı (şimdilik)

Bulut senkronizasyonu, hesap sistemi, paylaşım, etiketler/klasörler, resim ekleme, Windows/macOS paketleri.
