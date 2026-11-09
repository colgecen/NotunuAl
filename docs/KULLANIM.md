# NotunuAl! — Kısa Kullanım Kılavuzu

NotunuAl! tamamen çevrimdışı çalışır. Notlar yalnızca bu cihazda saklanır;
hesap açmanız veya internete bağlanmanız gerekmez.

## İlk açılış

1. AppImage dosyasını çalıştırılabilir yapın ve açın:

   ```bash
   chmod +x NotunuAl!_*.AppImage
   ./NotunuAl!_*.AppImage
   ```

2. Sağ üstteki güneş/ay düğmesiyle temayı değiştirin. Seçim hatırlanır.

## Not oluşturma

1. Sol üstteki **`+ Yeni Ekle`** düğmesine basın veya `Ctrl+N` kullanın.
2. **Başlık** alanına notun adını yazın.
3. Açıklama alanına içeriği yazın. Biçim araç çubuğundan kalın, italik,
   renk, fosfor, yazı tipi ve boyut seçebilirsiniz.
4. Not, yazmayı bıraktıktan ~0,8 saniye sonra otomatik kaydedilir.
   İsterseniz **`Kaydet`** veya `Ctrl+S` ile hemen kaydedin.

## Arama ve gezinme

- `.` tuşuna basınca arama çubuğuna odaklanılır.
- Yazdıkça başlık ve açıklamada anlık arama yapılır; Türkçe karakterler
  ve `İ/ı` farkı doğru ele alınır.
- `↑` / `↓` ile sonuçlar arasında gezinin, `Enter` ile seçili notu açın.
- `Esc` aramayı temizler; editördeyken notu kaydedip listeye döner.

## Görünüm modu

Liste üstündeki düğmelerle üç görünüm arasında geçiş yapın:

- **Satır satır** — varsayılan, hızlı tarama için.
- **Simge simge** — kartlar hâlinde.
- **Uygulamanın ana hali** — geniş satırlar ve rahat okuma.

Seçim kalıcıdır.

## Dışa aktarma

**Farklı Kaydet** menüsünden biçim seçin:

| Biçim | Uzantı | Ne zaman kullanılır |
|---|---|---|
| Excel | `.xlsx` | Tablo/elektronik tablo |
| Word | `.docx` | Düzenlenebilir belge |
| PowerPoint | `.pptx` | Sunum |
| PDF | `.pdf` | Paylaşılabilir, salt okunur belge |
| Metin | `.txt` | Düz metin |

Masaüstü uygulamasında dosya konumu sorulur; web geliştirme modunda dosya
tarayıcıya indirilir.

## Silme

Listedeki **`Sil`** düğmesine basın ve onay penceresinde **`Sil`**'i seçin.
Silme işlemi geri alınamaz. `Esc` veya **`İptal`** ile vazgeçebilirsiniz.

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

## Verilerim nerede?

Notlar tarayıcı motorunun IndexedDB deposunda, tercihler `localStorage` içinde
tutulur. Uygulama hiçbir ağ isteği yapmaz. Notları yedeklemek için
**Farklı Kaydet** ile dışa aktarabilirsiniz.

## Sorun giderme

Wayland oturumunda bazı GPU/sürücülerde pencere boş görünürse, yalnızca geçici
bir çözüm olarak:

```bash
WEBKIT_DISABLE_DMABUF_RENDERER=1 ./NotunuAl!_*.AppImage
```

Bu ayarı sorun yaşamıyorsanız kullanmayın. Ayrıntılar için `README.md` dosyasına bakın.
