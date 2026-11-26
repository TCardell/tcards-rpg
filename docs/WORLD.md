# Mundo abierto, servidores y navegación

Estado: diseño acordado parcialmente, 2026-11-26. No implementado. Los ejemplos y mecanismos técnicos son propuestas salvo requisitos explícitos.

## Requisitos
- Empezar con un único mundo funcional; arquitectura preparada para múltiples mundos. Cada servidor es un mundo independiente, con nombre, características, identidad y estado persistente propios. Pueden compartir definiciones de contenido y tener regiones o elementos similares, sin compartir automáticamente su estado.
- Jerarquía de lugares: continentes, regiones, ciudades/poblados, calles/plazas, edificios y habitaciones; otros lugares naturales, rutas, cuevas y mazmorras forman parte del mismo modelo. No todos los niveles tienen que existir en cada rama.
- Cada lugar visitable dispone de conexiones hacia otros lugares, NPC, objetos, accesos, actividades y acontecimientos según contexto. Explorar libremente, volver a sitios anteriores y elegir otras rutas. No confundir la jerarquía de pertenencia con las conexiones transitables.
- Las propiedades personales y los cementerios existen físicamente en el mundo y pueden visitarse; ver HOUSING.md y CHARACTERS.md.
- Viajes ágiles, con animación breve entre ubicaciones y posibles encuentros intermedios; no imponer esperas reales largas para viajes ordinarios. A pie, caballo, caravana, barco o teletransporte como medios posibles, sin fijar desbloqueos/costes.
- Puntos físicos de encuentro para observar/buscar amigos y otros aventureros presentes; ver SOCIAL.md.
- Narrativa por mundo. Ambientación inicial de fantasía medieval clásica con cierta oscuridad y misterio; no fijar lore universal.
- Mundo vivo sincronizado con reloj real, incluso sin jugadores conectados; ver WORLD_EVENTS.md.

## Modelo propuesto
Un mundo lógico (worldId) no requiere una máquina independiente. Supabase puede alojar varios mundos con aislamiento estricto por membresía y alcance. Separar catálogo versionado de localizaciones, conexiones y NPC de las instancias y estados de cada mundo. Mantener IDs estables para destinos y ubicaciones; una propiedad nueva o una puerta de mazmorra puede añadir un nodo sin rehacer todo el mapa.

Cada nodo tiene tipo, nombre, padre opcional, contexto ambiental, enlaces/entradas, puntos de interés y referencias de contenido. Una conexión tiene origen, destino, condiciones y posible coste/tiempo; no inferir que el padre o un vecino es transitable sin enlace. Permitir rutas bidireccionales o dirigidas con justificación (salto, puerta, salida). La carta de lugar representa opciones reales del grafo. Si hay más de seis, ofrecer submenús/listas sin ocultar salidas conocidas. Consultar mapa no mueve al personaje. Al entrar en diálogo/combate, conservar contexto de retorno cuando proceda.

Ejemplo ficticio: continente > región > ciudad > plaza > taberna > habitación. La plaza conecta con mercado, iglesia, castillo y puerta sur; la puerta enlaza con sendero, bosque y cueva. Otro mundo puede reutilizar esa plantilla con estados, habitantes y nombres diferentes. No implica lore definitivo.

## Aislamiento y mapa
Propuesta: cada personaje pertenece inicialmente a un mundo, y el inventario, economía, propiedades, tumbas, acciones y expediciones se limitan a ese alcance. No introducir transferencias entre mundos sin reglas aprobadas. El mapa puede tener escalas (región, ciudad, edificio) y mostrar ubicación, caminos y puntos conocidos; descubrimiento y niebla de exploración pendientes. Separar información pública del mundo de descubrimientos privados. Generación inicial o ampliación procedural posible, no obligatoria en todos los lugares.

## Pendiente
Creación/configuración de mundos (plantillas, semillas, tamaño, permisos y reglas), medios y reglas concretas de viaje rápido, encuentros de camino, teletransporte, alcance de mapa, viajes entre continentes y mundos, actualización de contenido en partidas activas. No fijar todavía el tamaño del mapa ni lore. Modelo híbrido de regiones prediseñadas/procedurales, configuración del propietario y generación de nuevos mundos quedan para más adelante; no implementar ahora selector complejo ni generador de continentes. Comprobar grafo alcanzable, retornos válidos y rutas no bloqueadas involuntariamente.

## Aceptación futura
Dos mundos con misma definición de plaza conservan estados separados; usuario no autorizado no lee ni modifica otro mundo. Se puede visitar edificio, habitación, volver a plaza y tomar otra ruta; mapa no consume carta. Añadir propiedad visitable sin reescribir rutas existentes. Ver CARDS.md, WORLD_EVENTS.md, HOUSING.md y MULTIPLAYER.md.
