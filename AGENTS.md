# AGENTS.md — TCards RPG

## Antes de cambiar código
Lee README, docs/GDD.md, docs/ARCHITECTURE.md, docs/UI_UX.md, docs/CARDS.md, ROADMAP.md y los documentos del subsistema que vas a tocar. El GDD es la visión inicial; las decisiones aprobadas posteriores deben registrarse en docs/DECISIONS.md. No supongas que una propuesta es una funcionalidad existente.

## Límites del trabajo
- Trabaja por hitos pequeños; no implementes todo el GDD en una sola tarea. Rama y PR por cambio relevante; no hagas force-push ni despliegues producción sin autorización.
- No modifiques TC-HQ ni Type/16. SCE se ha copiado de forma independiente. Lee su AGENTS.md y API.md antes de adaptarlo; conserva el baseline y añade un adaptador en packages/swipe/ antes de alterar internamente SCE.
- Conserva las seis acciones: farLeft, left, up, right, farRight, down. Botones equivalentes, teclado, ratón, touch, cancelación, feedback opuesto, reduced-motion. La mochila/mapa no consumen ni regeneran la carta pendiente.
- Respeta los requisitos de UI_UX.md: mobile-first, montón visual de cartas y revelación central, menú con mochila/mapa/ajustes, escritorio con paisaje contextual y panel lateral manipulable. No conviertas propuestas visuales o ejemplos en requisitos definitivos. Mantén equivalencia de reglas móvil/PC y prueba cambios de layout sin consumir carta.
- Respeta CARDS.md: las cartas representan situaciones del mundo, no un mazo lineal ni una secuencia universal. Las cuatro familias acordadas son localización, NPC, enemigo/combate por turnos y objeto encontrado. La transición se resuelve en dominio autorizado; no fijes semántica universal a un gesto, ni dupliques botín/estado al renderizar. No fijes fórmulas, lore o reglas pendientes sin decisión.
- Lee WORLD, WORLD_EVENTS, CHARACTERS, COMBAT, INVENTORY, HOUSING y DUNGEONS al tocar esos sistemas. Respeta mundo independiente y jerárquico, reloj real con alternativas de servicio, varias identidades de personaje por cuenta, clases flexibles y estadísticas simples, rescate y modalidades de muerte, mochila por espacios sin peso/desgaste inicial, propiedades físicas y adaptación sutil solo donde proceda. No cierres fórmulas, penalizaciones, profesiones ni actividades económicas abiertas.
- Separa DOM/animaciones, motor puro, persistencia, contenido y red. La UI nunca decide recompensas, oro, RNG o permisos online. No reutilices el modelo de cuestionario como autoridad de RPG.
- Toda acción online debe ser autenticada, autorizada, validada, idempotente y transaccional, con revisión esperada y estado confirmado; no confiar en datos del cliente.
- No incluyas service_role, DB passwords, access tokens, credenciales, datos reales o backups en Git, logs o bundles. No desactives RLS. No ejecutes migraciones destructivas en producción sin copia y aprobación. No publiques ni cambies visibilidad del repositorio por iniciativa propia.
- Identificadores permanentes, versiones de reglas y contenido, migraciones incrementales y pruebas de compatibilidad. No cambies partidas activas silenciosamente. Datos de prueba ficticios.
- Usa TypeScript para código nuevo del motor/contratos, salvo decisión registrada; SCE original sigue siendo JS clásico. No añadas frameworks o dependencias sin justificar necesidad, licencia y coste.
- Contenido localizado (es/en previsto), texto seguro y assets con procedencia. No inyectes SVG o HTML no confiable.

## Entrega
Ejecuta npm test (baseline SCE); al introducir nuevos módulos añade pruebas unitarias, integración y casos de rechazo/reconexión. Reporta exactamente qué ejecutaste y qué no. Actualiza CHANGELOG, ROADMAP y decisiones cuando corresponda. En el PR indica cambios, pruebas, migraciones, compatibilidad, riesgos y rollback. No declares una función operativa hasta probarla.
