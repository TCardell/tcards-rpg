# TCards RPG — interfaz de cartas

## Procedencia
Copia íntegra de SCE v0.2.0 de TCardell/tc-hq, programs/SCE, commit 356314784d7cb412fea45e54b6c49d70dcb9b28a.
[Fuente fijada](https://github.com/TCardell/tc-hq/tree/356314784d7cb412fea45e54b6c49d70dcb9b28a/programs/SCE). Se conservan 13 blobs originales, incluidos demo, API, AGENTS y tests, en sce/. No es un submódulo: el RPG evoluciona independientemente; no se ha modificado TC-HQ.

## Adaptador del First Playable

`table.js` construye la mesa RPG con las clases CSS originales, `gestures.bind`, `responseLayout`, `choiceStyle` y `Player.preview`. Reproduce el lanzamiento desde la transformación actual hasta el borde de la mesa y honra la preferencia de movimiento reducido. La espera asíncrona permite confirmar o rechazar la intención sin crear una Session de cuestionario. La copia bajo `sce/` conserva su historial verificable frente a main.

## Contrato de integración
SCE tiene JS clásico y CSS sin build. El orden de carga es model.js, gestures.js, audio.js, player.js y player.css. Su demo local es independiente del juego. SCE ofrece seis IDs, feedback de botón/banner/sello opuesto y gestos; su Session está orientada a sets de preguntas y tiene answer/undo/restart local. **No usarla como autoridad del RPG online.** No permitir undo unilateral, avance local, puntuación de quiz ni resultados de combate determinados por SCE. onAnswer no constituye una API autoritativa.

Mantener baseline sin cambios para comparar; desarrollar adaptador separado aquí. Evaluar usar gestures.bind y la presentación existente, o extender Player con modo externo que emita intención sin mutar Session hasta recibir snapshot. Revisar cancelación, busy, teclas y desmontaje. Al abrir inventario conservar la instancia de carta del RPG y restaurar foco/visualización. El server valida ID/revisión; feedback inmediato solo visual; no comprometer estado hasta confirmación.

SCE limita imágenes a rutas locales o data URLs; usar assets de confianza, no URLs arbitrarias. El estudio SCE es herramienta de referencia, no TCards RPG Studio definitivo.

Pruebas: npm run test:sce desde raíz; checklist manual del README original. La comparación automatizada se encuentra en `tests/browser/table.spec.mjs`.

## Fidelidad gráfica y de interacción (requisito)
SCE v0.2.0 es **la base gráfica y referencia principal** de TCards RPG, no sugerencia de swipe genérico. Antes de diseñar shell, ejecutar demo y estudiar API, gestures.js, player.js y player.css. Reutilizar código de gesto/feedback/presentación cuando viable; justificar adaptación o reimplementación puntual. Copia original intacta; no tocar repo fuente. Diferenciar aspecto (tema, marco, arte, layout) de comportamiento. Regicide inspira estética minimalista y combate; SCE define interacción.

- Fila espacial farLeft, left, up, right, farRight; down en barra inferior. Solo opciones habilitadas. Botones, teclado, ratón y touch equivalentes.
- Intensidad horizontal por distancia, vertical independiente, sin boost diagonal. Baseline: 52px horizontal corto, 70px vertical y ratio 1.3, fuerte 150px configurable (110–210); no redefinir umbrales arbitrariamente sin comparar usabilidad y registrar decisión. Modos/restricciones contextuales.
- Durante arrastre y lanzamiento, iluminar exactamente botón activo, mantener banner fijo y sello en lado opuesto (izquierda->derecha, derecha->izquierda, arriba->abajo, abajo->arriba); limpiar todo al cancelar. Utilizar responseLayout, choiceStyle, preview y gestures.bind cuando apropiados; consultar API real.
- Montón visual, giro/revelación central, transición fluida, sonido discreto opcional y reduced-motion. Menú/paneles no disparan gesto; preservar foco, instancia y revisión. Busy evita dobles acciones; rechazo del motor restaura visual coherente.
- Presentación emite intención semántica y espera resultado autorizado; no usar Session.answer/undo/restart ni onAnswer posterior a mutación como reglas RPG. No guardar datos futuros del encuentro en set cliente.

Prueba comparativa explícita de demo original y adaptador con todas las direcciones, teclado, mouse/touch, cancelación, estados deshabilitados, layout móvil/PC y rechazo. Tema cambia estilo, no comportamiento ni reglas. Español inicial. Ver UI_UX, ART_DIRECTION y FIRST_TASK.
