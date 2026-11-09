# Değişiklik Günlüğü

Bu proje [Keep a Changelog](https://keepachangelog.com/tr/1.1.0/) biçimini izler ve
[Anlamsal Sürümleme](https://semver.org/lang/tr/) kullanır.

## [0.1.0] - 2026-11-09

İlk sürüm.

### Eklendi

- Klavye odaklı not listesi: kalın başlık, sağda soluk tek satır açıklama.
- Üç görünüm modu: satır satır, simge simge, uygulamanın ana hali.
- Açık/koyu tema; sistem temasıyla başlar ve seçim hatırlanır.
- Zengin metin düzenleyici: kalın, italik, yazı rengi, fosforlu kalem,
  5 resmî yazı tipi (Arial, Times New Roman, Georgia, Courier New, Verdana),
  12–32 px açıklama yazı boyutu.
- Başlık rengi ve başlık yazı tipi seçimi.
- Otomatik kayıt (~0,8 sn) ve `Ctrl+S`; kaydedilmemiş değişiklik göstergesi.
- İsteğe bağlı tarih alanı.
- Beş biçimde dışa aktarma: `.xlsx`, `.docx`, `.pptx`, `.pdf`, `.txt`.
- Türkçe karakterlere ve büyük/küçük harfe duyarlı anlık arama;
  5.000 notta 100 ms altı yanıt.
- Klavye kısayolları: `.`, `↑`/`↓`, `Enter`, `Esc`, `Ctrl+N`, `Ctrl+K`, `Ctrl+S`.
- Tamamen çevrimdışı çalışma: notlar cihazda (IndexedDB), ağ isteği ve telemetri yok.
- Erişilebilirlik: görünür odak halkası, `aria-*` etiketleri, `aria-live` sonuç sayısı,
  `alertdialog` silme onayı, `prefers-reduced-motion`, iki temada AA kontrast.
- Tauri v2 + React + TypeScript + Vite; Fedora/Arch Linux Wayland için AppImage paketleme.
- GitHub Actions CI: doğrulama, uçtan uca testler ve Ubuntu 22.04 tabanlı AppImage derleme.

[0.1.0]: https://github.com/colgecen/NotunuAl/releases/tag/v0.1.0
