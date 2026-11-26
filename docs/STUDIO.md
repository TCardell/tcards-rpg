# TCards RPG Studio

Propósito definido, interfaz y detalles pendientes. Herramienta independiente para ampliar contenido sin modificar reglas cada vez. Studio edita definiciones y borradores; Admin gestiona estado runtime. Primero JSON versionado y validadores; UI progresiva conforme aporte valor. Español.

| Editor | Contenido |
|---|---|
| Localizaciones | Jerarquía, nodos, conexiones, condiciones, puntos de interés y ambiente |
| NPC | Retratos, diálogo ramificado, horarios, servicios, relaciones |
| Enemigos | Estadísticas, acciones, intenciones, encuentros y recompensas |
| Objetos | Equipo, consumibles, rarezas y loot |
| Misiones | Prerrequisitos, objetivos, ramas, recompensas |
| Mazmorras | Plantillas, rutas, encuentros, dificultad y bosses |
| Recursos | Ilustraciones, fondos, iconos, sonidos; posible Asset Factory |

Flujo propuesto: borrador -> validar esquema, IDs/enlaces/condiciones -> previsualizar cartas y rutas en sandbox -> exportar paquete versionado -> revisar -> publicar explícitamente. Reglas nuevas requieren cambio deliberado de motor, no código arbitrario introducido por editor. No alterar partidas activas silenciosamente. Validar rutas alcanzables, alternativas de horario, ciclos, acciones por slot, referencias, textos, assets y tamaños. No exigir IA generativa en runtime.

La demo/editor SCE se mantiene como referencia gráfica, no formato de contenido RPG. Studio podrá usar adaptador SCE para previsualización. Formatos definitivos, interfaz, roles de publicación y empaquetado pendientes. Prueba futura: crear lugar, NPC y objeto sin tocar reglas; rechazar referencias inexistentes y previsualizar sin afectar mundo real.
