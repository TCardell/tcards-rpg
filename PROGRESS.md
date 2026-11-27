# First Playable · estado de continuidad

Rama `feature/first-playable`, desde `deeb4f3`. Corte jugable de Valbruma implementado y verificado en local y en Supabase de desarrollo. La rama incorpora la definición de `docs/FIRST_TASK.md`.

| Hito | Resultado comprobado |
|---|---|
| A · Mesa SCE | Motor original intacto. Mismo clasificador, gestos, disposición y feedback. Misión local, seis direcciones, ratón, teclado, touch emulado, cancelación, movimiento reducido, tema y paneles. |
| B · Realms | Registro con GoTrue local y acceso por contraseña en desarrollo remoto. Invitaciones de un uso, dos linajes y dos oficios provisionales, varios personajes por cuenta. Aislamiento entre cuentas. |
| C · Cooperación y recuperación | Dos cuentas completan el mismo encuentro por turnos. Una identidad ajena y el jugador fuera de turno reciben rechazo. Carrera y reintento conservan una sola transición. Tras recargar se recuperan carta, turno y equipo. |
| D · Aventura y Admin | Encargo opcional de Ivo y Mara, combate, hallazgo, equipo, consumible, oro y retorno. Observación, invitaciones y compensación con motivo, revisión, actor, estado anterior/posterior y recibo. |

## Comprobaciones del 26–27 de noviembre de 2026

- `npm test` pasó las dos suites originales SCE y las pruebas de paridad del catálogo, reglas, capacidad, rechazo y recuperación.
- `npm run build` pasó TypeScript estricto de dominio y produjo ambas entradas de Vite. Se compiló con y sin configuración de Realms.
- Cinco pruebas de Chromium pasaron sobre demo original y juego. Incluyen seis candidatos con sello y botón, cancelación, lanzamiento, teclas, dispositivo móvil emulado, exportar y restaurar un archivo, completar y cobrar la misión.
- `tests/realms.mjs` pasó contra PostgreSQL 17 + GoTrue + PostgREST locales y contra el proyecto de desarrollo remoto. Cuatro identidades ficticias verificaron autorización, paridad de cada transición, carrera, idempotencia, reconexión de Auth, señales sujetas a RLS y reparación exactamente una vez.
- La prueba online de Playwright pasó sobre el cliente compilado y el proyecto remoto. Dos contextos Chromium de jugadores y un tercero de operador completaron encuentro, recarga, compensación visible y rechazo del jugador en Admin. El navegador de Cloud usó un relé local de prueba con TLS verificado por la CA del entorno. La aplicación también reconcilia el snapshot al recuperar conexión y cada 12 segundos en primer plano.
- Ambas migraciones se ejecutaron desde cero en una base local aislada. Se hizo un dump lógico de la base ficticia y se restauró en otra base local vacía con `pg_restore --single-transaction --exit-on-error`. Coincidieron recuentos, huellas de los seis personajes y los 102 eventos y número de expediciones. Solo se restauró en ese destino de prueba.
- Supabase remoto autorizado únicamente en `ocnvfivxbnbypjfhpnlx`. Historial comprobado de nuevo el 27 de noviembre: `20261126203316_valbruma` y `20261126203325_valbruma_content`. Los nombres locales corresponden a los identificadores que asignó el servicio. No repetir migraciones. Roles administrativos de los ensayos remotos con caducidad.
- El CLI completo agotó espacio en el volumen local de Docker. Para el ensayo se levantaron los tres servicios por separado. Touch se probó por eventos del navegador; siguen pendientes dispositivos táctiles físicos y el recorrido de entrega de correo en un buzón real.

## Historial

- `198f2b2` · catálogo y motor TypeScript.
- `e11652f` · adaptador, ilustraciones y mesa SCE.
- `6dab59e` · cliente Realms, reglas transaccionales, cooperación, Admin y pruebas de API.
- Reanudación del 27 de noviembre · se recuperaron las salidas de los ensayos terminados durante la sesión anterior. El siguiente trabajo es cerrar las instrucciones de operación y abrir la PR integrada.
