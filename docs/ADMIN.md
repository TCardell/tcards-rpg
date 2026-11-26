# TCards RPG Admin — diseño

No implementar acceso admin mediante contraseña fija, bandera en localStorage o rol enviado por cliente. Admin es una identidad autenticada con permisos validados en servidor.

| Rol | Ámbito |
|---|---|
| player | Personaje y acciones permitidas |
| world_owner | Invitaciones y configuración de su mundo |
| moderator | Moderación en mundos asignados |
| content_editor | Borradores y validación de contenido; no economía real |
| operator | Incidentes y reparación controlada |
| global_admin | Gestión de roles y operaciones excepcionales |

MVP: listar mundos y estado, gestionar invitaciones/miembros, suspender acciones de mundo, consultar eventos/errores, moderar y reparar partidas mediante comandos explícitos. Luego: edición/publicación de contenido con validación, inspección de inventario y ledger, gestión de expediciones, métricas/cuotas y copias/restauración.

Toda acción privilegiada requiere motivo, actor, scope, valores previos/posteriores necesarios, fecha, commandId, resultado y auditoría no editable por moderadores. Permisos mínimos, deny-by-default, confirmación de operaciones destructivas, restauración probada y trazabilidad. Ajustes de oro/objetos mediante compensación, no edición arbitraria del saldo. Separar entorno dev y prod; MCP de IA solo dev con escritura; prod restringido. No guardar claves de servicio en UI. Panel no es seguridad: RLS y funciones verificadas. No se han creado roles ni tablas todavía.
