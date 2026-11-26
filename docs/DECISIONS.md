# Registro de decisiones (ADR ligero)

| ID | Estado | Decisión |
|---|---|---|
| ADR-001 | Acordada | Repositorio independiente tcards-rpg, marca TCards RPG |
| ADR-002 | Acordada | SCE v0.2.0 como base gráfica y referencia principal de interacción, reutilización fiel y copia original intacta; motor RPG independiente |
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
| ADR-024 | Acordada en parte | Comercio entre jugadores y trabajo AFK aprobados después; profesiones completas, fabricación, clanes y propiedades colectivas siguen abiertos |
| ADR-025 | Acordada | Razas y clases clásicas de RPG, flexibilidad/híbridos; catálogo exacto por decidir; lápidas con estadísticas curiosas |
| ADR-026 | Acordada | Mochila ampliable comprando mochilas mayores; almacén de base crece hasta capacidades muy altas; carga portátil limitada |
| ADR-027 | Acordada | Rarezas clásicas y economía en monedas de oro; categoría único y probabilidades por decidir |
| ADR-028 | Acordada | Interacción social en mismo mundo/localización/grupo; encuentros mediante observar/buscar amigos en puntos físicos; viajes juntos o libres, intercambio, duelos consentidos y visitas |
| ADR-029 | Acordada | Progresión por experiencia, hitos, práctica, tareas, entrenamiento, misiones y objetos; no árbol por puntos a repartir |
| ADR-030 | Acordada | NPC con memoria/relación sencilla; variedad de misiones narrativas, contratos, investigación, procedurales, colectivas y secretas, sin historia principal obligatoria |
| ADR-031 | Acordada | Viaje ágil con animación breve y encuentros contextuales; evitar esperas largas obligatorias |
| ADR-032 | Acordada | Ausencia breve conserva ubicación y riesgo en zonas peligrosas; derrota offline menos penalizada; retorno automático a casa tras ausencia prolongada; tratamiento hardcore pendiente |
| ADR-033 | Acordada | Rutinas diarias configurables, cálculo retrospectivo al volver, trabajos AFK con menor rentabilidad que aventura y coste de energía; descanso recupera |
| ADR-034 | Acordada | Buzones y correspondencia persistente con jugadores y NPC |
| ADR-035 | Acordada | Un único mundo inicial; narrativa propia de cada mundo; fantasía medieval clásica con oscuridad y misterio; generación/configuración de nuevos mundos pendiente |
| ADR-036 | Propuesta | Tablones sociales, crónicas y récords, chats, editor de rutinas e informe de retorno, detalles de liquidación idempotente y límites AFK |
| ADR-037 | Acordada | Admin: web unificada y elegante para inspeccionar, gestionar, cambiar y restaurar juego; desarrollo incremental, acciones seguras y auditadas |
| ADR-038 | Propuesta | Studio: edición declarativa de contenido; JSON validado primero, UI y Asset Factory graduales |
| ADR-039 | Propuesta | Prólogo El viajero sin destino en Valbruma, tutorial narrativo opcional/saltable, región piloto pequeña; nombres y recompensas provisionales |
| ADR-040 | Acordada | Español único inicial en juego, Admin, Studio y documentación; inglés futuro posible sin i18n completo ni selector ahora |
| ADR-041 | Acordada | Fantasía medieval elegante, oscura, minimalista e inspirada en Regicide; cartas protagonistas, temas personalizables, presentación separada de reglas |
| ADR-042 | Propuesta | Arte IA reutilizable, hojas/lotes recortables cuando proceda, catálogo y placeholders primero, pipeline gradual sin proveedor obligatorio |
| ADR-043 | Acordada | SCE como inspiración gráfica principal y base real de adaptación: seis gestos, fila espacial, feedback exacto y sello opuesto; no motor de cuestionario como autoridad |

ADR-037 a ADR-043: 2026-11-26. Ver ADMIN, STUDIO, TUTORIAL, LANGUAGE, ART_DIRECTION, ASSET_PIPELINE, DESIGN_OVERVIEW, FIRST_TASK y packages/swipe/README. El GDD es histórico; ante discrepancia rige decisión posterior. Paletas, nombres, cifras, estilo final, herramientas y mecánicas concretas no cerradas.

ADR-025 a ADR-036: 2026-11-26. Ver PROGRESSION, OFFLINE_ROUTINES, NPC, QUESTS, LOOT, ECONOMY, SOCIAL, MAIL, CHARACTERS, INVENTORY, HOUSING y WORLD. No fijar números, fórmulas, penalizaciones hardcore offline ni catálogo de contenido sin diseño y pruebas.

ADR-016 a ADR-024: 2026-11-26. Ver WORLD.md, WORLD_EVENTS.md, CHARACTERS.md, COMBAT.md, INVENTORY.md, HOUSING.md y DUNGEONS.md para requisitos, alternativas, consecuencias y pruebas. Los números, fórmulas, lore y penalizaciones de ejemplo no son acuerdos.

ADR-013 a ADR-015: 2026-11-26. Detalles, alternativas, ejemplos y criterios de aceptación en [CARDS.md](CARDS.md). Probar revisita y elección de otra ruta, diálogo ramificado, varios turnos de un enemigo, recoger/dejar y persistencia sin regeneración.

ADR-009 a ADR-012: 2026-11-26. Requisitos, alternativas, consecuencias y criterios de aceptación en [UI_UX.md](UI_UX.md). Probar dos tamaños de viewport, navegación, gestos, persistencia de carta y ausencia de efectos no autorizados.

Para nueva decisión añade contexto, alternativas, consecuencias, prueba y fecha. No conviertas propuestas en acuerdos sin aprobación/justificación. El GDD original queda íntegro como referencia histórica.
