# Verificar First Playable

Desde la raíz, instala con `npm ci`. `npm test` cubre la copia SCE original, el catálogo JSON y su copia SQL, el motor de aventura, el inventario y los rechazos. `npm run build` ejecuta el chequeo de tipos del dominio y compila las dos aplicaciones.

## Navegador

Ejecuta `npx playwright install chromium` y después `npm run test:browser`. Playwright arranca el servidor del proyecto o reutiliza el del puerto 3000. Para usar un navegador instalado en el sistema, asigna su ruta a `CHROMIUM_EXECUTABLE_PATH`. Los escenarios comparan la mesa con SCE, ejercitan puntero y touch emulado, teclado, movimiento reducido, cambios de viewport, tema, mochila y recuperación por archivo.

## Integración con una instancia local

Sobre una instalación Supabase local de prueba con registro de correo activo y confirmación automática local, configura `TEST_SUPABASE_URL` (por defecto `http://127.0.0.1:54321`) y `TEST_SUPABASE_KEY` (clave pública). Ejecuta:

```sh
npm run test:realms
```

El script registra cuatro cuentas ficticias exclusivas del ensayo y provisiona en Docker un observador y un operador locales. El contenedor esperado es `supabase_db_tcards-rpg`; se puede indicar otro con `TEST_DB_CONTAINER`. Verifica invitación única, acceso ajeno, autorización de Admin, paridad de la misión paso a paso, carrera de revisiones, reintento, turnos, reconexión, RLS y compensación auditada.

## Verificación contra desarrollo alojado

Usa únicamente un destino autorizado. Prepara cuatro cuentas ficticias confirmadas. Asigna al operador y al observador sus respectivos roles en Valbruma, con caducidad para ensayos temporales. Guarda las credenciales en un archivo **privado fuera del repositorio**, con los campos raíz `operator`, `observer`, `first` y `second`. Cada campo contiene un objeto con `email` y `password`. Indica la ruta en `TCARDS_TEST_FIXTURES`; la prueba inicia sesión con esas cuentas y conserva sus datos de ensayo.

Con `TEST_SUPABASE_URL` y `TEST_SUPABASE_KEY` del mismo proyecto, ejecuta `npm run test:realms`. Se canjean invitaciones para los dos jugadores si aún las necesitan. Para ejercitar el cliente, configura las variables Vite del mismo proyecto, arranca el juego y ejecuta `npm run test:browser -- realms.spec.mjs` con el mismo archivo privado. Usando `TCARDS_TEST_ORIGIN` se puede apuntar a una compilación servida para el ensayo. La prueba abre dos sesiones de jugador y una de operador, recarga el encuentro y comprueba la reparación desde la pantalla del jugador. Los resultados del primer ensayo están en [PROGRESS.md](../PROGRESS.md).

Con el servidor Vite conectado a la misma base local que `TEST_SUPABASE_URL`, define también `TEST_SUPABASE_KEY` y `TEST_DB_CONTAINER` y ejecuta `npm run test:browser -- onboarding.spec.mjs`. Este ensayo registra cuentas nuevas y verifica en pantalla el alta, la emisión y el canje de la invitación, la creación del personaje y la recuperación de un error temporal de lectura de Admin.
