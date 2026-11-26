# Persistencia y datos — propuesta

PostgreSQL relacional, JSONB solo para partes flexibles y snapshots; nunca guardar todo el mundo en un único documento mutable. Estos nombres son orientativos, aún no hay esquema implementado.

| Área | Entidades previstas |
|---|---|
| Identidad | profiles, worlds, world_members, invitations (hash, caducidad, usos) |
| Personajes | characters, character_stats, inventory_items, equipment, player_location |
| Contenido | content_versions, locations, npc_definitions, item_definitions, dungeon_templates |
| Estado | npc_relations, quests, world_events, pending_cards |
| Expediciones | expeditions, participants, turns, turn_actions, results |
| Economía | shops, shop_stock, ledger, reward_claims |
| Operación | command_receipts, admin_audit, schema_migrations |

Usar UUID/ID estable; FK, CHECK, UNIQUE y transacciones. Revisiones monotónicas por agregado; claves de idempotencia por actor/ámbito/comando, y premio único por encuentro/participante. No guardar datos privados innecesarios. Bloquear filas en orden consistente, validar ownership y saldo antes de modificar; en conflicto devolver snapshot/revisión actual. No aceptar identidad, saldo, recompensa ni rol declarado por cliente.

RLS en toda tabla expuesta; clientes solo leen su alcance y no escriben datos críticos directamente. Funciones privilegiadas con autorización explícita, search_path fijo, permisos mínimos. Pruebas A/B y usuario anónimo, membresía, revocación y accesos de Admin. Configuración/migraciones versionadas, datos dev ficticios, backups fuera del repositorio. Antes de migrar, probar copia/restauración y datos viejos. Exportación local versionada; importación validada, sin pasar loot a online.

## Extensiones de diseño (no esquema aprobado)
Ver WORLD, WORLD_EVENTS, CHARACTERS, INVENTORY, HOUSING, DUNGEONS. Identidad Auth/perfil distinta de múltiples personajes, mundo y modo por personaje; jerarquía de ubicaciones y conexiones separadas; horarios y timestamps autoritativos; estados de abatido/recuperación/fallecido y memorial único; propiedad física con ACL, personalización y contenedor de almacén separado; perfil de dificultad por expedición versionado. Nombres de tablas/campos, ACL, transferencias y recuperación pendientes. Todas las relaciones críticas limitadas al mundo y personaje correctos; evitar duplicación de loot, lápidas y propiedades en carreras/reintentos. No crear migraciones hasta definir contrato y pruebas.
