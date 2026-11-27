# Changelog

## 0.0.8 — Interfaz e inmersión
- Portada Tale Cards RPG, versión visible, fondos por lugar reutilizando arte existente (ajuste para desactivar), tema Brasas y cobre y pantalla completa cuando disponible.
- Menú móvil después de carta y decisiones; paneles diario, mochila, mapa y ajustes mejorados sin cambiar reglas ni acciones.
- Realms: sincronización de fondo silenciosa y estado discreto de última lectura; errores explícitos conservados.
- Registro: dirección de retorno explícita basada en la ruta pública de Vite; verificar correo real y allowlist de Auth.
- Comprobación PR con pruebas existentes, nuevas pruebas visuales/funcionales y build. Sin migraciones, cambios de dominio o baseline SCE. Nuevo teclado de dos pulsaciones pendiente.

## 0.0.7 · First Playable en rama de desarrollo

- Valbruma incorpora catorce situaciones, prólogo opcional, combate, consumible, equipo y oro. Guardado local versionado con exportación y restauración.
- Mesa móvil y de escritorio sobre SCE v0.2.0, nueve ilustraciones originales y dos temas.
- Realms integra Supabase Auth, invitaciones de un uso, revisión esperada, recibos, expediciones de dos cuentas y reconciliación de estado.
- Admin permite observar personajes y expediciones, consultar auditoría y compensar oro. Verificación local, remota y en Chromium documentada en PROGRESS.md.

## Unreleased — documentación de diseño (2026-11-26)
- Especificación UI/UX: portada, baraja y carta activa, interacción móvil, escritorio ampliado, paisajes contextuales, menú y persistencia.
- Especificación CARDS.md: cartas como situaciones dinámicas, cuatro familias acordadas, transiciones, ejemplos, contratos provisionales y criterios de aceptación.
- Lote de diseño: mundos independientes y jerárquicos, reloj real y alternativas nocturnas, múltiples personajes y clases flexibles, derrota/rescate/hardcore/cementerio, combate, mochila por espacios, propiedades físicas y escalado sutil de algunas mazmorras. Siete nuevos documentos de diseño; propuestas y preguntas abiertas identificadas.
- Lote de diseño: razas/clases clásicas, estadísticas de lápidas, expansión de mochila y base, rarezas y oro, interacción social y puntos de encuentro, progresión natural sin puntos, NPC/misiones, viaje rápido, ausencia y rutinas AFK retrospectivas, correspondencia y único mundo inicial con narrativa propia. Ocho nuevos documentos y referencias cruzadas actualizadas.
- Cierre conceptual: índice de diseño vigente, Admin transversal y restauración, Studio gradual, prólogo candidato, dirección visual elegante/minimalista y personalizable, español único inicial, producción artística reutilizable y SCE como base gráfica principal. Primer encargo y roadmap alineados; sin ampliar v0.0.2.
- Encargo maestro First Playable: objetivo integrado con hitos internos v0.0.2–v0.0.7, autonomía, criterios de terminado, continuidad, guía de conexión de Codex a Supabase dev y límites de coste/seguridad. Sin desarrollo ejecutado ni cambios remotos.
- Decisiones acordadas separadas de propuestas; instrucciones y primer encargo de Codex alineados.
- Registro del proyecto Supabase de desarrollo creado y acceso de consulta verificado. Sin integración, cambios de esquema, código de gameplay ni nueva versión publicada.

## 0.0.1 — Fundación (2026-11-26)
- Documentación de diseño y arquitectura inicial, instrucciones para agentes y roadmap.
- Estructura modular reservada para juego, Engine, Studio, Admin, generador y backend.
- Copia íntegra de SCE v0.2.0, demo, documentación y pruebas, fijada a un commit de origen.
- Scripts de prueba del baseline. Sin backend, autenticación, contenido RPG, despliegue ni multijugador implementados.

## Unreleased — alojamiento de desarrollo
- Preparación de GitHub Pages mediante Actions: compilación Vite de juego y Admin bajo /tcards-rpg/, ajuste de enlaces y arte dinámico, pruebas de reglas/SCE y guía de configuración pública de Supabase. Sin migraciones ni cambios de reglas. Publicación pendiente de activar Pages y verificar CI.
