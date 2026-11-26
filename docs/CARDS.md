# TCards RPG — Sistema de cartas y decisiones

**Estado:** diseño funcional, 26 de noviembre de 2026. No implementado. Los requisitos del creador se distinguen de recomendaciones técnicas y ejemplos. Complementa GDD, UI_UX y GAME_RULES.

## 1. Principio fundamental

Las cartas son la interfaz de situaciones que surgen en un mundo RPG. El mundo, entidades, relaciones y estado existen independientemente de las cartas. No es un TCG, cuestionario, baraja finita, ni secuencia universal predefinida. El aspecto de montón visual no implica que se hayan determinado o descargado todas las cartas futuras.

**Acordado:** la carta puede estar basada en una definición escrita o en una situación construida dinámicamente según lugar, decisiones previas, NPC, inventario, combate y contexto. La próxima carta depende de la acción y sus consecuencias. Dos jugadores pueden visitar el mismo lugar y recibir situaciones diferentes. El mismo personaje o enemigo puede seguir apareciendo durante varias decisiones consecutivas.

Reigns es una referencia de interacción, no de reglas: TCards RPG añade libertad espacial, inventario, estados persistentes, combate por turnos y mundo multijugador. No copiar recursos, textos o marca de otros juegos.

## 2. Cuatro familias principales acordadas

| Familia | Entidad de referencia | Acciones de ejemplo | Continuación |
|---|---|---|---|
| Localización | Lugar, nodo, acceso o punto de interés | Tomar camino, cruzar puerta, entrar, volver | Otro lugar, conversación, encuentro o actividad |
| Personaje/NPC | NPC y estado de conversación | Preguntar, responder, aceptar, rechazar, despedirse | Mismo NPC con frase nueva, misión, comercio, combate o lugar |
| Enemigo/combate | Enemigo(s), encuentro y turno | Atacar, defender, usar habilidad, huir | Siguiente turno con estado actualizado, victoria/derrota, botín |
| Objeto | Hallazgo, recompensa o ítem disponible | Recoger, dejar, examinar | Otro objeto, inventario actualizado o reanudar situación |

Los tipos determinan la presentación y las interacciones permitidas, no cuatro motores separados. Las opciones de ejemplo no fijan una acción universal por dirección. Las cartas pueden incluir una ilustración, texto, indicadores y estadísticas según familia; no exigir toda la información en todas las cartas.

### 2.1 Localizaciones y navegación libre

Una plaza, una calle, una puerta de castillo, un camino, una sala de mazmorra y otros lugares se representan como cartas. Cada destino válido está ligado al mundo, no al índice de la carta. Ejemplo: desde plaza A, entrar a taberna B, caminar al castillo C o seguir ruta a bosque D. Al salir de la taberna volver a A; al recorrer otra salida, actualizar ubicación. El jugador puede explorar, retroceder y revisitar lugares, salvo impedimentos narrativos o físicos explícitos.

Acordado: mundo jerárquico y conectado mediante grafo (ver [WORLD.md](WORLD.md)). Propuesta técnica: nodos y conexiones dirigidas o bidireccionales, con condiciones (llave, acceso, horario, descubrimiento) y acciones locales. Separar ubicación actual, destinos, puntos de interés y actividades. No confundir desplazarse con abrir el mapa. El mapa puede consultar rutas sin consumir la carta.

La interfaz permite hasta seis gestos; no limitar el diseño del mundo a seis conexiones. Cuando haya más destinos/NPC/servicios, usar subcartas de selección (p.ej. calles, establecimientos, caminos) o una lista accesible que devuelva la elección al motor. No hacer que el jugador recorra cartas aleatorias buscando una salida conocida. Señalar cuándo una opción abre otra selección o representa un movimiento real. Por concretar: opciones por página, viajes largos, encuentros durante viaje, coste y tiempo, descubrimiento, accesos bloqueados y ruta de regreso.

### 2.2 NPC y conversaciones

Al interactuar con un NPC, mostrar su identidad y frase, con respuestas contextuales. Cada respuesta elige un nodo/variación o termina conversación. La siguiente carta puede ser del mismo NPC, con nueva frase y acciones, sin cambiar de lugar. Mantener el retrato y otros elementos de reconocimiento. Pueden existir ramas, retornos a temas, condiciones, reputación y consecuencias que afecten otras conversaciones.

Propuesta: diálogos escritos mediante grafo con IDs estables, condiciones y efectos declarativos; seleccionar texto contextual con variables seguras, sin ejecutar código arbitrario ni necesitar un LLM en tiempo real. El contenido procedural puede combinar diálogos preparados con datos del mundo. Registrar si una opción revela información, inicia una misión, abre tienda, cambia relación o termina la conversación. Permitir despedida cuando tenga sentido; las interacciones forzadas deben estar justificadas por situación. Evitar bucles involuntarios, enlaces rotos y premios repetibles sin condiciones.

Por concretar: NPC itinerantes, horarios, personalidades, memoria, idioma, relación personal vs compartida y contenido generado.

### 2.3 Enemigos y combate

Acordado: combate por turnos, carta de enemigo con vida, ataque y defensa. Los valores visibles deben corresponder al estado real confirmado. Mostrar la vida restante tras cada turno; otros indicadores (efectos, preparación, resistencia) se decidirán en COMBAT.md. No se fija fórmula de daño, frecuencia de turno, escala ni clases.

Propuesta: mantener encounterId estable y turnId/revisión cambiante; el motor recibe intención del jugador, valida que sea su turno/acción disponible, resuelve acciones y devuelve nuevo estado. Presentar un resultado breve (daño, bloqueo, efecto) y siguiente carta con enemigo actualizado. Puede conservar retrato e identidad; no generar un nuevo enemigo al revelar carta ni al recargar. Terminar al resolver victoria, derrota, retirada u otra condición válida; encadenar botín o regreso al lugar. Las reglas de huida, defensa, uso de consumibles y combate con varios enemigos quedan pendientes.

En coop/PvP, una carta es la vista autorizada para ese jugador de la fase/turno del encuentro compartido. Diferentes participantes pueden tener acciones y objetivos distintos. Esperar confirmación del servidor y resolver una sola vez. No asumir que cada swipe de cada jugador resuelve un turno completo para todo el grupo.

### 2.4 Objetos encontrados

Acordado: una carta representa un objeto encontrado; el jugador decide recogerlo o dejarlo. Puede mostrar nombre, ilustración y datos pertinentes. Recoger modifica el inventario mediante una acción validada, nunca al presentar la carta. Los objetos pueden surgir de exploración, combate, recompensas u otros hallazgos.

Propuesta: distinguir itemDefinitionId (tipo), itemInstanceId o pila (objeto concreto), y lootOfferId (oferta/disponibilidad); reservar resultado de generación antes de revelar; validar capacidad, propiedad, disponibilidad y restricciones en transacción. Si recoger falla, no consumir la oferta de forma silenciosa. Si es compartida y otro jugador la reclama, actualizar la situación y explicar. Reintento idempotente no duplica el objeto. Consultar detalles o mochila no recoge ni descarta.

Por decidir: si dejar un objeto lo mantiene físicamente en el lugar y permite volver, cuánto dura, propiedad del hallazgo, distribución de botín, capacidad por peso/slots, objetos agrupados y qué sucede si se llena mochila. No adoptar despawn o pérdida automática sin decisión. Evitar farm infinito por entrar/salir de una ubicación o recargar.

## 3. Tipos complementarios: propuestas, no requisitos cerrados

Exploración/acontecimiento (trampa, clima, ruido, hallazgo); actividad/comercio (comprar, vender, descansar, rezar); misión/información; resultado/feedback; transición/espera multijugador. Pueden ser subtipos de las cuatro familias, presentaciones del mismo sistema o vistas auxiliares. No crear un renderer y motor por cada acontecimiento ni obligar a confirmar cartas informativas innecesariamente. Se decidirán al diseñar cada subsistema.

## 4. Qué determina la próxima carta

Propuesta de resolución:
1. Leer situación actual materializada y acciones válidas.
2. El usuario elige mediante gesto/botón. SCE solo emite intención.
3. Motor autorizado comprueba acción, permisos, contexto, fase, costes y revisión.
4. Aplica efectos y determina transición: seguir en ubicación, desplazarse, iniciar/seguir diálogo, iniciar/seguir combate, descubrir objeto, retornar a contexto anterior.
5. Construye y persiste nueva instancia de carta (o mantiene la actual si es consulta/rechazo). Guarda en la misma transacción consecuencias, revisión y recibo de comando.
6. La UI presenta feedback y carta confirmada. Realtime avisa de cambios compartidos; recuperar snapshot si hace falta.

El contenido puede ser **fijo** (plaza con destinos conocidos), **condicional** (NPC cambia por relación/hora/misión), **procedural** (encuentro/botín generado con semilla de servidor) o **derivado** (vida de enemigo, estado de tienda). No requiere IA generativa en ejecución. Combinar definiciones versionadas y estados reales; no preescribir toda combinación de carta posible. No aleatorizar destinos conocidos, respuestas válidas o vida enemiga al renderizar. No confiar en cadenas de nextCardId suministradas por el cliente.

Propuesta: máquina de estados/contextos (exploration, dialogue, combat, loot, activity, etc.) con referencias al lugar y contexto de retorno. Las interrupciones explícitas (encuentro en un camino, conversación que deriva a combate) conservan destino o actividad previa cuando proceda. No recursión ilimitada de contextos; validar transiciones y salidas. Las acciones de menú no son necesariamente transiciones de carta.

## 5. Contratos técnicos provisionales

Separar:
- Definiciones de contenido versionadas (ubicación, NPC, diálogo, enemigo, ítem, plantilla).
- Entidades de runtime (personaje, ubicación actual, relación, encuentro, turno, oferta de loot).
- Vista de carta materializada/autorizada (cardInstanceId, kind, subtype opcional, contextRef, contentVersion, revision, título/texto/imagen/indicadores, availableActions).
- Cada acción visible tiene actionId semántico estable en la instancia, gestureSlot de SCE (farLeft/left/up/right/farRight/down), label y descripción/coste si se conocen. Slot es interfaz; actionId es intención de dominio. No exponer resultados privados, semillas futuras ni efectos que el cliente pueda enviar como verdad.
- Comando online: commandId, scopeId, expectedRevision, cardInstanceId, actionId, payload validado si procede. Identidad deriva de Auth. La UI no decide daño, dinero, inventario ni transición.

Tipos exactos, JSON Schema, almacenamiento, límites de texto y versionado se concretarán con engine/shared/backend. No congelar nombres de campos como API definitiva en esta fase. Permitir extensiones sin romper partidas y validar IDs/enlaces/condiciones de contenido con Studio en el futuro.

## 6. Ejemplo completo (ficticio, no lore ni balance)

Plaza → entrar taberna → tabernero: "¿Buscas trabajo?" → preguntar por trabajo → mismo tabernero: "Hay ruidos en la cueva" → aceptar o despedirse → plaza → camino a la cueva → encuentro con trasgo → ataque/defensa durante varios turnos → victoria → espada encontrada → coger/dejar → reanudar exploración → volver a plaza.

Rama alternativa: plaza → castillo → guardia → permiso denegado → volver a plaza. Otra: visitar taberna y despedirse sin aceptar. El mundo conserva estados y no fuerza recorrido lineal. Cualquier cifra, texto o nombre es de demostración.

## 7. Invariantes y criterios de aceptación

- Navegar por un pequeño grafo permite volver a una ubicación y elegir otro destino; no depende del orden de una baraja.
- Un NPC admite dos respuestas divergentes y al menos dos cartas seguidas del mismo personaje.
- Un enemigo mantiene identidad durante turnos, muestra vida/ataque/defensa y termina al cumplir condición de victoria/derrota.
- Una oferta de objeto admite recoger/dejar; recoger una vez modifica mochila; una petición duplicada no duplica objeto. Rechazo por incapacidad o conflicto mantiene coherencia.
- Abrir menú, recargar o reconectar no regenera carta, enemigo ni botín. Cambio legítimo de servidor se comunica con nueva revisión.
- Gestos y botones equivalentes; si hay más opciones que slots, navegar selección sin perder destinos.
- Pruebas posteriores de dos usuarios: NPC/estado según alcance, botín compartido en carrera, turnos y reconexión. Aislar visibilidad y reglas PvP.
- Content validator comprueba referencias, acciones únicas por slot, salidas válidas y condiciones; no probar todos los sistemas completos en v0.0.2.
- Para el primer prototipo basta una transición pequeña entre dos situaciones; expansión gradual a las cuatro familias según ROADMAP. No implementar un mundo completo ni Supabase en ese hito.

## 8. Próximos bloques de diseño

Ya documentados [WORLD.md](WORLD.md), [WORLD_EVENTS.md](WORLD_EVENTS.md), [CHARACTERS.md](CHARACTERS.md), [COMBAT.md](COMBAT.md), [INVENTORY.md](INVENTORY.md), [HOUSING.md](HOUSING.md) y [DUNGEONS.md](DUNGEONS.md). Pendientes detalle de NPC, LOOT, ECONOMY, QUESTS y reglas específicas de cada subsistema. Registrar decisiones explícitas sin convertir propuestas en requisitos. Mantener GDD original intacto.
