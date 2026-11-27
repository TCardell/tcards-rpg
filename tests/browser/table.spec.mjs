import { test, expect } from '@playwright/test';
const dirs = {
  farLeft: [-170, 0, 'on-right'],
  left: [-76, 0, 'on-right'],
  up: [0, -90, 'on-bottom'],
  right: [76, 0, 'on-left'],
  farRight: [170, 0, 'on-left'],
  down: [0, 90, 'on-top'],
};
const save = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('tcards.valbruma.local.v1')));
async function demo(page) {
  page.on('dialog', (d) => d.accept());
  await page.goto('/packages/swipe/sce/index.html');
  await page.locator('#examples').selectOption('six');
  await page.locator('#play').click();
}
async function local(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Jugar en solitario' }).click();
}
for (const original of [true, false]) {
  test(
    (original ? 'SCE original' : 'Valbruma') +
      ' · seis previsualizaciones, sello opuesto y cancelación',
    async ({ page }) => {
      if (original) await demo(page);
      else await local(page);
      const card = page.locator('.sce-card'),
        root = page.locator('.sce-player');
      await expect(root.locator('.sce-responses button')).toHaveCount(5);
      await expect(root.locator('.sce-foot [data-action=down]')).toBeVisible();
      const actual = await root
        .locator('.sce-responses button')
        .evaluateAll((bs) => bs.map((b) => b.dataset.action));
      expect(actual).toEqual(['farLeft', 'left', 'up', 'right', 'farRight']);
      for (const [slot, [dx, dy, side]] of Object.entries(dirs)) {
        await card.scrollIntoViewIfNeeded();
        const b = await card.boundingBox(),
          x = b.x + b.width / 2,
          y = b.y + b.height / 2;
        const before = await root.locator('.sce-response-banner').boundingBox();
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + dx, y + dy, { steps: 5 });
        await expect(root.locator('.gesture-active')).toHaveAttribute('data-action', slot);
        await expect(root.locator('.sce-stamp.visible')).toHaveClass(new RegExp(side));
        await expect(root.locator('.sce-response-banner')).toHaveClass(/selected/);
        expect((await root.locator('.sce-response-banner').boundingBox()).y).toBeCloseTo(
          before.y,
          0,
        );
        await card.dispatchEvent('pointercancel', { pointerId: 1, pointerType: 'mouse' });
        await page.mouse.up();
        await expect(root.locator('.gesture-active')).toHaveCount(0);
        await expect(root.locator('.sce-stamp.visible')).toHaveCount(0);
      }
      if (!original) expect((await save(page)).revision).toBe(0);
    },
  );
}
test('el lanzamiento conserva el feedback hasta confirmar y el teclado comparte acciones', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await local(page);
  const btn = page.locator('[data-id=visit_inn]');
  await btn.click();
  await expect(btn).toHaveClass(/gesture-active/);
  await expect(page.locator('.sce-stamp')).toHaveClass(/on-right/);
  await expect(page.getByRole('heading', { name: 'La Liebre de Cobre' })).toBeVisible();
  await page.locator('.scene').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-id=visit_chapel]')).toBeVisible();
  await page.keyboard.press('a');
  await expect(page.locator('.card-title')).toHaveText('Capilla del alba');
  expect((await save(page)).revision).toBe(3);
});
test('misión completa, mochila, mapas, tema y restauración por archivo', async ({ page }) => {
  await local(page);
  const initial = await save(page),
    instance = initial.cardInstanceId;
  for (const name of ['Mochila', 'Mapa', 'Ajustes'])
    await page.getByRole('navigation').getByRole('button', { name }).click();
  await page.getByRole('combobox', { name: 'Tema', exact: true }).selectOption('slate');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.sce-card')).toHaveAttribute('data-instance', instance);
  expect(await save(page)).toEqual(initial);
  await page.reload();
  await expect(page.locator('.sce-card')).toHaveAttribute('data-instance', instance);
  for (const id of [
    'visit_inn',
    'speak',
    'ask',
    'accept',
    'return',
    'follow_road',
    'investigate',
    'strike',
    'guard',
    'riposte',
    'assist',
    'take',
  ])
    await page.locator('[data-id=' + id + ']').click();
  await page.getByRole('navigation').getByRole('button', { name: 'Mochila' }).click();
  await page.getByRole('button', { name: 'Equipar hoja' }).click();
  await page.getByRole('button', { name: 'Beber tónico' }).click();
  for (const id of ['return', 'visit_inn', 'speak', 'report'])
    await page.locator('[data-id=' + id + ']').click();
  await expect
    .poll(async () => (await save(page)).state)
    .toMatchObject({ quest: 3, gold: 12, equipped: 1 });
  const won = await save(page);
  await page.getByRole('navigation').getByRole('button', { name: 'Ajustes' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar partida' }).click();
  const file = await (await download).path();
  await page.locator('[data-id=return]').click();
  page.once('dialog', (d) => d.accept());
  await page.getByLabel('Restaurar copia local').setInputFiles(file);
  await expect.poll(() => save(page)).toEqual(won);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('gesto táctil real del navegador y movimiento reducido', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await local(page);
  const card = page.locator('.sce-card');
  expect(await card.evaluate((c) => getComputedStyle(c).animationName)).toBe('none');
  const b = await card.boundingBox(),
    x = b.x + b.width / 2,
    y = b.y + b.height / 2;
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: x - 85, y }],
  });
  await expect(page.locator('.gesture-active')).toHaveAttribute('data-action', 'left');
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.locator('.card-title')).toHaveText('La Liebre de Cobre');
  await context.close();
});
