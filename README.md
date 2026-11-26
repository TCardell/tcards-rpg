# TCards RPG

> One world. Countless destinies.

An expandable, card-driven, open-world multiplayer RPG with persistent worlds, procedural adventures and a modular game engine.

**Estado:** v0.0.1 — cimientos del proyecto (pre-alfa). No es todavía un videojuego jugable ni hay un servidor desplegado.

## Visión
- Mundo abierto de fantasía con viajes, NPC, poblados, tabernas, hostales, comercios, iglesias, castillos y mazmorras.
- Seis gestos contextuales de cartas, con mochila, equipo, mapa y personaje en secciones separadas.
- Personajes persistentes; juego individual y mundos privados con amigos, expediciones cooperativas, competitivas y cooperativas con duelo final.
- Mundos independientes y jerárquicos, reloj real compartido con alternativas nocturnas, varios personajes por cuenta y clases flexibles.
- Personajes libres y hardcore (rescate, muerte permanente y lápidas), propiedades físicas personalizables, mochila por espacios y almacén.
- Progresión por experiencia, práctica, hitos, entrenamiento, misiones y objetos; no reparto de puntos en árboles de habilidades.
- Rutinas offline calculadas al regresar, trabajo AFK equilibrado, descanso, correspondencia y puntos de encuentro sociales.
- Loot accesible, monedas de oro, mochilas ampliables y almacenes domésticos de gran capacidad; escalado sutil en algunas mazmorras.
- Un único mundo inicial de fantasía medieval clásica con oscuridad y misterio, arquitectura preparada para más mundos con narrativa propia.
- TCards RPG Engine (reglas), Studio (contenido), Admin (operación) y Realms (mundos online).

## Documentación
- [GDD — informe maestro original](docs/GDD.md)
- [UI/UX — requisitos y diseño de interfaces](docs/UI_UX.md)
- [Cartas y decisiones — cuatro familias y transiciones](docs/CARDS.md)
- [Mundo y navegación](docs/WORLD.md) · [Tiempo real y horarios](docs/WORLD_EVENTS.md)
- [Personajes, clases y derrota](docs/CHARACTERS.md) · [Combate](docs/COMBAT.md)
- [Mochila y equipamiento](docs/INVENTORY.md) · [Propiedades y bases](docs/HOUSING.md) · [Mazmorras y dificultad](docs/DUNGEONS.md)
- [Progresión](docs/PROGRESSION.md) · [Rutinas y desconexión](docs/OFFLINE_ROUTINES.md) · [NPC](docs/NPC.md) · [Misiones](docs/QUESTS.md)
- [Loot y rarezas](docs/LOOT.md) · [Economía](docs/ECONOMY.md) · [Interacción social](docs/SOCIAL.md) · [Correspondencia](docs/MAIL.md)
- [Arquitectura](docs/ARCHITECTURE.md) · [Reglas](docs/GAME_RULES.md) · [Datos](docs/DATABASE.md)
- [Multijugador](docs/MULTIPLAYER.md) · [Administración](docs/ADMIN.md)
- [SCE y su integración](packages/swipe/README.md) · [Identidad](docs/BRAND.md)
- [Hoja de ruta](ROADMAP.md) · [Backlog](docs/BACKLOG.md) · [Instrucciones para agentes](AGENTS.md)
- [Primer encargo para Codex](docs/FIRST_TASK.md)

## Probar la base SCE
La copia original de SCE v0.2.0 está en `packages/swipe/sce/`, incluida su demo. Con Node.js 22+ (recomendación de desarrollo), ejecutar desde la raíz:
```sh
npm test
```
No hay dependencias que instalar para estas pruebas. Para probar la demo en navegador, abrir `packages/swipe/sce/index.html` o servir la raíz mediante `python -m http.server 8000` y navegar a esa ruta. No es una demo del RPG. El servidor HTTP local no es el backend multijugador.

## Infraestructura prevista
GitHub para código; Supabase para Auth, PostgreSQL, funciones y Realtime; Cloudflare Pages como candidato a alojamiento del cliente. El objetivo inicial es una alfa pequeña y gratuita, sujeto a cuotas y pruebas. Existe un proyecto de desarrollo Supabase llamado TCards RPG, cuyo estado activo y conexión de consulta se comprobaron el 26 de noviembre de 2026; no se ha integrado todavía en el código ni aplicado migraciones. Cloudflare no está configurado. Los secretos no se guardan en Git.

No se concede una licencia de código abierto en este repositorio por el mero hecho de ser público.
