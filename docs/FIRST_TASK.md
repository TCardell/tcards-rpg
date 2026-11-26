# Primer encargo para Codex — v0.0.2

Trabaja en rama nueva desde main con documentación consolidada. Lee AGENTS.md, README, DESIGN_OVERVIEW, DECISIONS, ROADMAP, GDD histórico, UI_UX, CARDS, ART_DIRECTION, LANGUAGE, TUTORIAL y packages/swipe/README.md; revisa demo, API, código y tests de SCE original. No conectes producción ni despliegues servicios.

## Objetivo
Prototipo local mínimo en navegador que utilice **SCE v0.2.0 como base gráfica y referencia principal**, no tarjetas genéricas. Conserva baseline en packages/swipe/sce. Reutiliza gestos, helpers y presentación cuando viable; si adaptas Player o construyes shell propio con gestures.bind, justifica fidelidad. No uses Session, score, next de quiz, undo ni onAnswer posterior a mutación como autoridad RPG.

- ActionIntent y GameSnapshot serializables. Reducer puro con personaje ficticio, carta de localización o encuentro, dos o más opciones y transición determinista dependiente de acción; datos sencillos en español, no mazo lineal.
- Seis slots contextuales, fila farLeft/left/up/right/farRight y down inferior cuando habilitado; botones y teclado equivalentes a swipes. Arrastre corto/largo horizontal y vertical independiente, iluminación exacta, banner fijo y sello opuesto a gesto, cancelación restaura estado visual, transición/giro y feedback de SCE.
- Shell mobile-first, montón visual y carta central; escritorio con paisaje provisional y panel lateral manipulable. Estética sobria, elegante y minimalista; un tema inicial, tokens extensibles, placeholders. Menú/mochila de prueba.
- Abrir/cerrar mochila, mapa/panel, cambiar viewport o tema no consume ni regenera carta; conservar cardInstanceId y revisión. Acción inválida no avanza; evitar doble envío. Si implementas guardado local, probar recarga; si no, declarar limitación. No afirmar persistencia online.
- Usar fragmento provisional del mundo/prólogo (p. ej. llegada a plaza/puerta y rutas), no tutorial completo. No fijar fórmulas, lore final ni todo HUD. Español único, IDs independientes del idioma.
- No implementar backend, Auth real, multiplayer, Admin completo, Studio, economía ni rutinas. Inspector local de estado opcional solo si ayuda a depurar sin ampliar alcance.

## Entregables y pruebas
App reproducible con instrucciones, estructura modular, contrato/reducer/adaptador. Ejecutar npm test (baseline SCE), añadir pruebas de reducer, acción inválida, cancelación, doble envío y persistencia de carta al consultar panel. Comparar demo y prototipo en navegador con ratón, touch y teclado, seis direcciones/umbrales, feedback durante drag y cancelación, reduced-motion, móvil/PC; indicar exactamente qué se probó y qué no. Preferir capturas o registro de prueba cuando posible. No afirmar paridad visual sin comprobar.

Actualizar CHANGELOG y ROADMAP, PR pequeña con decisiones, limitaciones, instrucciones y siguiente hito Supabase dev con dos identidades. No alterar GDD histórico ni baseline SCE, no publicar cambios en TC-HQ ni desplegar producción. No ampliar alcance por toda la documentación conceptual.
