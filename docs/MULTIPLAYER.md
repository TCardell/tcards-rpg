# Contrato multijugador — borrador

## Comando
`{ commandId, scopeId, expectedRevision, cardInstanceId, actionId, payload }`.
Actor desde sesión Auth, no del payload. commandId único y estable en reintentos; si mismo ID y payload distinto, rechazar. Servidor verifica alcance, fase, participante, acción habilitada, condiciones y versión. Resultado y recibo se guardan en la misma transacción; si se repite devuelve el recibo original. Ante revisión obsoleta devolver conflicto y snapshot; no repetir una nueva acción automáticamente. Ocultar información privada de otros jugadores y RNG futuro.

## Turnos
Primera prueba: dos jugadores, una expedición, una fase, una acción por participante; restricción UNIQUE(expedition,turn,participant). Resolver exactamente una vez bajo bloqueo transaccional cuando estén ambas acciones; publicar revisión después del commit. En modo síncrono los turnos pueden tener plazo autoritativo; en asíncrono pueden durar horas y ser recuperables. Desconexión no supone pérdida inmediata; distinguir riesgo en mundo normal y derrota en combate/expedición activa. Políticas explícitas para ausencia, abandono, caducidad y excepción hardcore pendientes. PvP y traición requieren consentimiento de reglas de entrada y aislamiento de objetivos privados.

## Reconexión
Realtime es aviso, no fuente de verdad. Descartar avisos viejos, detectar saltos, recuperar snapshot autorizado. Si no llega confirmación, repetir mismo commandId, no duplicar efectos. Desconexión, autenticación vencida, doble pestaña, cambios simultáneos y vuelta de segundo plano son casos de prueba. Backoff con jitter y polling moderado como fallback. Guardar pendingCard y contexto en servidor, mantener carta al abrir otro panel. Sin comandos del cliente durante desconexión; el personaje puede permanecer expuesto, retornar a casa y realizar rutina retrospectiva según OFFLINE_ROUTINES.md. No confundir rutina con turno activo de expedición.

## Puerta de aceptación
Dos identidades distintas, dos navegadores/dispositivos, crear mundo por invitación, resolver un turno conjunto, recargar ambos, repetir una petición, rechazar acciones de terceros y fuera de turno, comprobar recompensas sin duplicar. No anunciar tiempo real funcional hasta superar pruebas. Medir latencia y cuotas; los límites de Supabase no equivalen a capacidad real de jugadores.

## Mundo y modalidades
Mundos independientes con reloj real común; no confundir servidor lógico con una máquina. Aislar estado y membresía por mundo. Una cuenta puede tener varios personajes; autorizar personaje seleccionado y participación en cada comando. Personaje libre y hardcore conservan sus reglas de muerte; rescate cooperativo antes de resolución definitiva y lápida de hardcore. Grupos mixtos y reglas de plazos/rescate pendientes. Expediciones rápidas con amigos, adaptación sutil de algunos bosses/mazmorras; no recalcular a cada turno. Visitar propiedades ajenas no concede acceso a sus bienes. Ver WORLD, WORLD_EVENTS, CHARACTERS, COMBAT, DUNGEONS y HOUSING. No confundir reloj real con combate de acción continua.

## Interacción fuera de expediciones
Ver SOCIAL.md y MAIL.md. Distinguir mundo/localización/grupo; puntos de encuentro para buscar amigos, grupos libres o viajes juntos, interacción y comercio consentidos, duelos, visitas y correspondencia. Autorizar presencia por mundo y ubicación; no revelar ausentes o zonas privadas sin política. Invitaciones y mensajes no consumen carta. Rutinas se calculan al volver, no en bucle continuo. Primera implementación con un solo mundo, sin abandonar aislamiento de worldId.
