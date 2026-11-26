# Tiempo real, horarios y acontecimientos

Estado: diseño acordado parcialmente, 2026-11-26. No implementado.

## Acordado
El tiempo del mundo avanza sincronizado con un reloj real, independientemente de las acciones y de que los jugadores estén conectados. Todos los jugadores de un mismo mundo comparten hora; el ciclo día/noche y paisajes contextuales se relacionan con ella. El combate continúa siendo por turnos: reloj del mundo y resolución de turnos son conceptos diferentes.

**Jugabilidad antes que realismo horario:** no impedir que alguien juegue por conectarse a una hora concreta. Si una tienda cierra de noche, debe existir alternativa razonable (otra tienda abierta o comerciante nocturno). Si un NPC principal no está disponible, otro NPC puede sustituirlo o prestar el servicio equivalente. Los horarios aportan variedad y ambiente, no bloqueos generalizados. No exigir esperar al día siguiente para toda compra, descanso, curación o acceso esencial. Esto no obliga a que toda misión o comercio especializado esté disponible 24/7.

## Propuestas
- Fuente autoritativa UTC del servidor; configurar zona/representación horaria del mundo común a todos, no usar reloj local del cliente como autoridad. Relación 1:1 con tiempo real; zona exacta, calendario ficticio, horario de verano y definición de amanecer/anochecer por decidir.
- Horarios declarativos y variantes día/noche de NPC/servicios y paisajes; comprobar cobertura de servicios esenciales por franjas y acceso geográfico razonable.
- Calcular estado de horario y recuperación a partir de timestamps al consultar o actuar; programar tareas solo si necesarias. No simular cada segundo ni mantener proceso constante. Eventos offline según reglas, sin penalizar automáticamente al ausente.
- Validar acciones según situación actual; si una tienda cambia de horario con carta pendiente, conservar la instancia hasta actualización legítima, explicar cambio y ofrecer alternativa, no cambiar resultado silenciosamente.
- Clima, festividades, rotación de comercios y eventos globales/locales son ideas, no compromiso cerrado. No fijar duración de descansos, viaje o plazos de turnos todavía.

## Aceptación futura
Dos clientes de zonas horarias diferentes ven la misma hora de mundo. Reabrir al día siguiente no congela el reloj. Alterar reloj del dispositivo no adelanta recuperación ni cambia permisos. Probar acceso a servicios esenciales de noche y de día, cambio de turno de NPC y cambio de horario con carta abierta. No confundir hora real con necesidad de que el jugador responda en segundos.
