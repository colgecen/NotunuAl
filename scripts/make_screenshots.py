#!/usr/bin/env python3
"""Regenerate the README screenshots from the real NotunuAl! UI.

The script builds the production frontend, serves it locally, seeds the real
IndexedDB store with deterministic demo notes, drives the actual React/TipTap
screens with Playwright, and wraps each capture in a macOS-style SVG frame.
"""

from __future__ import annotations

import base64
import html
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "docs" / "img"
PORT = 4399
WIDTH = 1400
HEIGHT = 980
TITLE_BAR = 44

NODE_SCRIPT = r"""
import { chromium } from 'playwright';

const out = process.env.NOTUNUAL_SHOT_DIR;
if (!out) throw new Error('NOTUNUAL_SHOT_DIR is not set');

const notes = [
  {
    id: 'demo-weekly',
    title: 'Weekly plan',
    bodyText:
      'Monday: review meeting notes and outline the presentation. Then a short status check with the team.',
    date: null,
  },
  {
    id: 'demo-books',
    title: 'Book list',
    bodyText:
      'Les Misérables, Crime and Punishment, The Dispossessed, The Left Hand of Darkness.',
    date: null,
  },
  {
    id: 'demo-groceries',
    title: 'Groceries',
    bodyText: 'Coffee, milk, eggs, olive oil, whole wheat flour.',
    date: null,
  },
  {
    id: 'demo-ideas',
    title: 'Ideas',
    bodyText: 'Quick capture window and a keyboard shortcut cheat sheet for the note app.',
    date: null,
  },
  {
    id: 'demo-product',
    title: 'Product meeting',
    bodyText: 'Roadmap, release dates and team ownership.',
    date: null,
  },
].map((note, index) => ({
  id: note.id,
  title: note.title,
  titleColor: null,
  titleFont: null,
  body: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: note.bodyText ? [{ type: 'text', text: note.bodyText }] : [],
      },
    ],
  },
  bodyText: note.bodyText,
  date: note.date,
  createdAt: 100 - index,
  updatedAt: 100 - index,
}));

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1400, height: 980 },
  deviceScaleFactor: 1,
  locale: 'tr-TR',
  timezoneId: 'Europe/Istanbul',
  colorScheme: 'light',
  reducedMotion: 'reduce',
});
const page = await context.newPage();
await page.goto('http://127.0.0.1:4399/?lang=en');

await page.evaluate(async (rows) => {
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open('notunual');
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('notes')) {
        const store = database.createObjectStore('notes', { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt');
        store.createIndex('createdAt', 'createdAt');
        store.createIndex('title', 'title');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  await new Promise((resolve, reject) => {
    const tx = db.transaction('notes', 'readwrite');
    for (const row of rows) tx.objectStore('notes').put(row);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}, notes);

await page.reload();
await page.getByRole('button', { name: 'Open Weekly plan' }).waitFor();
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({
  path: `${out}/list.png`,
  animations: 'disabled',
  caret: 'hide',
});

await page.getByRole('button', { name: 'Open Weekly plan' }).click();
await page.getByRole('textbox', { name: 'Title', exact: true }).waitFor();
await page.keyboard.press('Control+k');
await page.waitForFunction(
  () => document.documentElement.getAttribute('data-theme') === 'dark',
);
await page.getByRole('textbox', { name: 'Title', exact: true }).evaluate((el) => el.blur());
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({
  path: `${out}/editor.png`,
  animations: 'disabled',
  caret: 'hide',
});

await browser.close();
"""


def run(command: list[str], *, check: bool = True, **kwargs) -> subprocess.CompletedProcess:
    print("+", " ".join(command))
    return subprocess.run(command, cwd=ROOT, check=check, **kwargs)


def wait_for_server(url: str, timeout: float = 30.0) -> None:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=1.0):
                return
        except (urllib.error.URLError, TimeoutError):
            time.sleep(0.25)
    raise RuntimeError(f"Preview server did not start: {url}")


def traffic_lights() -> str:
    return """
      <circle cx="30" cy="22" r="6" fill="#ff5f57"/>
      <circle cx="52" cy="22" r="6" fill="#febc2e"/>
      <circle cx="74" cy="22" r="6" fill="#28c840"/>"""


def wrap_svg(png: bytes, *, dark: bool) -> str:
    title_bar = "#2a2a2c" if dark else "#f3f3f6"
    title_color = "#d1d1d6" if dark else "#636368"
    border = "#3a3a3c" if dark else "#d2d2d7"
    image = base64.b64encode(png).decode("ascii")
    title = html.escape("NotunuAl!")
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT + TITLE_BAR}" viewBox="0 0 {WIDTH} {HEIGHT + TITLE_BAR}" role="img" aria-label="NotunuAl! macOS window">
  <defs>
    <clipPath id="window">
      <rect x="0" y="0" width="{WIDTH}" height="{HEIGHT + TITLE_BAR}" rx="12"/>
    </clipPath>
  </defs>
  <g clip-path="url(#window)">
    <rect width="{WIDTH}" height="{HEIGHT + TITLE_BAR}" fill="{title_bar}"/>
    <rect width="{WIDTH}" height="{TITLE_BAR}" fill="{title_bar}"/>
    <line x1="0" y1="{TITLE_BAR - 0.5}" x2="{WIDTH}" y2="{TITLE_BAR - 0.5}" stroke="{border}"/>
    {traffic_lights().strip()}
    <text x="{WIDTH // 2}" y="27" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="{title_color}">{title}</text>
    <image x="0" y="{TITLE_BAR}" width="{WIDTH}" height="{HEIGHT}" href="data:image/png;base64,{image}"/>
  </g>
  <rect x="0.5" y="0.5" width="{WIDTH - 1}" height="{HEIGHT + TITLE_BAR - 1}" rx="11.5" fill="none" stroke="{border}"/>
</svg>
"""


def main() -> int:
    if shutil.which("pnpm") is None:
        print("ERROR: pnpm is required.", file=sys.stderr)
        return 1
    if shutil.which("node") is None:
        print("ERROR: Node.js is required.", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    run(["pnpm", "build:web"])

    print("+ preview server on 127.0.0.1:%d" % PORT)
    log = tempfile.TemporaryFile(mode="w+")
    server = subprocess.Popen(
        [
            "pnpm",
            "exec",
            "vite",
            "preview",
            "--host",
            "127.0.0.1",
            "--port",
            str(PORT),
            "--strictPort",
        ],
        cwd=ROOT,
        stdout=log,
        stderr=subprocess.STDOUT,
    )

    shots = Path(tempfile.mkdtemp(prefix="notunual-shots-"))
    try:
        wait_for_server(f"http://127.0.0.1:{PORT}/")
        runner = ROOT / "scripts" / ".make_screenshots.tmp.mjs"
        runner.write_text(NODE_SCRIPT, encoding="utf-8")
        env = dict(os.environ, NOTUNUAL_SHOT_DIR=str(shots))
        try:
            run(["node", str(runner)], env=env)
        finally:
            runner.unlink(missing_ok=True)

        list_png = shots / "list.png"
        editor_png = shots / "editor.png"
        if not list_png.exists() or not editor_png.exists():
            raise RuntimeError("Playwright did not produce both screenshots.")

        (OUT_DIR / "app-list.svg").write_text(
            wrap_svg(list_png.read_bytes(), dark=False), encoding="utf-8"
        )
        (OUT_DIR / "app-editor.svg").write_text(
            wrap_svg(editor_png.read_bytes(), dark=True), encoding="utf-8"
        )
        print(f"Wrote {OUT_DIR / 'app-list.svg'}")
        print(f"Wrote {OUT_DIR / 'app-editor.svg'}")
        return 0
    except Exception as exc:  # noqa: BLE001 - CLI boundary
        log.seek(0)
        print(log.read(), file=sys.stderr)
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    finally:
        server.terminate()
        try:
            server.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server.kill()
        shutil.rmtree(shots, ignore_errors=True)
        log.close()


if __name__ == "__main__":
    raise SystemExit(main())
