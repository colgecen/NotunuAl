use tauri::Manager;

#[cfg(target_os = "linux")]
fn desktop_exec(path: &std::path::Path) -> String {
  let raw = path.to_string_lossy();
  let escaped = raw
    .replace('\\', "\\\\")
    .replace('"', "\\\"")
    .replace('`', "\\`")
    .replace('$', "\\$")
    .replace('%', "%%");
  format!("\"{escaped}\"")
}

/// Register an AppImage in the user's application menu on first launch.
///
/// AppImages are not scanned by desktop environments, so the bundled
/// `.desktop` file would otherwise stay invisible. Source runs are registered
/// by the `notunual` launcher instead, which keeps the entry pointed at the
/// repository and avoids writing dev-build paths to the menu.
#[cfg(target_os = "linux")]
fn register_appimage_desktop_entry() {
  use std::fs;
  use std::path::PathBuf;
  use std::process::Command;

  let Ok(home) = std::env::var("HOME") else {
    return;
  };
  let Ok(appimage) = std::env::var("APPIMAGE") else {
    return;
  };
  let appimage = PathBuf::from(appimage);
  if !appimage.is_file() {
    return;
  }

  let data = std::path::Path::new(&home).join(".local/share");
  let apps = data.join("applications");
  let icons = data.join("icons/hicolor/512x512/apps");
  let icon_root = data.join("icons/hicolor");
  if fs::create_dir_all(&apps).is_err() || fs::create_dir_all(&icons).is_err() {
    return;
  }

  let _ = fs::write(icons.join("notunual.png"), include_bytes!("../icons/icon.png"));

  let entry = format!(
    "# notunual-desktop\n\
     [Desktop Entry]\n\
     Type=Application\n\
     Name=NotunuAl!\n\
     Comment=Fast, keyboard-first, offline note-taking app\n\
     Exec={}\n\
     Icon=notunual\n\
     Terminal=false\n\
     Categories=Utility;Office;\n\
     StartupWMClass=NotunuAl!\n",
    desktop_exec(&appimage)
  );
  let desktop_path = apps.join("notunual.desktop");
  let ours = fs::read_to_string(&desktop_path)
    .map(|content| content.contains("# notunual-desktop"))
    .unwrap_or(true);
  if ours {
    let _ = fs::write(&desktop_path, entry);
  }

  let _ = Command::new("update-desktop-database").arg(&apps).status();
  let _ = Command::new("gtk-update-icon-cache")
    .arg("-f")
    .arg("-t")
    .arg(&icon_root)
    .status();
  let _ = Command::new("kbuildsycoca6")
    .arg("--noincremental")
    .status();
  let _ = Command::new("kbuildsycoca5")
    .arg("--noincremental")
    .status();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .setup(|app| {
      #[cfg(target_os = "linux")]
      register_appimage_desktop_entry();

      if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_title("NotunuAl!");
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
