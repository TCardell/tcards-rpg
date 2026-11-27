import { execFileSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import { expect, test } from '@playwright/test';

const url = process.env.TEST_SUPABASE_URL;
test.skip(
  !url ||
    !['localhost', '127.0.0.1'].includes(new URL(url).hostname) ||
    !process.env.TEST_DB_CONTAINER ||
    !process.env.TEST_SUPABASE_KEY,
  'Requiere una instancia Supabase local de prueba con Docker.',
);

test('el operador emite una invitación y una cuenta nueva entra desde la portada', async ({
  browser,
  baseURL,
}) => {
  const credentials = () => ({
    email: 'valbruma-' + crypto.randomUUID() + '@example.test',
    password: crypto.randomUUID(),
  });
  const owner = credentials(),
    visitor = credentials();
  const client = createClient(url, process.env.TEST_SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.signUp(owner);
  expect(error).toBeNull();
  expect(data.user.id).toMatch(/^[a-f0-9-]{36}$/);
  execFileSync(
    'docker',
    [
      'exec',
      process.env.TEST_DB_CONTAINER,
      'psql',
      '-v',
      'ON_ERROR_STOP=1',
      '-U',
      'postgres',
      '-c',
      "insert into tcards.operators(actor,role,world) values ('" +
        data.user.id +
        "','operator','valbruma')",
    ],
    { stdio: 'ignore' },
  );

  const adminContext = await browser.newContext({ baseURL }),
    playerContext = await browser.newContext({ baseURL });
  try {
    const admin = await adminContext.newPage(),
      player = await playerContext.newPage();
    await admin.goto('/apps/admin/');
    await admin.getByLabel('Correo electrónico').fill(owner.email);
    await admin.getByLabel('Contraseña').fill(owner.password);
    await admin.getByRole('button', { name: 'Iniciar sesión' }).click();
    await admin.getByRole('button', { name: 'Emitir invitación de un uso' }).click();
    const code = await admin.getByLabel(/Invitación válida/).inputValue();

    await player.goto('/');
    await player.getByRole('button', { name: 'Entrar en Realms' }).click();
    await player.getByLabel('Correo electrónico').fill(visitor.email);
    await player.getByLabel('Contraseña').fill(visitor.password);
    await player.getByRole('button', { name: 'Crear cuenta' }).click();
    await player.getByLabel('Invitación al mundo').fill(code);
    await player.getByRole('button', { name: 'Canjear invitación' }).click();
    await player.getByLabel('Nombre del personaje').fill('Mara del alba');
    await player.getByRole('button', { name: 'Crear personaje libre' }).click();
    await expect(player.locator('.card-title')).toHaveText('Plaza de las campanas');
    await admin.getByRole('button', { name: 'Actualizar' }).click();
    await expect(admin.getByText(/Mara del alba · 4 oro/).last()).toBeVisible();

    await admin.route('**/rest/v1/rpc/tcards', (route) =>
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Temporalmente indisponible' }),
      }),
    );
    await admin.getByRole('button', { name: 'Actualizar' }).click();
    await expect(admin.getByText(/No se pudo consultar el mundo/)).toBeVisible();
    await admin.unroute('**/rest/v1/rpc/tcards');
    await admin.getByRole('button', { name: 'Actualizar' }).click();
    await expect(admin.getByRole('heading', { name: 'Operaciones' })).toBeVisible();
  } finally {
    await adminContext.close();
    await playerContext.close();
  }
});
