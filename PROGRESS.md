# First Playable — registro de continuidad

Estado inicial (2026-11-26): encargo preparado; desarrollo no iniciado. Este archivo lo actualiza Codex durante su trabajo. No es prueba de implementación ni de conexión.

## Objetivo
docs/FIRST_TASK.md. Leer AGENTS.md y docs/CODEX_SETUP.md.

## Hitos
- [ ] A: SCE adaptado y prototipo local (v0.0.2).
- [ ] B: Auth, personaje, mundo y persistencia (v0.0.3).
- [ ] C: cooperación, recuperación y Admin lectura (v0.0.4–0.0.5).
- [ ] D: aventura, inventario, oro y reparación Admin (v0.0.6–0.0.7).

## Checkpoint
Rama/commit: pendiente.
Entorno y conexión Supabase: no verificados desde Codex.
Último avance probado: ninguno.
Migraciones aplicadas: verificar antes de cambiar.
Pruebas realizadas/resultados: ninguna en este encargo.
Bloqueos: acceso y entorno aún por comprobar.
Siguiente acción: leer documentación, inspeccionar repo y demo SCE, establecer plan interno y empezar hito A.

## Registro
Añadir por checkpoint: fecha, cambios, commit/rama, decisiones provisionales, pruebas exactas y resultados, migraciones (local/remoto y ref), riesgos, bloqueo/acción requerida, siguiente paso concreto. Nunca guardar secretos, correos reales ni datos de prueba privados.

### 26 de noviembre · rama feature/first-playable
Base deeb4f3. npm test pasó en la copia original. Demo SCE ejecutada en Chromium por HTTP. Se verificó la referencia Supabase y el esquema público vacío; el propietario autorizó escritura aditiva y datos ficticios solo en ese proyecto. En curso región declarativa, reglas TypeScript y shell SCE. Pendiente comprobar navegador, SQL y Admin.

Adaptador independiente con gestures.bind, responseLayout y Player.preview originales; presentación con nueve ilustraciones SVG propias. Migraciones locales preparadas para membresías, personajes, expediciones, recibos, señales y compensación. Aún sin aplicar en remoto. Autorización recibida en este chat el 26 de noviembre.
