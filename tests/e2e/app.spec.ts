import { expect, test, type Page } from '@playwright/test';

async function openApp(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: '+ Yeni Ekle' }).first().waitFor();
}

async function createNote(page: Page, title: string) {
  await page.getByRole('button', { name: '+ Yeni Ekle' }).first().click();
  await page.getByRole('textbox', { name: 'Başlık', exact: true }).fill(title);
  await page.getByRole('button', { name: 'Geri' }).click();
  await expect(page.getByRole('button', { name: '+ Yeni Ekle' })).toBeVisible();
}

test('keyboard flow: "." focuses search, arrows navigate, Enter opens, save persists', async ({
  page,
}) => {
  await openApp(page);
  await createNote(page, 'Elma');
  await createNote(page, 'Armut');
  await createNote(page, 'Kiraz');

  await page.keyboard.press('.');
  await expect(page.getByRole('textbox', { name: 'Ara...' })).toBeFocused();

  await page.keyboard.type('kiraz');
  await expect(page.locator('[role="option"]')).toHaveCount(1);

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  const titleInput = page.getByRole('textbox', { name: 'Başlık', exact: true });
  await expect(titleInput).toBeVisible();
  await titleInput.fill('Kiraz güncellendi');
  await page.keyboard.press('Control+s');
  await expect(page.getByText('Kaydedildi')).toBeVisible();
  await page.keyboard.press('Escape');

  await page.getByRole('textbox', { name: 'Ara...' }).fill('güncellendi');
  await expect(page.getByText('Kiraz güncellendi')).toBeVisible();
});

test('Ctrl+N opens a new note from the list', async ({ page }) => {
  await openApp(page);
  await page.keyboard.press('Control+n');
  await expect(page.getByRole('textbox', { name: 'Başlık', exact: true })).toBeVisible();
});

test('Ctrl+K toggles theme and it persists across reload', async ({ page }) => {
  await openApp(page);
  const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await page.keyboard.press('Control+k');
  await expect
    .poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme')))
    .not.toBe(before);
  await page.reload();
  await page.getByRole('button', { name: '+ Yeni Ekle' }).first().waitFor();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme')))
    .not.toBe(before);
});

test('view mode selection persists across reload', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Simge simge' }).click();
  await expect(page.getByRole('button', { name: 'Simge simge' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.reload();
  await page.getByRole('button', { name: '+ Yeni Ekle' }).first().waitFor();
  await expect(page.getByRole('button', { name: 'Simge simge' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});
