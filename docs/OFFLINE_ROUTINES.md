# Desconexión, rutinas diarias y trabajo AFK

Estado: requisitos acordados; detalles de equilibrio y seguridad pendientes, 2026-11-26. No implementado.

## Acordado
- Desconexión breve: personaje permanece donde estaba. Si es zona peligrosa, puede ser atacado; una muerte durante la desconexión tiene penalización reducida respecto a una derrota activa. No convertir la desconexión en invulnerabilidad universal.
- Tras demasiadas horas de ausencia, el personaje regresa por sí mismo a su casa. Umbral exacto y alternativa si no posee casa pendientes.
- El personaje puede tener rutina diaria personalizable. Se calcula retrospectivamente al volver, no con simulación continua en el servidor. Al conectarse puede encontrarse en la ubicación correspondiente a su rutina.
- Puede elegir un trabajo y obtener oro AFK. Los ingresos deben ser inferiores a los de jugar activamente, especialmente conseguir botín en mazmorras. Trabajos duros pueden dejar menos energía. Descansar en casa permite recuperarse por completo si ha transcurrido suficiente tiempo.
- Correspondencia persistente con jugadores y NPC (MAIL.md).

## Experiencia propuesta
Editor de rutina con franjas horarias del reloj del mundo y actividades configurables. Ejemplos: casa/descanso, trabajo en herrería, comercio, estudio, entrenamiento y visita a taberna. Solo trabajo, descanso y rutina personalizable están explícitamente acordados; aprendizaje AFK y otras actividades son propuestas. Validar que la actividad y destino existan y estén disponibles; alternativas si cierran. No obligar a rellenar todo el día ni hacer gestión de horarios imprescindible. Al regresar, mostrar resumen de ausencias, cambios de ubicación, ingresos, cansancio, descanso, acontecimientos y correo. Ejemplos de salarios, horas y energía son ilustrativos, no fórmulas.

## Resolución diferida propuesta
Guardar momento autoritativo de última actividad/fin de sesión, estado, ubicación, versión de rutina y última frontera temporal liquidada. Distinguir ausencia real de recarga, pestañas múltiples y breves cortes. Al volver, servidor calcula solo intervalo no liquidado según reloj y reglas vigentes; considera peligro antes del retorno, desplazamiento y franjas válidas, sin simular cada segundo. Aplicar resultados y actualizar frontera temporal/recibo en una transacción, con revisión y bloqueo; reintento devuelve mismo resultado. No cobrar dos veces, volver a tirar un encuentro, ni reescribir retroactivamente rutina. Limitar coste de cálculo para ausencias largas; política de acumulación y ventanas por definir. No confiar en reloj, ingresos o sucesos enviados por cliente.

La rutina no debe resolver por sí sola una expedición activa, abandonar un grupo o eludir una muerte inminente. La ausencia dentro de una expedición se rige por su propio contrato. No fijar aún probabilidad de ataque, plazo de regreso, tratamiento hardcore durante ausencia, ni penalizaciones concretas: conciliar muerte permanente con derrota offline menos severa y evitar que desconectarse deliberadamente sea una vía de escape. No declarar inmunidad hardcore aprobada. Si otro jugador consulta presencia, una proyección autorizada de la rutina puede ser candidata, pero materializar estado antes del regreso o permitir interacciones con ausentes requiere decisión; no hacer simulación continua.

## Economía y abuso
No confundir trabajo AFK con sistema completo de profesiones/crafting. Equilibrar ingresos con actividad real; considerar límite por tiempo/cuenta, restricciones de trabajos y fatiga para evitar granjas de personajes, sin fijar números ni impedir varios personajes legítimos. Ingresos en oro, no nueva moneda. Ver ECONOMY.md.

## Pruebas futuras
Recarga rápida no cambia rutina ni paga; ausencia corta conserva ubicación con riesgo si procede; ausencia larga devuelve a casa y aplica rutina según franja; descanso suficiente recupera, trabajo duro consume energía y concede oro una sola vez. Dos sesiones concurrentes no liquidan dos veces. Reloj cliente alterado no cambia resultados. Probar derrota offline y desconexión durante combate por separado antes de habilitar hardcore. Ver WORLD_EVENTS.md, CHARACTERS.md y MULTIPLAYER.md.
