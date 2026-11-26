# Contrato multijugador — borrador

## Comando
`{ commandId, scopeId, expectedRevision, cardInstanceId, actionId, payload }`.
Actor desde sesión Auth, no del payload. commandId único y estable en reintentos; si mismo ID y payload distinto, rechazar. Servidor verifica alcance, fase, participante, acción habilitada, condiciones y versión. Resultado y recibo se guardan en la misma transacción; si se repite devuelve el recibo original. Ante revisión obsoleta devolver conflicto y snapshot; no repetir una nueva acción automáticamente. Ocultar información privada de otros jugadores y RNG futuro.

## Turnos
Primera prueba: dos jugadores, una expedición, una fase, una acción por participante; restricción UNIQUE(expedition,turn,participant). Resolver exactamente una vez bajo bloqueo transaccional cuando estén ambas acciones; publicar revisión después del commit. En modo síncrono los turnos pueden tener plazo autoritativo; en asíncrono pueden durar horas y ser recuperables. Desconexión no supone pérdida inmediata; políticas explícitas para ausencia, abandono, caducidad. PvP y traición requieren consentimiento de reglas de entrada y aislamiento de objetivos privados.

## Reconexión
Realtime es aviso, no fuente de verdad. Descartar avisos viejos, detectar saltos, recuperar snapshot autorizado. Si no llega confirmación, repetir mismo commandId, no duplicar efectos. Desconexión, autenticación vencida, doble pestaña, cambios simultáneos y vuelta de segundo plano son casos de prueba. Backoff con jitter y polling moderado como fallback. Guardar pendingCard y contexto en servidor, mantener carta al abrir otro panel. Sin gameplay online durante desconexión salvo política diseñada posteriormente.

## Puerta de aceptación
Dos identidades distintas, dos navegadores/dispositivos, crear mundo por invitación, resolver un turno conjunto, recargar ambos, repetir una petición, rechazar acciones de terceros y fuera de turno, comprobar recompensas sin duplicar. No anunciar tiempo real funcional hasta superar pruebas. Medir latencia y cuotas; los límites de Supabase no equivalen a capacidad real de jugadores.
