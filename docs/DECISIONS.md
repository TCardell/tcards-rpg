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

ADR-009 a ADR-012: 2026-11-26. Requisitos, alternativas, consecuencias y criterios de aceptación en [UI_UX.md](UI_UX.md). Probar dos tamaños de viewport, navegación, gestos, persistencia de carta y ausencia de efectos no autorizados.

Para nueva decisión añade contexto, alternativas, consecuencias, prueba y fecha. No conviertas propuestas en acuerdos sin aprobación/justificación. El GDD original queda íntegro como referencia histórica.
