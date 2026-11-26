# TCards RPG — interfaz de cartas

## Procedencia
Copia íntegra de SCE v0.2.0 de TCardell/tc-hq, programs/SCE, commit 356314784d7cb412fea45e54b6c49d70dcb9b28a.
[Fuente fijada](https://github.com/TCardell/tc-hq/tree/356314784d7cb412fea45e54b6c49d70dcb9b28a/programs/SCE). Se conservan 13 blobs originales, incluidos demo, API, AGENTS y tests, en sce/. No es un submódulo: el RPG evoluciona independientemente; no se ha modificado TC-HQ.

## Integración futura
SCE tiene JS clásico y CSS sin build. El orden de carga es model.js, gestures.js, audio.js, player.js y player.css. Su demo local es independiente del juego. SCE ofrece seis IDs, feedback de botón/banner/sello opuesto y gestos; su Session está orientada a sets de preguntas y tiene answer/undo/restart local. **No usarla como autoridad del RPG online.** No permitir undo unilateral, avance local, puntuación de quiz ni resultados de combate determinados por SCE. onAnswer no constituye una API autoritativa.

Mantener baseline sin cambios para comparar; desarrollar adaptador separado aquí. Evaluar usar gestures.bind y la presentación existente, o extender Player con modo externo que emita intención sin mutar Session hasta recibir snapshot. Revisar cancelación, busy, teclas y desmontaje. Al abrir inventario conservar la instancia de carta del RPG y restaurar foco/visualización. El server valida ID/revisión; feedback inmediato solo visual; no comprometer estado hasta confirmación.

SCE limita imágenes a rutas locales o data URLs; usar assets de confianza, no URLs arbitrarias. El estudio SCE es herramienta de referencia, no TCards RPG Studio definitivo.

Pruebas: npm run test:sce desde raíz; checklist manual del README original. No hay aún adaptador implementado.
