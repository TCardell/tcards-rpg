# TCards RPG Admin — centro de control

Requisito acordado: web unificada, elegante y técnica para visualizar, gestionar, modificar y restaurar el juego. Desarrollo transversal desde hitos iniciales online. Español, aplicación independiente de gameplay y Studio. No implementado.

| Área | Inspección y operaciones candidatas |
|---|---|
| Dashboard | Mundos, usuarios, personajes, presencia, expediciones, objetos, oro, propiedades, actividad y alertas |
| Mundos | Configuración, miembros, invitaciones, localizaciones, eventos, suspensión controlada |
| Usuarios | Cuentas, roles, acceso, moderación, bloqueos |
| Personajes | Estado, ubicación, estadísticas, habilidades, rutinas, carta pendiente; correcciones |
| Inventario/economía | Objetos, equipo, almacenes, ledger, precios, ingresos, transacciones; compensar pérdidas y duplicaciones |
| NPC/misiones | Ubicación, horarios, relaciones, progreso, incidencias |
| Propiedades | Titular, mejoras, almacenamiento, permisos |
| Expediciones | Participantes, fase, turnos, acciones, resultado; diagnóstico/pausa si reglas permiten |
| Cementerio | Fallecimientos, memoriales, estadísticas; corrección excepcional de errores |
| Registros | Eventos de dominio, errores, historial administrativo y filtros |
| Backups | Estado, exportación, verificación, recuperación controlada |
| Sistema | Salud Auth/DB/Realtime, latencia, errores, almacenamiento y cuotas reales si expuestos |

Buscar por ID/mundo/personaje; mostrar estado y revisiones/eventos; no inventar métricas. Propuesta de vista previa, valores anteriores/nuevos, motivo, confirmación y resultado.

## Restauración
1. Preferir corrección individual: devolver objeto perdido por bug, compensar oro, ajustar estadística, trasladar a casa, desbloquear carta/encuentro tras verificar. Comandos compensatorios auditados, conservar ledger e invariantes.
2. Restaurar entidad: reconstruir desde snapshot/eventos cuando disponibles, comprobar efectos cruzados (inventario, comercio, grupo, misión, propiedad) y previsualizar conflictos; no revertir ciegamente estado ajeno ni duplicar loot. Rescate excepcional de hardcore fallecido por fallo técnico demostrado como propuesta, no resurrección normal.
3. Restauración global como último recurso: estimar pérdida de progreso, detener escrituras, verificar copia, restaurar primero en entorno aislado, probar integridad y permisos, autorizar promoción y tener rollback. No ejecutar restore destructivo desde botón sin procedimiento. Disponibilidad de copias/retención depende de plan e infraestructura; probar exportación y restauración propia, no prometer PITR.

## Permisos
No contraseña fija, bandera localStorage ni rol enviado por cliente. Admin autenticado con permisos validados servidor.

| Rol candidato | Ámbito |
|---|---|
| player | Personaje y acciones permitidas |
| observer | Inspección limitada, sin mutaciones |
| world_owner | Invitaciones y configuración de mundo autorizado |
| moderator | Moderación en mundos asignados |
| content_editor | Borradores y validación, no economía real |
| operator | Incidentes y reparación controlada |
| global_admin | Gestión de roles y operaciones excepcionales |

Mínimo privilegio, deny-by-default, separar lectura/escritura, autorización de scope y revisión. Toda acción privilegiada requiere motivo, actor, scope, valores previos/posteriores necesarios, fecha, commandId, resultado y auditoría no editable por moderadores. Confirmación reforzada de operaciones destructivas y copia. MFA propuesta. No exponer claves service_role/DB ni correo privado sin permiso. RLS/funciones verificadas; UI no es seguridad. Dev separado de prod; IA con escritura solo dev, prod restringida. No desplegar ni cambiar prod sin autorización.

## Desarrollo
Sandbox separado: personajes/objetos/enemigos ficticios, forzar encuentros, generar mazmorras, simular ausencia/rutinas, inspeccionar carta y transiciones, probar combate y flags, resetear datos de prueba. Sin alterar economía real ni bypass de autorización en prod.

Incrementos: v0.0.2 inspector local opcional, no Admin completo; Auth/mundo/personaje -> lectura autorizada/membresía/invitaciones; turnos/persistencia -> inspección y recuperación; inventario/economía -> ledger y compensación; nuevas herramientas conforme se incorporan NPC/misiones/propiedades/rutinas. Alfa -> roles, auditoría, métricas reales, procedimiento restore probado. No anunciar restauración no probada.

Pruebas: jugador normal no accede; observador no escribe; operador mundo A no altera B; comandos repetidos no duplican compensación; revisión obsoleta produce conflicto; auditoría completa; restore sandbox preserva integridad y progreso no relacionado. Ver ARCHITECTURE, DATABASE, MULTIPLAYER y ROADMAP.
