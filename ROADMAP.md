# Roadmap — pre-alfa

El orden prioriza un corte vertical online desde el principio. Hitos propuestos, no fechas prometidas. First Playable (docs/FIRST_TASK.md) agrupa v0.0.2–v0.0.7 en un único encargo autónomo con checkpoints, no seis tareas que deba iniciar el propietario. Cada hito se verifica antes de avanzar; no declarar versión implementada si falta prueba. El prólogo reducido y reparación Admin forman parte del objetivo integrado.

| Hito | Alcance | Criterio de aceptación |
|---|---|---|
| v0.0.1 | Documentación, estructura, copia SCE | Baseline íntegro; docs y rutas coherentes; pruebas SCE ejecutables |
| v0.0.2 | Adaptador SCE fiel (base gráfica), contrato de comandos, motor mínimo | Seis gestos, fila/feedback SCE, botones y teclado; carta pendiente al abrir/cerrar mochila; acción rechazada no cambia estado |
| v0.0.3 | Supabase dev local/remoto, Auth, único mundo inicial y personaje; Admin lectura básica | Dos identidades separadas, invitación, RLS negativa, migración reproducible |
| v0.0.4 | Expedición de dos jugadores, turno compartido | Duplicados y carrera no duplican efectos; sincronía y recuperación tras recargar/desconectar |
| v0.0.5 | Guardado local/exportación y progreso online, recuperación y herramientas Admin | Restore probado, versiones y aislamiento local/online |
| v0.0.6 | Inventario, loot, equipo, oro y compensación Admin | Transacciones atómicas, capacidad, recompensas únicas |
| v0.0.7 | Región piloto y NPC/servicios, prólogo gradual | Viaje, taberna, hostal, tienda, iglesia; contenidos validados |
| v0.0.8 | Generación procedural | Semillas reproducibles, rutas válidas, dificultad, versiones fijadas |
| v0.0.9 | PvP, traición final, ampliación de Admin | Consentimiento de modalidad, autorización, auditoría; sin abuso de desconexión |
| v0.1.0 | Alfa privada con amigos | Pruebas en dos dispositivos reales, backup/restore, despliegue controlado, métricas y feedback |

Admin crece transversalmente a partir de Auth/persistencia, con herramientas básicas por subsistema y restauración probada. El prólogo candidato TUTORIAL.md es objetivo jugable progresivo conforme existan las mecánicas, no bloque de v0.0.2. Contenido JSON validado y recursos provisionales antes de Studio/arte masivo. Después: Studio, expansiones, contenido regional, propiedades, hardcore, rutinas y economía ampliada, Realms, accesibilidad y rendimiento. Orden de sistemas avanzados sujeto a revisión; no se promete que todos estén en alfa. Español único inicial. No comprometer fecha ni número de jugadores sin medición.

## Corte integrado verificado

La rama First Playable cubre v0.0.2–v0.0.7 para la región piloto. La plaza comunica con la posada, el camino, la capilla y el mercado. Realms conserva la misión individual y una expedición cooperativa independiente. La evidencia y las limitaciones se mantienen en [PROGRESS.md](PROGRESS.md). La generación procedural, el aumento de contenido y las pruebas en dispositivos físicos siguen abiertos.
