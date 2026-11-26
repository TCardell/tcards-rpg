# Arquitectura — propuesta inicial

El GDD conserva el análisis completo. Este documento concreta el corte vertical, no describe software ya desplegado.

## Separación de capas
- apps/game: shell responsive, mapa/mochila/personaje/social y adaptador de cartas.
- packages/swipe: SCE v0.2.0 como base gráfica e interacción principal, adaptador de gestos, presentación y animaciones. No autoridad del juego.
- packages/engine: reducer/reglas puras deterministas, sin DOM/red/DB.
- packages/shared: tipos, contratos, validación de comandos y snapshots.
- packages/generator: PRNG con semilla, grafos alcanzables, encuentros y botín con versiones fijadas.
- content: definiciones versionadas de regiones, NPC, objetos, cartas, misiones y mazmorras.
- supabase: migraciones SQL, RLS, RPC transaccionales y Edge Functions cuando aporten valor.
- apps/studio y apps/admin: herramientas separadas de jugador; Studio declarativo gradual, Admin crece en paralelo a hitos online con inspección y reparación segura.
- assets: recursos con procedencia y licencia; no añadir datos personales.
- tests: pruebas cross-module y multijugador.

## Flujo online
Cliente lee snapshot autorizado (incluye pendingCardId/instancia, availableActions, revision). SCE emite intención. El cliente envía commandId, scope, expectedRevision, cardInstanceId y actionId; servidor infiere identidad de Auth. RPC/servicio comprueba membresía, turno, condiciones, coste e idempotencia, ejecuta reglas y guarda todos los cambios atómicamente. Devuelve resultado/revisión. Realtime notifica cambios; cliente reconcilia con snapshot. El cliente no confirma efectos antes de respuesta.

Para el primer corte vertical, una RPC PostgreSQL puede validar y aplicar acciones simples de forma atómica; evaluar TypeScript en Edge Functions para reglas complejas manteniendo el commit transaccional, sin dos autoridades divergentes. No desplegar una función a producción hasta tener pruebas de acceso, carrera y rollback.

## Herramientas previstas
Node/TypeScript, npm al principio; evaluar Vite cuando exista cliente real. No fijar framework innecesariamente ni crear paquetes ficticios. Supabase local o proyecto dev separado; Cloudflare Pages para frontend estático cuando sea necesario. Guardado offline en IndexedDB, adaptador local que implemente mismo contrato de comandos. Local y online no comparten economía.

## Versión y operación
Versionar schema, ruleset, content y generator. Una expedición activa fija las versiones con las que empezó. Mantener compatibilidad frontend/API durante despliegues; backup verificado antes de migrar; restauración probada. No hay jobs perpetuos: eventos calculados por fechas y tareas programadas cuando necesarias. Los límites gratuitos cambian; comprobar cuotas antes de desplegar.

Ver docs/MULTIPLAYER.md, docs/DATABASE.md y docs/ADMIN.md. Registrar elecciones definitivas en docs/DECISIONS.md.

## Interfaz adaptativa
Ver [UI_UX.md](UI_UX.md). Un único modelo de dominio y contrato de comandos alimenta los layouts móvil y escritorio. Mantener el estado UI (menús, arrastre, animación y preferencias) separado de snapshots confirmados. La carta activa es una instancia persistente, no una posición de un mazo del cliente. El paisaje contextual es una capa de presentación independiente de la ilustración puntual de la carta. Los paneles laterales consumen los mismos contratos de inventario/mapa que el menú móvil; no alteran reglas. Los detalles de vistas y manifiesto ambiental están por diseñar.

## Resolución de situaciones
Ver [CARDS.md](CARDS.md). El motor construye una vista de carta a partir de entidades y estado del mundo; distinguir definiciones de contenido, entidades runtime, instancia de carta y comandos. Como propuesta, separar ID semántico de acción de slot de gesto, usar contextos de exploración/diálogo/combate/loot y guardar efectos + transición de carta de forma atómica. No exponer cartas futuras, semillas o resultados privados. Las cuatro familias comparten el mismo contrato de interacción; el esquema concreto aún no está aprobado.

## Mundo persistente y subsistemas
Requisitos en WORLD, WORLD_EVENTS, CHARACTERS, COMBAT, INVENTORY, HOUSING y DUNGEONS. Separar identidad Auth, personaje y mundo lógico; catálogo de contenido compartible y estado aislado. Grafo jerárquico extensible con bases físicas. Reloj autoritativo real distinto de turnos; calcular horarios/recuperación desde timestamps, mantener alternativas de servicio. Propuestas: máquina de estados de derrota con memorial único, permisos de propiedad independientes de almacén, transferencias atómicas, perfil de dificultad acotado y fijado por expedición. No generar migraciones ni ampliar el primer prototipo por estas especificaciones. Fórmulas y contratos finales pendientes.

## Progresión y tiempo diferido
Ver PROGRESSION, OFFLINE_ROUTINES, SOCIAL y MAIL. Rutinas por personaje, versionadas, con frontera temporal liquidada; calcular intervalos de ausencia al regreso usando reloj autoritativo y aplicar efectos/recibo/snapshot atómicamente. No ejecutar simulación continua ni permitir dobles cobros; coordinar con expediciones y sesiones concurrentes. Presencia local y correo con autorización por mundo/personaje. Un solo mundo inicial, sin eliminar worldId del modelo. Catálogo de habilidades, reglas de avance, permisos de interacción y tratamiento hardcore offline pendientes.

## Presentación, contenido y operación
Ver ART_DIRECTION, LANGUAGE, ASSET_PIPELINE, STUDIO, ADMIN y TUTORIAL. Separar tokens de tema, ilustración, texto español, audio y animación de reglas y estado. Reutilizar SCE como base gráfica, preservar feedback/layout y baseline; adaptador emite intención sin mutar quiz. No duplicar reglas por tema/idioma. Contenido JSON validado primero; paquetes versionados después. Admin autorizado mediante servidor, cambios compensatorios auditados, restauración de entidad/global solo con pruebas y protección de estados relacionados. Prototipo local no requiere editor, Admin completo ni arte final.
