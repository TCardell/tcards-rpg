# Mazmorras, expediciones y dificultad

Estado: principios acordados, 2026-11-26. Complementa GDD y MULTIPLAYER; no implementado.

## Acordado
Además de exploración libre, expediciones/mazmorras procedurales individuales, cooperativas, competitivas PvP/PvPvE y cooperativas con duelo final anunciado. Juego con amigos y posibilidad de partidas de una tarde (~1 h como ejemplo), personajes hardcore de creación rápida o persistentes que participen conservando sus reglas de muerte. Rescate antes de derrota definitiva. Algunas mazmorras y bosses pueden equilibrarse según estadísticas de participantes, pero **la adaptación debe ser sutil, no marcada**. No escalar todo el mundo ni cada enemigo hasta igualar el poder del personaje. Mejorar equipo y nivel debe seguir aportando ventaja real.

## Propuestas de dificultad
Mantener contenido fijo y adaptativo como opciones. Un encuentro con dificultad base propia puede ajustar moderadamente vida/ataque/defensa, número o composición de enemigos según tamaño y poder del grupo; acotar los ajustes y evitar copiar linealmente estadísticas. Para expediciones cortas, generar desafío apropiado sin borrar diferencias entre participantes. Calcular y fijar perfil de dificultad al crear/iniciar la expedición (propuesta), no reajustar a cada cambio de equipo o turno, para evitar explotación y que mejorar deje de importar. Recompensas, rangos y fórmula exacta pendientes; no definir porcentajes de escalado sin pruebas. Registrar versión y parámetros del ajuste para reproducibilidad y depuración.

## Expediciones y generación
Duración objetivo y dificultad configurables como propuestas (p. ej. 20/40/60/120 min); duración real depende de decisiones y disponibilidad. No imponer límite obligatorio de una hora. Semilla y versión, grafo alcanzable, entrada/salida, objetivo, encuentros, boss y botín coherentes; materializar estado y no regenerar al recargar. Separar instancia de expedición del mundo persistente, sin aislar automáticamente recompensas legítimas. Reglas de ingreso, compatibilidad de modalidades y nivel, abandono, tiempo máximo, plazos de turno y loot pendientes. En modos competitivos, anunciar reglas y consecuencias antes de participar. No introducir transferencia entre mundos ni recompensas sin validación.

## Pruebas futuras
Probar misma plantilla con grupos débiles/fuertes y tamaños distintos: diferencias moderadas, sin neutralizar progresión. Jugar personaje veterano vs recién creado sin exigir escalado universal. Verificar que cambiar equipo al entrar no permita manipular cálculo. Reproducir mazmorra por versión/semilla, reconexión, rescate, derrota y recompensa una sola vez. Probar duración objetivo con sesiones reales antes de fijar números. Ver COMBAT.md, CHARACTERS.md y MULTIPLAYER.md.
