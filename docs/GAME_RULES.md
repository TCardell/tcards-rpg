# Reglas — borrador de diseño

## Bucle
Explorar → encuentro/diálogo/combate → resolver → botín/experiencia → equipar/vender/descansar → explorar. Mundo conectado mediante grafo; cada ubicación tiene cartas y NPC. Viaje y exploración no obligan a participar en una mazmorra. No se penaliza desconexión ordinaria.

## Cartas
Ver [CARDS.md](CARDS.md). Cuatro familias acordadas: localizaciones con destinos, NPC con conversaciones de varias cartas, enemigos con vida/ataque/defensa y combate por turnos, objetos encontrados con recoger/dejar. La carta surge del contexto y de las decisiones, no de una baraja universal. Los detalles de reglas y transiciones se desarrollarán por subsistema.

Seis acciones contextuales, con opciones visibles antes de confirmar: farLeft, left, up, right, farRight, down. No toda carta requiere seis. Intensidad es horizontal; vertical independiente. La carta pendiente existe en estado del juego, con instancia estable. Abrir inventario, mapa, social o personaje no altera la instancia ni consume turno. Equipar/consumir en combate puede ser un comando que cueste turno según reglas explícitas. Evitar dobles envíos; el cliente conserva una decisión pendiente hasta respuesta.

## RPG
Personaje con atributos, vida, energía, experiencia, equipo, monedas y efectos. Valores y clases exactos por decidir. Inventario por espacios y pilas; objetos con ID de definición y, si únicos, ID de instancia. Loot frecuente y rarezas claras, sin cajas de pago. Una moneda inicial (oro), tiendas con precios y existencias; compra/venta atómica. NPC con relación y diálogos condicionales. Evitar economía compleja antes de probar el bucle.

## Mazmorras
Individual/tutorial, cooperativa PvE, competitiva PvP/PvPvE y cooperativa con duelo final anunciado antes de entrar. Dificultad por plantilla/reglas; semillas por instancia. Recompensas únicas por resolución, recuperación de sesión, reglas de derrota y abandono explícitas. Coop y competición síncronos o asíncronos mediante turnos. No equilibrar PvP con equipo de modo local manipulado.

## Pendiente
Fórmulas, clases, escala de nivel, muerte, tiempos, botín, precios y fairness se concretarán con pruebas. El GDD orienta; este documento se actualiza al aprobar decisiones.
