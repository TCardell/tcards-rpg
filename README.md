# TCards RPG

> One world. Countless destinies.

An expandable, card-driven, open-world multiplayer RPG with persistent worlds, procedural adventures and a modular game engine.

**Estado:** v0.0.1 — cimientos del proyecto (pre-alfa). No es todavía un videojuego jugable ni hay un servidor desplegado.

## Visión
- Mundo abierto de fantasía con viajes, NPC, poblados, tabernas, hostales, comercios, iglesias, castillos y mazmorras.
- Seis gestos contextuales de cartas, con mochila, equipo, mapa y personaje en secciones separadas.
- Personajes persistentes; juego individual y mundos privados con amigos, expediciones cooperativas, competitivas y cooperativas con duelo final.
- Loot accesible, economía sencilla, generación procedural reproducible y expansiones compatibles.
- TCards RPG Engine (reglas), Studio (contenido), Admin (operación) y Realms (mundos online).

## Documentación
- [GDD — informe maestro original](docs/GDD.md)
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
GitHub para código; Supabase para Auth, PostgreSQL, funciones y Realtime; Cloudflare Pages como candidato a alojamiento del cliente. El objetivo inicial es una alfa pequeña y gratuita, sujeto a cuotas y pruebas. Ningún servicio está conectado todavía. Los secretos no se guardan en Git.

No se concede una licencia de código abierto en este repositorio por el mero hecho de ser público.
