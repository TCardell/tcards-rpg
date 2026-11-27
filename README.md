# TCards RPG

> Un mundo. Innumerables destinos.

RPG web de mundo abierto, multijugador opcional, cartas dinámicas, mundos persistentes y aventuras procedurales.

**Estado de esta rama** · First Playable de Valbruma (prealfa v0.0.7). Aventura en solitario, mundo privado para dos viajeros y consola de operación verificados.

## Jugar

Desde la raíz, con Node.js 22.12+ (probado con Node 24):

```sh
npm ci
npm run dev
```

Abre [el juego local](http://127.0.0.1:3000/) y elige **Jugar en solitario**. En la plaza, entra en la posada y conversa con Ivo. Puedes aplazar su encargo, recorrer el pueblo o seguir las huellas de Mara. En combate, una defensa prepara el contraataque. La mochila permite beber el tónico y equipar la hoja. Al regresar a la posada, cuenta a Ivo lo ocurrido para cobrar las ocho monedas.

Arrastra la carta, pulsa el botón de la decisión o enfoca la mesa y usa las flechas. **A** y **D** corresponden a los gestos horizontales intensos. El diario, la mochila, el mapa y el tema se consultan sin gastar turno. Ajustes permite exportar la partida local y restaurarla en otro navegador.

Para jugar juntos, configura Realms, entra con dos cuentas admitidas y sitúa ambos personajes en la plaza. En **Compañía**, uno prepara la expedición y comparte el código en privado. El otro lo canjea. Los jugadores alternan ataque y protección hasta resolver el encuentro, y pueden cerrar y recuperar su sesión durante el turno.

La consola está en [/apps/admin/](http://127.0.0.1:3000/apps/admin/). El propietario provisiona el primer operador por el UUID de una cuenta confirmada. La guía incluye conexión, invitaciones de mundo, verificación de permisos y recuperación. [Operación de Supabase y Admin](supabase/README.md)

## Visión a largo plazo
- Mundo abierto de fantasía con viajes, NPC, poblados, tabernas, hostales, comercios, iglesias, castillos y mazmorras.
- SCE v0.2.0 como base gráfica y referencia principal de interacción: seis gestos contextuales de cartas, con mochila, equipo, mapa y personaje en secciones separadas.
- Personajes persistentes; juego individual y mundos privados con amigos, expediciones cooperativas, competitivas y cooperativas con duelo final.
- Mundos independientes y jerárquicos, reloj real compartido con alternativas nocturnas, varios personajes por cuenta y clases flexibles.
- Personajes libres y hardcore (rescate, muerte permanente y lápidas), propiedades físicas personalizables, mochila por espacios y almacén.
- Progresión por experiencia, práctica, hitos, entrenamiento, misiones y objetos; no reparto de puntos en árboles de habilidades.
- Rutinas offline calculadas al regresar, trabajo AFK equilibrado, descanso, correspondencia y puntos de encuentro sociales.
- Loot accesible, monedas de oro, mochilas ampliables y almacenes domésticos de gran capacidad; escalado sutil en algunas mazmorras.
- Un único mundo inicial de fantasía medieval clásica con oscuridad y misterio, arquitectura preparada para más mundos con narrativa propia.
- Estética medieval elegante y minimalista inspirada en Regicide, temas personalizables y español único inicial.
- TCards RPG Engine (reglas), Studio (contenido), Admin (centro de control, reparación y restauración incremental) y Realms (mundos online).

## Documentación
- **[Diseño vigente — empezar aquí](docs/DESIGN_OVERVIEW.md)** · [Decisiones](docs/DECISIONS.md) · [GDD histórico](docs/GDD.md)
- [Dirección artística](docs/ART_DIRECTION.md) · [Idioma](docs/LANGUAGE.md) · [Ilustraciones](docs/ASSET_PIPELINE.md)
- [Tutorial y región inicial](docs/TUTORIAL.md) · [Studio](docs/STUDIO.md)
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
- **[Encargo maestro First Playable](docs/FIRST_TASK.md)** · [Preparar Codex y Supabase](docs/CODEX_SETUP.md) · [Registro de progreso](PROGRESS.md)

## Verificación y continuidad

```sh
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

La batería estándar de navegador cubre la demo SCE original y la aventura en solitario. Las pruebas online usan identidades ficticias separadas de las cuentas del equipo. Juego y Admin se generan en `dist/`. [Pruebas reproducibles](tests/README.md) · [Resultados y checkpoints](PROGRESS.md) · [Historial de cambios](CHANGELOG.md)

La copia de SCE v0.2.0 permanece en `packages/swipe/sce/`. Con el servidor local activo se puede comparar su demo en [/packages/swipe/sce/](http://127.0.0.1:3000/packages/swipe/sce/). El adaptador utiliza el gesto, el layout, el sello opuesto y la presentación del motor original. El estado RPG se confirma en el motor local o en la transacción del mundo. [Integración SCE](packages/swipe/README.md)

No se concede una licencia de código abierto en este repositorio por el mero hecho de ser público.
