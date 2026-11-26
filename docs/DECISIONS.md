# Registro de decisiones (ADR ligero)

| ID | Estado | Decisión |
|---|---|---|
| ADR-001 | Acordada | Repositorio independiente tcards-rpg, marca TCards RPG |
| ADR-002 | Acordada | SCE v0.2.0 como base de interacción, copia sin modificar original |
| ADR-003 | Acordada | Mundo abierto persistente, multijugador opcional, loot y mochila separada, expansiones |
| ADR-004 | Propuesta | TypeScript para reglas y contratos nuevos; JS original de SCE conservado |
| ADR-005 | Acordada en parte | Supabase como backend dev (proyecto TCards RPG creado); Cloudflare Pages aún propuesta; coste inicial 0 sujeto a cuotas |
| ADR-006 | Propuesta | Autoridad de servidor e idempotencia transaccional; Realtime como notificación |
| ADR-007 | Propuesta | Monorepo con límites claros; no añadir dependencias hasta corte vertical |
| ADR-008 | Propuesta | Reglas de turnos, formatos y contenido fijados por versión en instancias activas |
| ADR-009 | Acordada | Mobile-first y card-first: portada login/acceso a servidor, montón visual con carta central que se gira, gestos y botones inferiores |
| ADR-010 | Acordada | Menú con mochila, mapa y ajustes; consultar no consume ni regenera carta; conservar al recargar salvo cambio legítimo de servidor |
| ADR-011 | Acordada | PC mantiene carta central con paisaje contextual y permite manipular mochila/menú lateralmente; mismas reglas que móvil |
| ADR-012 | Propuesta | Paneles plegables, HUD mínimo, escenas versionadas con variantes ambientales y apartados adicionales; detalles sujetos a pruebas |
| ADR-013 | Acordada | Cartas representan situaciones del mundo dinámicas, dependientes de decisiones y contexto; no baraja predefinida universal |
| ADR-014 | Acordada | Cuatro familias base: localización con rutas, NPC con diálogo encadenado, enemigo con vida/ataque/defensa y combate por turnos, objeto encontrado con recoger/dejar |
| ADR-015 | Acordada en parte | Grafo jerárquico de localizaciones aprobado; grafo de diálogos, contextos de retorno, ofertas de loot, actionId semántico y tipos complementarios aún propuestos |
| ADR-016 | Acordada | Servidores como mundos independientes con nombres/características y contenido parcialmente reutilizable; jerarquía de continentes, regiones, ciudades, calles, edificios y habitaciones conectadas |
| ADR-017 | Acordada | Reloj real compartido por mundo; horarios no restrictivos y alternativas de servicios/NPC nocturnos |
| ADR-018 | Acordada | Varios personajes por cuenta, nombre de usuario distinto de personaje, clases flexibles/genéricas/híbridas y estadísticas simples |
| ADR-019 | Acordada | Rescate por compañeros; libre reaparece en base con penalización por definir; hardcore de creación rápida, muerte permanente y lápida física; libre puede participar en expediciones rápidas |
| ADR-020 | Acordada en parte | Combate por turnos e inspiración en Regicide y cooperación; acciones exactas, sistema anticipativo PvE y resolución PvP por decidir |
| ADR-021 | Acordada | Mochila limitada por espacios, sin peso ni desgaste inicialmente |
| ADR-022 | Acordada | Bases personales comprables o creables, personalizables, físicas y visitables, con almacenamiento |
| ADR-023 | Acordada | Ajuste sutil de dificultad según participantes en algunas mazmorras/bosses; evitar escalado universal o marcado |
| ADR-024 | Abierta | Profesiones, fabricación, comercio entre jugadores, clanes y propiedades colectivas: propuestas sin decisión |

ADR-016 a ADR-024: 2026-11-26. Ver WORLD.md, WORLD_EVENTS.md, CHARACTERS.md, COMBAT.md, INVENTORY.md, HOUSING.md y DUNGEONS.md para requisitos, alternativas, consecuencias y pruebas. Los números, fórmulas, lore y penalizaciones de ejemplo no son acuerdos.

ADR-013 a ADR-015: 2026-11-26. Detalles, alternativas, ejemplos y criterios de aceptación en [CARDS.md](CARDS.md). Probar revisita y elección de otra ruta, diálogo ramificado, varios turnos de un enemigo, recoger/dejar y persistencia sin regeneración.

ADR-009 a ADR-012: 2026-11-26. Requisitos, alternativas, consecuencias y criterios de aceptación en [UI_UX.md](UI_UX.md). Probar dos tamaños de viewport, navegación, gestos, persistencia de carta y ausencia de efectos no autorizados.

Para nueva decisión añade contexto, alternativas, consecuencias, prueba y fecha. No conviertas propuestas en acuerdos sin aprobación/justificación. El GDD original queda íntegro como referencia histórica.
