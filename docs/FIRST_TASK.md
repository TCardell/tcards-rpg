# Primer encargo para Codex

Trabaja en una rama nueva a partir de main una vez fusionada la fundación. Lee AGENTS.md, README, ROADMAP, GDD y packages/swipe/README.md. No conectes producción ni despliegues servicios.

Objetivo v0.0.2: implementar un prototipo local mínimo que use SCE como interfaz (no su motor de cuestionario como motor RPG). Define un contrato serializable ActionIntent y GameSnapshot. Crea un adaptador que muestre carta pendiente y acciones habilitadas; admite seis gestos y botones equivalentes. Crea un reducer de ejemplo con un personaje ficticio, una carta de encuentro, dos o más opciones y una transición determinista. Abre/cierra mochila sin cambiar cardInstanceId ni revisión; mostrar una acción rechazada sin avanzar. Mantén baseline SCE y usa sus pruebas de regresión. Decide si adaptar Player o usar gestures.bind con shell propio; explica por qué. No introducir backend ni crear sistemas completos.

Entregables: prototipo accesible en navegador, instrucciones reproducibles, pruebas de reducer, carta pendiente, acciones inválidas, cancelación y doble envío; prueba manual de mouse/touch/keyboard (indica si no disponible). Actualiza CHANGELOG y ROADMAP. En PR documenta limitaciones y siguiente hito de Supabase dev con dos identidades. No declares multijugador operativo.
