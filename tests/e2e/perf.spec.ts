import { expect, test } from '@playwright/test';

async function seedNotes(page: import('@playwright/test').Page, count: number) {
  await page.evaluate(async (total) => {
    const rows = Array.from({ length: total }, (_, i) => ({
      id: `perf-${i}`,
      title: i % 100 === 0 ? `Performans notu ${i} İstanbul` : `Performans notu ${i} Ankara`,
      titleColor: null,
      titleFont: null,
      body: { type: 'doc', content: [{ type: 'paragraph' }] },
      bodyText: `içerik ${i} uzun açıklama toplantı notları`,
      date: null,
      createdAt: total - i,
      updatedAt: total - i,
    }));
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('notunual');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('notes', 'readwrite');
        for (const row of rows) tx.objectStore('notes').put(row);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
    });
  }, count);
}

test('search responds under 100 ms with 5000 notes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+ Yeni Ekle' }).first().waitFor();
  await seedNotes(page, 5000);
  await page.reload();
  const searchInput = page.getByRole('textbox', { name: 'Ara...' });
  await searchInput.waitFor();
  // Notların yüklenip ilk listeyi çizmesini bekle.
  await page.locator('[role="option"]').first().waitFor();
  await page.waitForTimeout(300);

  const elapsed = await page.evaluate(async () => {
    const input = document.querySelector<HTMLInputElement>('input[aria-label="Ara..."]');
    if (!input) throw new Error('search input yok');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    if (!setter) throw new Error('value setter yok');

    const started = performance.now();
    setter.call(input, 'istanbul');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise<void>((resolve) => {
      const check = () => {
        const first = document.querySelector('[role="option"]');
        if (first && first.textContent?.includes('İstanbul')) {
          resolve();
          return;
        }
        requestAnimationFrame(check);
      };
      check();
    });
    return performance.now() - started;
  });

  await expect(searchInput).toHaveValue('istanbul');
  await expect(page.locator('[role="option"]').first()).toContainText('İstanbul');
  expect(elapsed).toBeLessThan(100);
});
