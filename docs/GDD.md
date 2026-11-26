# RPG DE MUNDO ABIERTO
## Documento maestro de diseño y arquitectura

**Versión 0.1 · Propuesta técnica inicial · 26 de noviembre de 2026**

Guía de diseño, implementación, operación y evolución de un RPG web de fantasía, con interacción mediante cartas y mundos privados multijugador.

## 0. Resumen ejecutivo

El proyecto propone un RPG de mundo abierto que utiliza cartas deslizables como interfaz principal. El jugador crea su personaje, viaja entre ubicaciones, conversa con NPC, comercia, obtiene botín, equipa objetos y participa en aventuras procedimentales. Puede jugar solo o invitar a amigos a un mundo persistente. No es un juego de cartas coleccionables: cada carta representa una situación del mundo, y sus gestos son comandos que modifican el estado de un RPG real.

La propuesta combina un mapa fijo y ampliable, con ciudades, pueblos, tabernas, hostales, iglesias, castillos, cuevas y catacumbas, con aventuras instanciadas generadas a partir de plantillas. Las mazmorras admiten cuatro modalidades básicas: individual, cooperativa, competitiva y cooperativa con enfrentamiento final. La economía empieza con oro, comercios NPC y botín; el inventario y equipamiento tienen una interfaz independiente que no consume ni sustituye la carta pendiente.

**Recomendación central.** Construir un monorepositorio TypeScript en GitHub, una aplicación web estática con Vite y un backend Supabase (Auth, PostgreSQL, Realtime y Edge Functions). PostgreSQL es la fuente de verdad. Las reglas complejas se ejecutan en un motor puro en el servidor; un mecanismo transaccional aplica los cambios con control de concurrencia. Realtime comunica revisiones confirmadas, pero nunca sustituye a la base de datos. El modo local, si se desarrolla, utiliza el mismo motor con almacenamiento IndexedDB y no permite introducir bienes manipulables en mundos online.

**Meta inicial:** un mundo privado por invitación, 2 jugadores en una expedición, guardado después de cada decisión, recuperación tras recarga o pérdida de conexión, un combate, botín y una carta pendiente que se conserva al consultar la mochila. Solo después conviene aumentar el contenido. La primera versión de contenido puede aspirar a 2 poblados, 20 NPC, 50 objetos, 12 enemigos y 4 plantillas de mazmorra; son metas orientativas, no compromisos.

**Coste:** objetivo de 0 EUR/mes para una alfa privada de 2 a 8 amigos (prueba de carga a 20 concurrentes). Los planes gratuitos tienen límites y no garantizan disponibilidad permanente. Supabase puede pausar proyectos inactivos; debe existir una estrategia de copias externas y recuperación. GitHub no ejecuta un servidor persistente. Un dominio propio es opcional. Si el servicio crece, se migra a un plan de pago o a otro backend sin alterar las reglas esenciales.

**Riesgo principal:** no la interfaz de cartas, sino la coherencia de la economía y el mundo cuando dos clientes actúan simultáneamente, las desconexiones y los cambios de versiones. El diseño previene duplicación de botín, acciones repetidas, pérdida de partidas y acceso a datos ajenos mediante transacciones, identificadores únicos, permisos y pruebas automatizadas.

**Resultado esperado:** un producto que pueda evolucionar durante años sin reiniciar mundos, mediante contenido declarativo, migraciones de datos y expansiones versionadas. Este documento es una propuesta de trabajo; todavía no se ha desarrollado ni probado el software ni contratado infraestructura.

## 1. Visión, alcance y decisiones de producto

### 1.1 Pilares

- Libertad: el jugador decide a dónde ir; las aventuras son opcionales y pueden abandonarse siguiendo reglas explícitas.
- Inmediatez: una carta, una situación, acciones legibles; no hay que dominar un teclado ni navegar menús complejos.
- Persistencia: los personajes y sus historias existen aunque nadie esté conectado. No se penaliza por no iniciar sesión cada día.
- Progresión: obtener equipo, explorar y desbloquear capacidades abre opciones, no solo aumenta números.
- Multijugador voluntario: los amigos pueden participar en el mismo mundo sin tener que realizar todo juntos.
- Expansibilidad: incorporar un NPC o una nueva cueva normalmente es añadir datos, no tocar el código central.

### 1.2 Alcance y límites de la primera etapa

El objetivo es un RPG de navegador, adaptable a móvil y ordenador, para comunidades privadas pequeñas. No se pretende inicialmente crear un MMO masivo, chat de voz, navegación 3D, combate de reflejos, un sistema bancario complejo, economía entre mundos, comercio con dinero real ni un mundo simulado segundo a segundo. Tampoco se requiere una API de IA generativa en el juego. Se puede escribir contenido con ayuda de IA durante el desarrollo y distribuirlo como datos revisados.

Un jugador solo puede utilizar un mundo online privado sin invitar a nadie; esta es la manera más económica de ofrecer modo individual y multijugador con las mismas reglas. El modo offline completo es opcional, se desarrolla después de comprobar el flujo online. La partida offline y la online son perfiles separados. No se debe presentar una caché de la partida online como un modo offline en el que se pueda seguir ganando oro.

### 1.3 Decisiones pendientes de diseño

Antes de fijar el contenido se deben decidir la ambientación y tono, las razas y clases, la política de muerte, el grado de dificultad, el tamaño máximo de grupo, los límites de inventario, la pérdida de equipo, el calendario del mundo y el tratamiento de jugadores desconectados. El documento adopta valores iniciales modificables y no pretende cerrar esas decisiones creativas. La versión inicial evita muerte permanente y PvP fuera de instancias consentidas.

## 2. Experiencia del jugador y diseño de interfaz

### 2.1 Pantallas y navegación

La navegación principal dispone de Aventura, Mapa, Mochila, Personaje y Social. Aventura muestra la carta activa, ubicación, estado del personaje, acciones disponibles y una breve descripción. El mapa muestra ubicaciones descubiertas y rutas disponibles; seleccionar una ruta abre una carta de viaje o un diálogo de confirmación. La mochila ofrece cuadrícula, filtros, comparación y acciones de objeto. Personaje muestra atributos, equipamiento, habilidades, efectos y misiones. Social incluye amigos, invitaciones, grupo y estado de expediciones. Ajustes controla idioma, sonido, sensibilidad, tamaño de texto, accesibilidad y sesión.

Los seis gestos son izquierda corta, izquierda larga, derecha corta, derecha larga, arriba y abajo. No todas las cartas necesitan seis opciones. Los movimientos largos deben estar claramente diferenciados y no activar por error decisiones irreversibles. La dirección no equivale siempre a moralidad; en una carta de combate puede representar atacar o defender, y en una taberna comprar o hablar. Mostrar las acciones disponibles antes de deslizar, y resaltar la opción en el lado opuesto al desplazamiento cuando sea útil para conservar legibilidad.

### 2.2 Motor de gestos reutilizable

Separar gesto, animación y semántica. El componente recibe la carta y sus opciones; devuelve un actionId, nunca altera puntos de vida ni genera premios. Usar Pointer Events, captura del puntero, umbral de desplazamiento proporcional a la pantalla, zona muerta, histéresis y cancelación por pointercancel. Ajustar touch-action únicamente en la zona interactiva; conservar scroll del resto de la página. Tras confirmar el gesto, bloquear nuevas entradas hasta la respuesta; si falla, recuperar la carta sin consumirla. La animación puede anticipar el gesto, no el resultado del servidor.

Botones equivalentes y teclado (flechas, combinaciones para gestos largos) permiten jugar sin deslizar. Para acciones destructivas, confirmación explícita en PvP, compra costosa o descarte de un objeto valioso. Respetar prefers-reduced-motion, tamaños táctiles adecuados, contraste, lectores de pantalla y navegación por foco. No utilizar color como única señal. Pruebas en Safari móvil, Android Chrome y escritorio.

### 2.3 La carta pendiente como estado persistente

La carta activa no es una variable efímera de React ni un elemento de un mazo que se vuelve a sortear cada vez que se monta la vista. Es una instancia identificada por pending_card_id, asociada al personaje o turno, con plantilla, revisión, contexto, opciones autorizadas, versión de contenido y, si corresponde, tirada reservada. Se recupera al cargar la partida.

Abrir la mochila, cambiar de pestaña o cerrar el navegador no consume la instancia. Consultar objetos no es una acción del mundo. Equipar y usar un objeto sí pueden modificarlo: fuera de combate son acciones independientes que conservan el identificador de la carta y recalculan opciones legalmente; en combate pueden requerir gastar un turno. Si una opción deja de ser válida, el servidor devuelve la carta revisada con explicación, sin permitir repetir una tirada. Un turno multijugador puede avanzar mientras la mochila está abierta; al regresar se muestra la situación actual y se informa del cambio. No se congela el mundo para un jugador que no está mirando la carta.

## 3. Mundo abierto y modelo de localizaciones

### 3.1 Mapa fijo, experiencias variables

Representar el mundo como grafo: nodos de localización y aristas de conexión. Una región contiene poblados, castillos, cuevas y caminos; un pueblo contiene servicios (taberna, tienda, hostal, herrería e iglesia). Los nodos tienen identificador permanente, nombre, región, coordenadas de mapa opcionales, etiquetas de bioma, nivel recomendado, servicios, reglas de seguridad, NPC, encuentros y conexiones. No es imprescindible una cuadrícula de movimiento ni un motor físico.

El mapa está escrito a mano para lograr una geografía reconocible; la variedad procede de encuentros, inventarios, rumores, clima y mazmorras. Un camino puede ofrecer varios acontecimientos según bioma, hora, nivel, clima y estado del mundo. Viajar consume tiempo del juego, no obliga a esperar minutos reales. El jugador llega al destino cuando se resuelve el viaje. Si se desean expediciones de varios días reales, se reservan para actividades opcionales posteriores.

### 3.2 Persistencia, visibilidad y aislamiento

Hay tres capas: catálogo de contenido (igual para todos los mundos de una versión), estado del mundo (existencias de tiendas, puertas, eventos globales, reputación de facciones) y estado personal (mapa descubierto, relaciones, misiones, inventario). Descubrir un lugar no tiene por qué revelarlo a todos. Algunos descubrimientos pueden compartirse expresamente. Cada consulta de datos compartidos se filtra por mundo y pertenencia.

Las ciudades son espacios sociales seguros; las mazmorras son instancias separadas del mundo. Un mismo lugar puede alojar varias expediciones simultáneas sin que los grupos interfieran. La exploración individual no exige sincronización permanente con otros jugadores. Ver a un amigo en la taberna puede ser una presencia aproximada o un estado persistente de ubicación, claramente diferenciado de estar conectado.

### 3.3 Tiempo y evolución del mundo

No ejecutar un bucle perpetuo para cada NPC. Guardar timestamps de servidor y aplicar cambios al leer o interactuar: por ejemplo, stock de tienda que se repone cada cierto intervalo, alquileres o descansos. Para efectos globales se utiliza una tarea programada corta y acotada. Una marca last_processed_at permite reanudar sin aplicar dos veces un mismo intervalo. Limitar el número de ciclos acumulados tras semanas de inactividad y definir reglas de recuperación. No basar cronómetros en el reloj modificable del dispositivo.

## 4. Personajes, reglas y progresión

### 4.1 Creación y atributos

La creación mediante cartas pregunta por linaje, origen, vocación y motivación; las respuestas asignan una plantilla de atributos iniciales, habilidades, equipo y trasfondo. Antes de confirmar se muestra resumen editable. Se recomienda empezar con tres arquetipos (guerrero, explorador, mago) y seis atributos discretos: fuerza, destreza, inteligencia, percepción, carisma y resistencia. Evitar clases con mecánicas exclusivas hasta que el combate compartido funcione.

Separar atributos base, modificadores de equipo, estados temporales y estadísticas derivadas. La vida máxima o el daño se calculan a partir de una función de reglas versionada; no permitir que el cliente escriba valores derivados. Guardar experiencia, nivel y puntos gastados; desbloquear habilidades con requisitos explícitos. Evitar multiplicadores acumulativos sin límite. Establecer tablas de progresión y probar sus extremos.

### 4.2 Resolución de acciones

Cada opción declara requisitos, coste, prueba de habilidad y efectos permitidos. El motor valida disponibilidad, elige un resultado por reglas y devuelve cambios y eventos. Una prueba puede ser d20 + modificador contra dificultad; un 1 o 20 natural solo tiene efecto especial si se define. Mostrar probabilidades comprensibles cuando sea conveniente, pero no revelar resultados futuros o información que pertenezca a otros jugadores. Ejemplo provisional: una prueba con modificador +3 contra dificultad 14 requiere 11 o más en d20, 50% de éxito sin otras reglas.

Combatir es una máquina de estados: preparación, selección de acciones, resolución, efectos de final de turno y resultado. Un turno puede ser individual o conjunto. Acciones de ejemplo: ataque básico, ataque fuerte, bloqueo, esquiva, magia, retirada y uso de objeto. Cada acción define energía, objetivo y prioridad. Reglas sobre objetivos muertos, ausencia de maná, resistencia, inmunidades y orden de resolución deben ser deterministas. El servidor es responsable de las tiradas.

### 4.3 Derrota, retirada y equilibrio

Propuesta inicial: derrota individual fuera de mazmorra devuelve al personaje a un lugar seguro con penalización moderada; derrota en expedición termina la participación o activa rescate si las reglas lo permiten. No perder equipo esencial de manera irreversible en la alfa. PvP utiliza reglas de pérdida separadas y visibles al entrar. Prevenir estrategias dominantes con límites de curación, coste de habilidades, mitigación acotada, diversidad de enemigos y recuperación equilibrada. Simular combates con semillas reproducibles para medir duración, probabilidad de victoria y consumo de recursos antes de publicar contenido.

## 5. Inventario, botín y economía

### 5.1 Inventario y equipo

Separar definición del objeto (item_def_id, nombre, tipo, icono, rareza, requisitos, efectos, precio base, límite de pila) de instancia (item_instance_id, propietario, cantidad, modificadores, durabilidad si existe). Las instancias tienen identidad única, incluso si dos espadas son visualmente idénticas. Para consumibles apilables puede usarse una fila por tipo y variante con cantidad positiva. Los huecos equipados referencian instancias propias y no se duplican en la mochila como unidades distintas.

MVP: 20 espacios orientativos; consumibles apilables; arma, armadura y accesorios con reglas de compatibilidad; equipar, desequipar, consumir, vender, inspeccionar y descartar. Comparación de estadísticas y avisos de mochila llena. Cuando el botín no cabe, se registra como recompensa pendiente o cofre temporal con política de caducidad claramente visible, no se pierde por un fallo de interfaz. Las recompensas pendientes pueden reclamarse una sola vez. No utilizar peso y durabilidad a la vez en el MVP.

### 5.2 Tablas de loot

Enemigos, cofres, eventos y misiones apuntan a tablas de botín con pesos, cantidades, nivel y condiciones. El motor selecciona mediante aleatoriedad autorizada y crea instancias al confirmar la recompensa. La rareza no debe sustituir al equilibrio: una pieza común útil puede ser mejor para determinada clase que una pieza rara. Añadir garantía de recompensa mínima y límites de explotación por encuentro o expedición. Los modificadores procedimentales se eligen de listas compatibles (no una espada con atributo reservado a una poción).

En cooperativo, botín personal por participante simplifica conflictos. Los cofres compartidos pueden introducirse después con reparto por necesidad, tirada o acuerdo, siempre aplicados por servidor. En PvP, recompensas de clasificación o de instancia antes que robar inventario completo. Definir si los objetos de la expedición son temporales hasta extracción o permanentes desde que se reclaman.

### 5.3 Economía y prevención de inflación

Empezar con una moneda entera (oro), compra y venta a NPC, recuperación en hostales y costes de servicios. Precios definidos por catálogo y modificadores acotados del mundo; compra y venta no pueden generar beneficio mediante un bucle trivial. Registrar movimientos de oro en un libro de transacciones: cantidad con signo, motivo, origen, actor, mundo, timestamp y command_id. El saldo se actualiza en la misma transacción. No usar coma flotante para moneda.

El ciclo es explorar -> obtener botín -> equipar o vender -> prepararse -> explorar más lejos. Los sumideros de oro son alojamiento, consumibles, servicios y equipo; las fuentes son misiones, loot y venta. Monitorizar oro generado y retirado, saldo mediano y percentiles, bienes de alta rareza y precios efectivos. Evitar precios dinámicos globales prematuros. Para comercio entre jugadores, usar oferta aceptada por ambas partes, reserva de objetos, expiración y transferencia atómica; no existe un estado intermedio en el que ambos poseen el mismo objeto.

## 6. NPC, conversaciones, misiones y servicios

Un NPC tiene definición estable y estado limitado: nombre, retrato, rol, ubicación, diálogo, servicios, stock, horarios opcionales y etiquetas de personalidad. La relación con cada jugador se guarda aparte. Un comerciante no necesita ejecutar lógica de decisión todo el tiempo: al abrir su ficha, el motor consulta el stock, reputación, progreso de misión y reglas actuales.

Las conversaciones son grafos de nodos de diálogo con acciones y condiciones. Las cartas muestran opciones contextuales: preguntar por rumores, negociar, aceptar un encargo, comprar, vender o despedirse. Un tabernero puede revelar una cueva si el personaje completó un objetivo; una herrera puede ofrecer una pieza especial si se alcanzó una reputación. Evitar que todo diálogo se bifurque infinitamente; usar nodos reutilizables y estados de misión.

Las misiones tienen id, versión, objetivos verificables, prerrequisitos y recompensa idempotente. Un objetivo puede contar enemigos derrotados, ubicación visitada o entrega de un objeto. El motor escucha eventos de dominio (EnemyDefeated, LocationDiscovered, ItemDelivered) y actualiza progreso; no depende de que el usuario abra la pantalla de misiones. Estados: disponible, aceptada, en curso, completada, reclamada, fallida o abandonada. Diferenciar misión personal y misión de mundo. Un NPC retirado por una actualización no debe bloquear una misión antigua: mantener un sustituto o cierre compatible.

## 7. Mazmorras y generación procedural

### 7.1 Instancias y modos

Cada entrada crea o recupera una instancia con id, mundo, plantilla, modo, dificultad, participantes, semilla privada, versiones del generador y reglas, fecha, estado y recompensa. Un personaje solo puede pertenecer a una expedición activa que lo comprometa; otras aventuras pueden ser desafíos independientes sin afectar inventario. El mundo conserva la puerta o lugar; la instancia conserva salas y decisiones particulares.

| Modo | Participantes iniciales | Resolución y reglas |
|---|---|---|
| Individual | 1 | PvE; tutorial y aventura; sin esperas por otros. |
| Cooperativo | 2–4 | Objetivo común, acciones individuales, botín personal. |
| Competitivo asíncrono | 2–8 | Misma prueba, clasificación por reglas y semilla controlada. |
| Competitivo directo | 2–4 | Duelo o PvPvE por turnos con consentimiento. |
| Cooperativo con final PvP | 2–4 | Fase PvE seguida de fase competitiva declarada desde la entrada. |

La traición no debe aparecer por sorpresa en mazmorras cooperativas normales. En las de enfrentamiento final, el estado de la partida pasa de COOP a FINAL_PVP según un disparador fijo. Definir si se restauran parcialmente vida y energía, qué bienes pueden perderse, qué ocurre con un jugador que abandona y cómo se resuelven empates. Una opción de diseño interesante es un premio común por llegar y otro exclusivo para el vencedor. Para una variante de pacto, todos confirman la división en un turno especial.

### 7.2 Algoritmo de generación

1. Elegir plantilla compatible con modo, dificultad, región y tamaño de grupo.
2. Crear una semilla aleatoria en servidor y fijar versión del PRNG y del generador. Para concursos, fijar reglas, contenido, condiciones iniciales y criterios de desempate; no exponer la semilla si permite anticipar botín.
3. Generar camino principal conectado con inicio, salas de transición, objetivo y salida. Agregar bifurcaciones, opcionales, atajos y bucles limitados.
4. Asignar encuentros según presupuesto de dificultad, etiquetas de sala, nivel y tamaño del grupo. Las llaves y recursos obligatorios se sitúan antes de la puerta que los requiere.
5. Validar conectividad y alcanzabilidad con búsqueda en anchura o recorrido de estados que incluya llaves, puertas y objetivos. Comprobar límites de recursos y compatibilidad de criaturas; no basta con comprobar que el grafo está conectado.
6. Si falla, regenerar hasta un máximo definido (p. ej. 10 intentos) y usar una plantilla manual segura. Guardar resultado o grafo materializado, semilla y versión. La semilla sola no garantiza continuidad si el código cambia.

El generador no tiene que escribir narrativa con IA. Una plantilla de cripta puede combinar 6–12 salas, distintas trampas, un jefe, un objetivo, variantes de descripciones y tablas de botín. La identidad procede de reglas temáticas y acontecimientos manuales, no de mezclar todo indiscriminadamente. Cada sala tiene encuentros compatibles, y algunas cartas pueden depender de decisiones de salas anteriores.

### 7.3 Dificultad y jugabilidad

Usar niveles I a VI como categoría visible y un presupuesto interno de amenaza. Ajustar vida de enemigos, número de encuentros, complejidad de patrones, coste de recursos y probabilidad de recompensas. No multiplicar indiscriminadamente estadísticas con el número de jugadores: se vuelve monótono. Considerar composición y nivel del grupo sin anular por completo la progresión. Indicar nivel recomendado y advertir si una instancia es especialmente peligrosa.

Los desafíos semanales pueden usar una plantilla compartida y equipamiento normalizado para asegurar equidad, o aceptar personajes propios en categorías de nivel. Una clasificación por tiempo real penalizaría a quien juega asíncronamente; usar número de turnos, recursos y objetivos, o separar rankings. Las diferencias de latencia no deberían decidir victorias en combates de cartas.

## 8. Arquitectura recomendada

### 8.1 Una sola fuente de verdad

Cliente web (Vite + TypeScript; React opcional) -> HTTPS API / Supabase Edge Functions -> PostgreSQL transaccional -> Realtime privado -> clientes. El motor de dominio es un paquete TypeScript puro compartido para simulación y pruebas, pero su ejecución en el navegador no es autoridad online. Auth identifica al usuario. El servidor valida la identidad, acceso al mundo, acción y estado. PostgreSQL guarda los resultados confirmados.

Recomiendo una arquitectura de monolito modular, no microservicios. El motor organiza módulos de combate, inventario, economía, exploración, misiones, expediciones y administración. Los módulos no escriben libremente en tablas de otros módulos: producen comandos o cambios de dominio explícitos. Un servicio orquestador aplica todos los cambios de una acción como una unidad. Las funciones puras no usan fetch, Date.now ni Math.random directamente; reciben un reloj y una fuente de aleatoriedad inyectables. Esto permite pruebas reproducibles.

### 8.2 Cómo combinar TypeScript y PostgreSQL sin transacciones ficticias

El backend necesita atomicidad real. La opción recomendada para un equipo pequeño es calcular una propuesta de cambios en una Edge Function confiable y enviarla a una única función PostgreSQL interna de commit, no encadenar llamadas REST independientes. La lectura inicial obtiene una instantánea consistente de entidades y revisiones. La Edge Function valida y calcula con el motor puro. El commit bloquea las filas relevantes, verifica revisiones de todas las entidades leídas, pertenencia, permisos, idempotencia y restricciones, y aplica el conjunto de cambios completo. Si cambió algo, rechaza con conflicto y el backend reevalúa o devuelve estado actualizado. El commit no es accesible a anon ni authenticated; solo el backend privilegiado puede llamarlo. Validar explícitamente el actor y restringir la función a efectos conocidos, no SQL dinámico arbitrario. Las claves y el código privilegiado nunca se envían al navegador.

Una alternativa válida es mover todas las reglas críticas a funciones SQL y ejecutar un único RPC transaccional autenticado; resulta sencillo al principio, pero mantener un motor RPG complejo en PL/pgSQL puede ser menos cómodo. Otra alternativa es un backend Node con un pool de conexiones PostgreSQL y una transacción por comando; ofrece más libertad y control, a cambio de gestionar alojamiento, pool y ejecución. Elegir una implementación, no mezclar las tres. Si se usa un driver directo en serverless, utilizar pool apropiado al modo de ejecución y probar compatibilidad; no mantener transacciones abiertas mientras se espera interacción humana.

### 8.3 Comparación de infraestructura

| Opción | Ventajas | Límites y uso propuesto |
|---|---|---|
| GitHub Pages + Supabase | Pocas piezas; Auth, SQL y Realtime integrados | Pages estático y repositorio público en Free; pausa por inactividad. Recomendación inicial si el código puede ser público. |
| Cloudflare Pages + Supabase | Permite separar alojamiento de repositorio; despliegues de preview | Segundo proveedor; comprobar acceso e integración de repo privado; mismo backend. |
| Cloudflare Workers + Durable Objects | Salas y WebSockets gestionados; hibernación | Persistencia distribuida, autenticación y consistencia entre objetos más complejas. Alternativa si la latencia/salas lo exigen. |
| Node/Fastify + PostgreSQL | Transacciones directas, portabilidad y control | Requiere hosting de proceso, seguridad, backups, pool y gestión de disponibilidad. Posible evolución. |

El código debe depender de interfaces de repositorio, autenticación y notificación, no de Supabase dentro de las reglas puras. No construir un sistema de sockets propio si Realtime satisface el juego por turnos. No duplicar datos de autoridad entre Durable Objects y PostgreSQL sin un protocolo de reconciliación. Si se migra, usar ventana de solo lectura, copia comprobada, cambio de escritor y verificación; nunca tener dos escritores independientes para inventario.

## 9. Modelo de datos y persistencia

### 9.1 Tablas fundamentales (esquema lógico)

| Tabla | Campos esenciales y propósito |
|---|---|
| profiles | user_id (Auth), alias, preferencias; sin correo expuesto a otros. |
| worlds | id, owner_id, name, status, content_release, rules_version, revision. |
| world_members | world_id, user_id, role, status; clave única por pareja. |
| invitations | world_id, token_hash, expiry, uses, revoked_at; consumo atómico. |
| characters | id, world_id, user_id, location_id, xp, hp, gold, revision. |
| character_traits | character_id, atributo o habilidad, valor y origen. |
| items | id, world_id, owner_character_id, def_id, amount, modifiers. |
| equipment | character_id, slot, item_id; slot único, propiedad comprobada. |
| pending_cards | id, actor/instance, template_id, context, options, release, revision. |
| location_state | world_id, location_id, stock/event state, revision, timestamps. |
| npc_relations | character_id, npc_id, affinity, flags. |
| quest_progress | character_id o world_id, quest_id, status, counters, revision. |
| expeditions | id, world_id, mode, seed, graph, versions, phase, revision. |
| expedition_members | expedition_id, character_id, status, role, joined_at. |
| turns / turn_actions | expedition_id, turn_number, deadline, phase; acción única por participante y turno. |
| commands | actor_id, command_id, request_hash, result, status, created_at. |
| domain_events | scope_id, event_id, sequence, type, payload, timestamp. |
| gold_ledger | world_id, character_id, command_id, delta, reason, timestamp. |
| admin_audit | actor, scope, action, reason, before/after reducido, timestamp. |

Normalizar datos que requieren integridad (propiedad, saldo, participantes y relaciones). Usar JSONB para modificadores, contextos de carta, grafo procedural y parámetros variables, con esquema validado. Evitar un único JSON gigantesco por mundo: dificulta consultas, bloquea a todos los jugadores y multiplica escrituras. Tampoco crear una tabla para cada variante de carta. Las claves foráneas y restricciones deben incluir el ámbito del mundo cuando corresponda; un objeto no puede pasar accidentalmente a un personaje de otro mundo.

### 9.2 Persistencia y eventos

Guardar tras cada comando confirmado, no solo al salir de la página. Estado actual relacional más un registro acotado de acontecimientos importantes es preferible a event sourcing completo para una alfa: permite reconstruir incidentes sin exigir reproducir toda la historia desde el principio. Conservar eventos críticos (oro, objetos raros, sanciones y resultados) durante un periodo definido; archivar o depurar eventos de animación y presencia. Las revisiones crecen de manera monotónica por entidad o instancia.

Índices: (world_id, user_id), (world_id, location_id), (owner_character_id), (expedition_id, turn_number), (scope_id, sequence), caducidad de invitaciones y estado de expediciones. Restricciones de saldo no negativo, cantidad positiva, unicidad de recompensa y membresías. Las migraciones se guardan en SQL versionado. Evitar borrar físicamente entidades referenciadas por partidas; usar estado archivado cuando sea posible.

## 10. Protocolo de acciones, concurrencia y sincronización

### 10.1 Contrato de cliente-servidor

El navegador envía la intención, no el resultado. Ejemplo de solicitud (contrato ilustrativo, no implementación):

```json
{
  "commandId": "uuid-generado-una-vez",
  "type": "ChooseCardAction",
  "characterId": "uuid-personaje",
  "worldId": "uuid-mundo",
  "cardId": "uuid-carta-pendiente",
  "actionId": "attack_basic",
  "expectedRevision": 42
}
```

El servidor deriva userId del JWT, nunca de un campo confiado del cuerpo. Comprueba que el mundo y personaje pertenecen al actor, que la carta sigue pendiente, que el turno permite la acción y que los requisitos son válidos. La respuesta incluye commandId, nueva revisión, eventos permitidos, vista del personaje y nueva carta si procede. Errores distinguibles: 401 autenticación, 403 autorización, 409 estado obsoleto, 422 acción inválida, 429 límite, 503 indisponibilidad. No enviar trazas internas ni semillas secretas al cliente.

### 10.2 Algoritmo de commit e idempotencia

1. Validar JWT, formato, tamaño y permisos; buscar commandId para el actor. Si ya se confirmó con el mismo hash, devolver resultado existente. Si el identificador coincide pero el contenido cambia, rechazar.
2. Leer datos y revisiones coherentes; calcular una propuesta de resolución usando un motor versionado. La semilla y la tirada se derivan de estado de servidor, no del identificador que el jugador puede variar para buscar suerte.
3. En una única transacción, reservar el identificador único de comando, bloquear filas en un orden estable (mundo si necesario, instancia, personajes ordenados, objetos ordenados), comprobar revisiones, permisos y precondiciones. Evitar bloquear todo el mundo para una acción individual.
4. Aplicar efectos, inventario, saldo, misión, carta y evento. Guardar respuesta idempotente y revisión nueva en la misma transacción. Si falla cualquier parte, rollback completo. Ante conflicto devolver estado reciente y recalcular solo si la intención sigue siendo válida. Ante deadlock reintentar un número limitado con backoff.
5. Tras commit, notificar revisiones. Si la notificación se pierde, el cliente recupera snapshot o delta por HTTP. Una tabla outbox o Broadcast desde cambios confirmados facilita la recuperación; ninguna notificación concede recompensas.

Caso crítico: dos clientes compran el último objeto de una tienda. Ambos ven stock 1; solo el primer commit lo consume. El segundo recibe conflicto y oferta actualizada, sin perder oro. Caso de doble toque: dos peticiones con el mismo commandId devuelven el mismo resultado. Incluso si llegan dos commandId distintos, la carta consumida y la restricción de recompensa impiden obtener dos botines.

### 10.3 Realtime, presencia y recuperación

Canales privados por mundo, grupo o expedición; eventos personalizados de cambio de revisión, estado de turno y presencia. Las cartas secretas, inventarios ajenos y opciones ocultas nunca se transmiten por un canal compartido. La suscripción se autoriza por pertenencia; expulsión o cambios de rol obligan a revocar acceso y volver a autenticar/revalidar canales. Presence solo indica conexión aproximada y no es prueba de que alguien ha actuado.

El cliente registra lastSeenRevision, descarta notificaciones antiguas, detecta saltos y solicita snapshot si falta alguna. Tras recuperar conexión, renueva token si procede, recupera el estado confirmado y consulta el resultado de la acción pendiente. Si el último comando fue enviado pero no se recibió respuesta, reintenta con el mismo ID. No generar un comando distinto automáticamente. Los estados de carga, error y reconexión deben ser visibles. Usar backoff exponencial con jitter, y refrescar al volver de segundo plano. Si Realtime falla, permitir polling adaptativo de baja frecuencia en expediciones activas, no en todo el mundo.

## 11. Multijugador: reglas de sesión y turnos

### 11.1 Invitaciones y grupos

Una cuenta puede pertenecer a varios mundos. Crear mundo privado genera un código aleatorio con suficiente entropía, hash en base de datos, caducidad y límite de usos. El código no reemplaza a una cuenta autenticada. Unirse crea membresía atómica; una persona puede salir sin borrar de inmediato su personaje. El propietario puede invitar, expulsar y transferir propiedad con confirmación. No permitir eliminar el último propietario sin reemplazo. En una expedición, el líder propone entrada y los participantes confirman reglas, dificultad y posibles pérdidas. El servidor reserva plazas y crea la instancia cuando el grupo está listo.

### 11.2 Máquina de estados

Expedición: LOBBY -> READY -> ACTIVE -> COMPLETED / FAILED / ABANDONED -> SETTLED. En ACTIVE: OPEN_TURN -> COLLECT_ACTIONS -> RESOLVE -> NEXT_TURN. El turno tiene número monotónico, deadline opcional, participantes esperados y acciones únicas por jugador. La elección puede cambiarse hasta confirmación si las reglas lo permiten, pero una vez confirmada no se altera. El último participante o una tarea de expiración intenta resolver; un bloqueo y una condición de fase garantizan que solo una resolución sucede.

En combate simultáneo, cada jugador recibe su carta contextual. El servidor recoge intenciones y resuelve en orden definido (prioridad, iniciativa, desempate determinista). Los jugadores ven quién está listo, no necesariamente qué acción eligió. El servidor comprueba objetivos válidos al resolver y define fallback cuando un objetivo ya murió (por ejemplo defender o atacar otro objetivo elegible). La UI muestra el resumen de resultados y el turno siguiente.

### 11.3 En directo y asíncrono

No construir dos motores: ambos son la misma máquina de turnos con políticas distintas. Modo directo: deadline orientativo 20–45 segundos, visible mediante hora de servidor; si falta una acción aplicar una defensa automática o un pase acordado. Modo asíncrono: sin límite corto, o 12–24 horas según reglas; los amigos juegan cuando pueden. Una tarea programada y una comprobación al acceder resuelven turnos vencidos; la tarea no debe ser el único mecanismo. Si el grupo se queda inactivo, pausar o cerrar por política, no castigar sin aviso. No prometer cronómetros exactos al milisegundo con servicios serverless.

Para la primera prueba cooperativa, dos personajes y un turno sin límite obligatorio. Después probar plazo corto, simultaneidad, pérdida de red, empate, cambio de fase PvP y abandono. Un jugador desconectado no queda controlado libremente por otros: aplicar una acción conservadora o sustitución consentida. Las expediciones competitivas usan emparejamiento privado y reglas acordadas. No se permite PvP en ciudades ni saqueo de jugadores inactivos por defecto.

## 12. Guardado local, nube y recuperación ante desastres

Online: PostgreSQL es el guardado oficial; el cliente puede almacenar preferencias y caché de lectura en IndexedDB, nunca saldo autoritativo. Offline opcional: IndexedDB con un esquema versionado, transacción de escritura por comando, exportación JSON con versión y suma de comprobación para detectar corrupción accidental, importación validada y guardado de la carta pendiente. No confiar en firmas o checksums de cliente como defensa contra manipulación. IndexedDB puede ser eliminado por el navegador o el usuario; solicitar almacenamiento persistente cuando sea posible y ofrecer exportación manual.

Un cambio de dispositivo online solo requiere autenticarse y seleccionar el personaje. Tras recargar, se reconstruye la UI a partir del estado confirmado. No usar localStorage como única base de datos ni guardar secretos en los datos de exportación. Si una migración local falla, conservar la copia previa y mostrar recuperación. Si se implementa PWA, cachear recursos estáticos versionados y no almacenar respuestas sensibles sin política explícita. La actualización del service worker no debe recargar a mitad de un turno.

Copias del servidor: exportaciones lógicas regulares mediante Supabase CLI, cifradas y fuera del repositorio. Para alfa, objetivo orientativo RPO de 24 h (máximo de datos perdidos ante desastre) y RTO de 4 h de intervención (restauración), no garantías del plan gratuito. Hacer copia antes de migraciones; retención diaria de 7 días y semanal de 4 semanas, ajustada al volumen y privacidad. Probar restauración en entorno aislado, incluidos Auth, referencias, roles, funciones, objetos de Storage si los hay y configuración que no esté incluida en el dump. Guardar secretos por separado. Verificar recuentos, saldos y pruebas de acceso. Sin ensayo de restauración, una copia no es una garantía.

## 13. Formato de contenido y expansiones

### 13.1 Esquema declarativo

Separar contenido de código. Los datos se editan en JSON o YAML convertido a JSON y validado con JSON Schema/Zod. Un manifiesto enumera módulos, versión, dependencia, assets y versión mínima de motor. Identificadores con namespace (base:forest.wounded_traveller) nunca se reutilizan con otro significado. Etiquetas facilitan seleccionar cartas por bioma, tipo, nivel, fase y condiciones.

```json
{
  "id": "base:forest.wounded_traveller",
  "schemaVersion": 1,
  "type": "encounter",
  "tags": ["forest", "travel"],
  "weight": 10,
  "conditions": [{"op":"levelAtLeast", "value":1}],
  "actions": [
    {"id":"help", "gesture":"right", "label":"Ayudar",
     "effects":[{"op":"spendEnergy", "amount":5}],
     "next":"base:forest.traveller_thanks"},
    {"id":"leave", "gesture":"left", "label":"Continuar",
     "next":"system:resumeTravel"}
  ]
}
```

Es un ejemplo de formato, no código definitivo. El motor define una lista cerrada de operaciones y predicados; no evalúa expresiones JavaScript arbitrarias del contenido. Un archivo no puede cambiar oro o acceso a mundos fuera de los efectos autorizados. Las traducciones usan claves de texto; las ilustraciones se referencian por assetId. Versionar los contratos, no solo las cadenas narrativas. Para que el servidor pueda validar opciones, el catálogo publicado se carga en su entorno con hash y versión, no se confía en JSON modificado por el cliente.

### 13.2 Publicar una expansión

Crear rama, añadir manifiesto y contenido, validar esquemas y referencias, probar localmente y generar informe de cambios. Verificar conectividad del mapa, ciclos de diálogo intencionados, cartas sin salida, recompensas duplicables, dificultad, tamaños de recursos y traducciones. Publicar primero assets inmutables, después backend compatible, después cliente; activar mediante release/feature flag. Los mundos pueden permanecer en versión anterior si una expedición sigue activa. Al finalizar, migrar estados de forma explícita.

Una aventura activa guarda versión de reglas y contenido, y grafo materializado. Mantener al menos las versiones activas hasta terminar o migrar con procedimiento probado; no cargar código antiguo arbitrario. Una nueva ubicación se conecta mediante aristas y prerrequisitos. Un objeto retirado se conserva con definición archivada o se convierte mediante migración anunciada. Las expansiones pueden ser aditivas, de balance o de reglas; las últimas requieren pruebas de compatibilidad y quizá una ventana de mantenimiento.

## 14. Panel de administrador y control del mundo

### 14.1 Roles y permisos

| Rol | Alcance y funciones |
|---|---|
| Jugador | Personaje propio, mundo al que pertenece, acciones autorizadas. |
| Líder de grupo | Invitar a expedición, iniciar con consentimiento, gestión del lobby. |
| Propietario de mundo | Invitaciones, miembros, configuración del mundo, suspensión de sesiones propias. |
| Moderador de mundo | Incidencias, mensajes reportados, expulsión/suspensión según delegación. |
| Editor de contenido | Borradores, preview y validación; sin acceso a datos de usuarios de producción. |
| Operador global | Diagnóstico, incidentes, releases y mantenimiento; permisos limitados por tarea. |
| Administrador global | Gestión excepcional de roles, recuperación y operaciones de alto impacto. |

El propietario de un mundo no es administrador de la plataforma. Los roles se asignan y verifican en servidor; nunca se otorgan por un parámetro URL, un flag en localStorage o un menú oculto. La UI administrativa puede estar en la misma aplicación con ruta /admin o en aplicación separada; la protección efectiva está en API y base de datos. Para administradores, MFA y reautenticación antes de operaciones sensibles. Evitar cuentas compartidas. La clave de servicio es credencial de máquina, no una contraseña de administrador.

### 14.2 Pantallas del panel

- Inicio: salud del servicio, conexiones, errores, latencia, consumo de cuotas, expediciones abiertas, alertas de integridad y estado de backup.
- Mundos: búsqueda, miembros, invitaciones, release, modo mantenimiento, activar o desactivar PvP, configuración de tamaño y reglas; no borrar sin confirmación y política de retención.
- Personajes: vista de estado, inventario, historial y misiones. Diagnóstico de carta bloqueada, teletransporte a lugar seguro y reparación justificada. Cambios de saldo/objetos son comandos compensatorios, nunca edición silenciosa de tablas.
- Expediciones: inspección de fase, turno, acciones recibidas (respetando necesidad de acceso), deadline, participantes y versión. Forzar resolución usando reglas ordinarias, pausar o cancelar con política de devolución idempotente. No permitir seleccionar un vencedor arbitrariamente sin registro.
- Contenido: editor de cartas, NPC, lugares, objetos, tablas de loot y generadores; vista previa de seis gestos, validación de referencias, simulación y diff de releases.
- Moderación: denuncias, suspensión temporal, bloqueo de invitaciones, revocación de acceso y notas con motivo. Evitar lectura indiscriminada de conversaciones privadas.
- Operación: historial de despliegues, configuración, exportación, copias, restauraciones de prueba y registro de auditoría.

### 14.3 Auditoría y seguridad operacional

Toda acción privilegiada registra actor, rol, ámbito, motivo, valores anteriores y posteriores necesarios, timestamp, commandId y resultado. La auditoría no puede ser modificada desde los permisos ordinarios del panel. Una operación de alto impacto (borrar mundo, restaurar, conceder rol global) exige confirmación reforzada y, cuando haya dos administradores, revisión por otra persona. Conservar registros de reparación sin almacenar tokens, contraseñas ni datos innecesarios. Las correcciones de economía generan entradas de ledger compensatorias y se anuncian a los afectados cuando proceda. Si existe cuenta de emergencia, almacenarla y protegerla fuera de la UI de juego.

El panel no es una licencia para hacer trampas. En un grupo privado, indicar a los jugadores que el anfitrión puede administrar el mundo, separar entornos de prueba y producción y etiquetar personajes o recompensas creados para pruebas. El historial de una clasificación no debería incluir recompensas administrativas sin marcar.

## 15. Seguridad, privacidad y juego limpio

### 15.1 Modelo de amenazas

El navegador se considera no confiable: cualquiera puede abrir DevTools, modificar JavaScript, llamar a endpoints o repetir mensajes. El frontend solo muestra opciones; todas las mutaciones se autorizan y validan en backend. El riesgo más probable no es un ataque sofisticado, sino duplicar una acción al hacer doble clic, acceder a datos de otro mundo por un ID adivinado o dejar un endpoint administrativo expuesto.

Aplicar RLS a tablas expuestas, negar escrituras directas del cliente en tablas críticas, limitar SELECT a vistas y datos autorizados, y probar acceso cruzado. Las funciones SECURITY DEFINER deben fijar search_path seguro, calificar esquemas, revocar EXECUTE de PUBLIC y otorgar solo a roles necesarios. Un service role puede saltarse RLS: verificar identidad y membresía explícitamente antes de acceder. Validar todos los payloads y tamaños; aplicar rate limits por usuario, IP según necesidad y mundo. CORS no sustituye a la autorización. Usar HTTPS, CSP, escapar texto de NPC y jugadores, evitar HTML sin sanitizar y mantener dependencias actualizadas. No registrar credenciales ni tokens.

### 15.2 Aleatoriedad, trampas y equidad

Generar semillas con CSPRNG de servidor, usar PRNG versionado para expediciones, mantener ocultos botines futuros y objetivos secretos. Un PRNG determinista no es necesariamente criptográficamente seguro. Registrar draws o contadores y resultados para reproducir incidencias sin exponer secretos. No permitir reroll tras recargar. En clasificaciones, fijar versión, modo, equipo inicial y política antiabuso. La persistencia de progreso debe impedir repetir una recompensa cambiando el commandId. Moderar abuso con límites de acciones y revisión de señales anómalas; no sancionar automáticamente por una latencia elevada.

### 15.3 Privacidad y comunidad

Recoger alias, cuenta y datos de juego mínimos; no mostrar correo ni ubicación real. Informar qué información se comparte, quién administra mundos y cómo borrar o exportar datos. Para grupos de amigos no hace falta un chat global en MVP; invitaciones y mensajes predefinidos reducen complejidad y moderación. Si se abre el juego al público, revisar obligaciones de protección de datos (incluido RGPD si corresponde), edad, condiciones, moderación, retención y jurisdicción. No se ofrece asesoramiento jurídico. Elegir región de alojamiento adecuada y mantener inventario de proveedores. Las copias también contienen datos personales y requieren protección y caducidad.

## 16. Infraestructura gratuita, cuotas y capacidad

### 16.1 Límites comprobados en documentación oficial

La siguiente información se consultó el 26/11/2026. Las cifras son límites comerciales/técnicos publicados, no capacidad garantizada del juego. Revisar condiciones y uso real antes de desplegar. Referencias [1–14] al final.

| Servicio | Límite o condición relevante | Consecuencia |
|---|---|---|
| GitHub Pages Free [1] | Repositorio público; sitio hasta 1 GB, ancho de banda blando 100 GB/mes | Alojar interfaz y assets optimizados; ningún secreto ni backend en Pages. |
| GitHub Actions Free [2] | 2.000 min/mes en runners estándar para repos privados, sujeto a reglas | CI corta y cachés; vigilar consumo. |
| Cloudflare Pages Free [3] | 500 despliegues/mes, 20.000 archivos por sitio | Alternativa de frontend; agrupar assets pequeños. |
| Supabase Free [4–6] | 500 MB de base por proyecto, 200 conexiones Realtime pico, 2 millones de mensajes/mes, 100 mensajes/s según límites | No equivale a 200 jugadores; conexiones por pestaña y eventos por destinatario. |
| Supabase Free [4,7] | Pausa tras 1 semana de inactividad; 2 proyectos activos según plan | Usar recuperación manual y explicar indisponibilidad; no falsear tráfico para evitar pausa. |
| Edge Functions [4,8] | 500.000 invocaciones incluidas/mes; 2 s CPU, 150 s de duración en Free | No ejecutar partidas enteras en un proceso vivo; comandos cortos y generador acotado. |
| Supabase Auth [9] | SMTP incorporado restringido a miembros del equipo y 2 correos/hora | OAuth adecuado para amigos o SMTP propio; probar recuperación y confirmación. |
| Backups [10] | Exportaciones externas recomendadas en Free | Operación manual o programada y ensayo de restauración. |
| Durable Objects Free [11] | SQLite-backed disponible con límite de almacenamiento por objeto y cuota diaria de solicitudes | Alternativa posterior para salas; revisar también duración y operaciones SQL. |

GitHub Pages permite publicar un frontend sin dominio de pago. Si el repositorio debe permanecer privado y no se dispone de Pages para privados, seleccionar un hosting estático compatible con repos privados, como Cloudflare Pages, tras comprobar la integración. El código frontend desplegado es público de facto aunque el repositorio sea privado; los secretos nunca van ahí. El uso comercial de Pages tiene restricciones; si se monetiza el juego, revisar términos y migrar cuando proceda.

### 16.2 Modelo de consumo (estimaciones, no benchmark)

Escenario alfa: 8 usuarios activos diarios, 120 decisiones por usuario y día, 30 días. Son 28.800 comandos/mes. Suponiendo una Edge Function por decisión, es alrededor del 5,8% de 500.000 invocaciones; incluir login, lecturas, retries, cron y panel en medición real. Si cada comando provoca en promedio 1 aviso a 4 receptores y 1 mensaje de publicación contabilizado, serían 144.000 mensajes/mes (7,2% de 2 millones), antes de presence, reconexiones y otras lecturas. El modo individual normalmente tendrá menos receptores; este ejemplo simplificado no reproduce el contador exacto del proveedor.

Escenario crecimiento: 20 usuarios activos diarios x 200 decisiones x 30 = 120.000 comandos/mes. Con 5 mensajes contabilizados por comando, 600.000 mensajes/mes (30%). Si se emiten 10 mensajes a 20 receptores por acción, la cifra crece mucho; no difundir todo a todos. A 120.000 comandos y 2 KB por registro de comando/evento, serían aproximadamente 240 MB brutos en un mes, sin índices, tablas de personajes, TOAST ni overhead; la base de 500 MB puede agotarse pronto. No conservar telemetría detallada indefinidamente. Medir pg_total_relation_size, archivar eventos y mantener auditoría financiera suficiente. Para la alfa de 28.800 comandos, 2 KB equivalen a unos 58 MB brutos/mes.

Assets: 100 ilustraciones a 150 KB son unos 15 MB. Una descarga completa por 20 personas supone unos 300 MB; cachear versiones, cargar por demanda y evitar precargar la biblioteca completa. Las imágenes nuevas se exportan optimizadas en WebP/AVIF con alternativa cuando sea necesaria. Controlar resolución y licencias. La música y vídeo pueden dominar el tráfico: posponerlos o usar recursos ligeros.

### 16.3 Presupuesto, límites de escala y plan B

Punto de partida: 0 EUR/mes, subdominio gratuito, herramientas open source, sin API de IA dentro del juego. No es un SLA. Configurar alertas al 50%, 75% y 90% de cuotas cuando sea posible; monitorizar base, egress, funciones, autenticación y mensajes, no solo conexiones. Definir mantenimiento de solo lectura cuando no puedan garantizarse escrituras. Ante pausas, el operador reactiva y verifica salud antes de aceptar comandos. Ante saturación, reducir frecuencia de presence, agrupar eventos, archivar logs y limitar lobbies. Si persiste, evaluar plan de pago vigente o migrar a un backend PostgreSQL propio; conservar exportaciones y contratos portables. Una VPS no es gratis por definición ni elimina el coste de mantenimiento.

## 17. Repositorio, herramientas y flujo de trabajo

### 17.1 Estructura propuesta

```text
rpg-project/
  apps/web/               # cliente y panel admin
  packages/ui-swipe/      # gestos y animación
  packages/domain/        # reglas puras y tipos
  packages/protocol/      # contratos y esquemas
  packages/generator/     # procedural y validadores
  packages/content/       # cargador, esquemas, catálogo
  content/base/           # lugares, NPC, items, quests
  content/expansions/     # manifiestos y módulos
  assets/                 # imágenes optimizadas, licencias
  supabase/migrations/    # esquema, RLS y funciones
  supabase/functions/     # API de comandos y administración
  tests/                  # integración y E2E
  docs/                   # GDD, arquitectura, ADR, runbooks
  .github/workflows/      # CI y despliegue
  AGENTS.md               # reglas para agentes de código
  README.md               # instalación y uso
```

Herramientas: Git, GitHub, Node LTS compatible con dependencias, TypeScript, Vite, React si se necesita estado de UI más estructurado, Zod o JSON Schema, Vitest, Playwright, ESLint, Prettier y Supabase CLI. Docker para emular Supabase local si el ordenador lo permite; en un equipo modesto, usar un proyecto de desarrollo aislado y pruebas del motor sin contenedores. Elegir versiones concretas al iniciar y guardar lockfile; no depender de latest en CI. Mantener README con comandos reales. La IA puede programar módulos, pero el repositorio debe documentar límites, decisiones y tests.

### 17.2 Proceso de cada cambio

1. Abrir issue con objetivo, alcance, invariantes y criterios de aceptación. Crear rama pequeña desde main.
2. Implementar pruebas y cambios mínimos; validar formatos, tipos, tests unitarios, integración, RLS y UI. Ejecutar las pruebas de regresión pertinentes.
3. Abrir pull request con resumen, screenshots si hay UI, migraciones, riesgos y pasos de rollback. Revisar diff y resultados; no fusionar directamente cambios de agentes sin supervisión.
4. Desplegar preview/desarrollo con datos ficticios. Probar desde dos navegadores o móviles. Fusionar solo si cumple criterios.
5. Publicar release etiquetado. Aplicar migraciones compatibles antes de activar nuevas funciones. Confirmar métricas, smoke tests y backup. Documentar cambios en CHANGELOG y actualizar decisiones de arquitectura (ADR).

Secretos de CI se almacenan en GitHub Actions secrets o gestor del proveedor. .env.example contiene solo placeholders; .env.local y dumps en .gitignore. Una clave publicada se rota, no basta borrarla del último commit. La configuración pública (URL Supabase y publishable key) no concede permisos adicionales si RLS está bien hecha. Configurar entorno de producción y desarrollo separados; no probar cambios destructivos con cuentas reales. En repositorio privado de plan gratuito comprobar disponibilidad de reglas de protección y usar disciplina de PR incluso si alguna regla no está incluida.

## 18. Pruebas, rendimiento y observabilidad

### 18.1 Estrategia de pruebas

Pruebas unitarias para funciones de dominio: daño, experiencia, probabilidades, costes, condiciones de cartas, compatibilidad de objetos y loot. Property-based testing para miles de semillas: toda mazmorra contiene inicio y salida alcanzables; ningún saldo negativo; no se duplica item; todo turno finaliza o espera con causa válida. Fixtures deterministas y pruebas de compatibilidad de contenido. Un test de integración usa base de datos real con migraciones y verifica rollback, locks, permisos y reglas. Playwright con dos contextos independientes simula amigos y dispositivos. Pruebas manuales en móviles reales para gestos, scroll, animación y reconexión.

| Caso obligatorio | Resultado esperado |
|---|---|
| Recargar durante una carta | Mismo id y contexto, sin reroll. |
| Abrir mochila y volver | Carta conservada; equipo actualizado según reglas. |
| Repetir comando tras timeout | Una sola mutación, mismo resultado. |
| Dos compras del último objeto | Una compra; el otro saldo intacto. |
| Dos acciones en el mismo turno | Una por jugador, una resolución global. |
| Desconexión tras confirmar | Reconectar recupera resultado y turno. |
| Jugador de otro mundo | Acceso denegado por API, RLS y canal. |
| Cambio de fase a PvP | Reglas consentidas, elegibilidad y premio únicos. |
| Actualización con mazmorra activa | Se conserva versión o migración comprobada. |
| Restaurar backup en staging | Datos y acceso verificados; no afectar producción. |

Pruebas de carga con herramientas como k6 o scripts propios: usuarios autenticados ficticios, ráfagas, turnos simultáneos y pérdida de red. Evitar pruebas agresivas en producción o sin autorización. Medir p50/p95 de comandos, errores por tipo, tiempo de commit, conflictos, reconexiones, consumo y tamaño DB. Objetivos de diseño orientativos: p95 de respuesta de comando por debajo de 1 s en condiciones normales y menos de 2 s para actualización de compañeros; probar redes móviles y cold starts. Son objetivos, no prestaciones medidas.

### 18.2 Observabilidad y soporte

Logs estructurados con requestId, commandId, scope, duración y código de error; no incluir tokens ni datos privados. Métricas por modo de juego y versión. Alertas por fallos repetidos, recompensas anómalas, colas de turnos vencidos, backups antiguos y cuotas. Un panel sencillo puede consultar vistas agregadas con autorización. Para producción, definir proceso de incidente: detener comandos afectados mediante flag, conservar pruebas, identificar alcance, aplicar reparación compensatoria, comunicar, verificar y reabrir. Un rollback del frontend no revierte las migraciones de datos; diseñar cambios compatibles y preferir corrección hacia adelante cuando sea seguro.

## 19. Hoja de ruta por hitos verificables

No fijar fechas sin conocer disponibilidad, experiencia y resultados de pruebas. Una etapa termina cuando supera su criterio, no cuando se ha añadido cierta cantidad de cartas.

| Hito | Entrega | Puerta de salida |
|---|---|---|
| H0 · Diseño | ADR, contrato de acciones, esquema de contenido, repo, CI | Todos entienden autoridad y estado; tests básicos. |
| H1 · Corte vertical | Auth, mundo por invitación, personaje, carta persistente, compra/loot mínimo | Dos navegadores recuperan partida; sin doble recompensa. |
| H2 · Coop real | Grupo de 2, instancia, turno asíncrono, un enemigo, reparto | Desconectar/reconectar y resolver simultáneamente sin errores. |
| H3 · RPG base | Mapa de 2 poblados, mochila, equipo, NPC, hostal, tienda, misiones | Viaje y economía completos; carta preservada. |
| H4 · Procedural | Generador, niveles I–III, mazmorra individual y cooperativa | Miles de semillas válidas; fallback comprobado. |
| H5 · Online avanzado | Deadline directo, duelo, competición y final PvP | Pruebas de ausencia, empate y liquidación única. |
| H6 · Administración | Roles, auditoría, gestión, editor básico y backups | Pruebas de permisos, reparación y restauración. |
| H7 · Alfa privada | Contenido ampliado, accesibilidad, telemetría, pruebas 8–20 jugadores | Sin pérdida/duplicación conocida; recuperación ensayada. |
| H8 · Expansiones | Manifiestos, migración de saves, nueva región | Actualizar mundo existente sin perder progreso. |

Desde H1 implementar control de acceso y auditoría mínima; H6 amplía la interfaz, no inaugura la seguridad. El primer prototipo debe incluir online desde el inicio. El editor completo, las subastas, guilds, economía dinámica, raids de 8 jugadores, profesiones, propiedades, genealogía y eventos globales complejos quedan para después de la alfa. El modo local se incorpora cuando haya un adaptador de persistencia fiable, no como condición del H1.

### 19.1 Primer corte vertical concreto

Una localización segura (aldea), un NPC comerciante, una espada, una poción, un enemigo, una carta de combate y una recompensa. Dos usuarios crean o se unen al mundo, cada uno ve su personaje, se reúnen en lobby, confirman entrada, reciben una carta de turno, actúan y reciben recompensa persistente. Al recargar y abrir mochila, el estado se conserva. Incluir una compra con stock 1 para verificar concurrencia. Criterio de éxito: repetir cada comando y recargar en cualquier paso sin alterar el resultado confirmado. No diseñar aún el continente completo.

## 20. Registro de riesgos y respuestas

| Riesgo | Severidad | Prevención / respuesta |
|---|---|---|
| Botín duplicado o saldo inconsistente | Crítica | Transacción, idempotencia, claves únicas, ledger, tests concurrentes. |
| Acceso a mundo ajeno | Crítica | RLS, autorización por ámbito, canales privados, tests negativos. |
| Pérdida de guardados | Crítica | Commit por acción, backups externos, restauración ensayada, migraciones. |
| Jugador bloqueado por desconexión | Alta | Reintento mismo ID, snapshot, fallback de turno, soporte auditable. |
| Servidor gratuito pausado | Alta | Aviso claro, reactivación verificada, alternativa de hosting. |
| Cuotas agotadas | Alta | Medición, mensajes por ámbito, retención, throttling, plan de migración. |
| Mazmorra imposible | Alta | Validador con llaves/objetivos, simulaciones y fallback manual. |
| Actualización rompe expedición | Alta | Versiones fijadas, compatibilidad, migraciones, feature flags. |
| Alcance descontrolado | Alta | Hitos y backlog; no añadir subsistema antes de corte vertical. |
| Contenido repetitivo | Media-alta | Plantillas temáticas, encuentros manuales, métricas y pruebas con amigos. |
| Economía inflacionaria | Media-alta | Fuentes/sumideros, ledger, límites y simulación. |
| Abuso de administrador | Alta | Roles mínimos, MFA, auditoría, confirmación, separación de entornos. |
| Mala UX táctil o accesibilidad | Media-alta | Botones alternativos, cancelación, pruebas en dispositivos. |
| Dependencia de proveedor/IA | Media | Interfaces, exportaciones SQL, ADR, código reproducible y tests. |

## 21. Checklist para arrancar el repositorio

- Crear GitHub repo independiente y decidir visibilidad; elegir licencia de código y de assets de forma separada. Si no se elige licencia, no asumir que terceros pueden reutilizarlo.
- Escribir README, GDD, ADR-001 (autoridad de servidor), ADR-002 (persistencia), ADR-003 (protocolo y versiones), ADR-004 (modelo de contenido), AGENTS.md y criterios del corte vertical.
- Inicializar TypeScript, Vite, paquetes compartidos, tests y CI; configurar entorno local/desarrollo.
- Crear proyecto Supabase de desarrollo en región adecuada; configurar Auth (OAuth o SMTP), tablas, restricciones y RLS. Crear cuentas ficticias A, B y C para probar pertenencias cruzadas.
- Implementar API única de comandos con commit transaccional e idempotencia, y endpoint de snapshot por personaje. No abrir escrituras directas.
- Construir componente de carta y seis gestos, navegación de mochila, datos mínimos y persistencia de pending_card_id. Probar UI sin servidor con fixtures, luego conectar API.
- Implementar lobby y turno de dos jugadores, notificación privada, reconexión, recompensas y pruebas concurrentes. Crear monitor y exportación de backups básicos.
- Revisar permisos de administrador, cuota, recuperación y documentación. Desplegar alfa solo después de pasar pruebas de integridad.

**Encargo inicial para un agente de programación:** implementar H0 y H1 en una rama de trabajo, sin añadir contenido amplio ni introducir dependencias innecesarias. Entregar un PR con instrucciones reproducibles, tests y migraciones, y demostrar el flujo de dos cuentas, una carta pendiente que sobrevive a recarga, una compra con stock compartido y una acción repetida sin doble premio. No modificar producción ni publicar claves. Antes de desarrollar H2, revisar el contrato transaccional y los tests negativos de acceso entre mundos.

## 22. Fuentes oficiales y alcance de la investigación

Consultadas el 26/11/2026. La arquitectura, los ejemplos de reglas, el modelo de consumo, los objetivos de latencia y los hitos son propuestas de este informe; no se han medido en un prototipo. Las cuotas, políticas y requisitos de servicios pueden cambiar. Contrastar los paneles de los proveedores antes de habilitar producción.

[1] GitHub Docs — GitHub Pages limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

[2] GitHub Docs — GitHub Actions billing: https://docs.github.com/en/billing/concepts/product-billing/github-actions

[3] Cloudflare Pages — Limits: https://developers.cloudflare.com/pages/platform/limits/

[4] Supabase — Pricing: https://supabase.com/pricing

[5] Supabase — Realtime limits: https://supabase.com/docs/guides/realtime/limits

[6] Supabase — Realtime pricing: https://supabase.com/docs/guides/realtime/pricing

[7] Supabase — Free project pausing: https://supabase.com/kb/faqs/platform/free-project-pausing

[8] Supabase — Edge Functions limits: https://supabase.com/docs/guides/functions/limits

[9] Supabase — Custom SMTP: https://supabase.com/docs/guides/auth/auth-smtp

[10] Supabase — Database backups: https://supabase.com/docs/guides/platform/backups

[11] Cloudflare — Durable Objects pricing and limits: https://developers.cloudflare.com/durable-objects/platform/pricing/ ; https://developers.cloudflare.com/durable-objects/platform/limits/

[12] Supabase — RLS and database functions: https://supabase.com/docs/guides/database/postgres/row-level-security ; https://supabase.com/docs/guides/database/functions

[13] Supabase — Realtime authorization and security checklist: https://supabase.com/docs/guides/realtime/authorization ; https://supabase.com/docs/guides/security/production-checklist

[14] PostgreSQL — Explicit locking and transaction isolation: https://www.postgresql.org/docs/current/explicit-locking.html ; https://www.postgresql.org/docs/current/transaction-iso.html

[15] Supabase — Cron: https://supabase.com/docs/guides/cron

**Conclusión:** la base de este juego no será el volumen de cartas, sino un contrato de acciones fiable, un mundo de datos consistente, un contenido validable y un multijugador recuperable. Si se construye primero ese núcleo pequeño y se prueba con amigos, será posible ampliar el universo mediante actualizaciones sin convertir cada expansión en una reescritura.
