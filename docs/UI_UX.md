# TCards RPG — Especificación de interfaz y experiencia (UI/UX)

**Estado:** diseño funcional, 26 de noviembre de 2026. Aún no implementado. Complementa el GDD original sin sustituir sus reglas. Las decisiones confirmadas por el creador son requisitos; las propuestas y preguntas abiertas no son compromisos.

## 1. Intención de diseño

TCards RPG es un RPG de mundo abierto y persistente, no un juego de cartas coleccionables. El jugador percibe situaciones y toma decisiones mediante cartas; el motor de reglas y el servidor mantienen la complejidad fuera de la vista. La interfaz es mobile-first y card-first: debe ser cómoda para una sesión larga con una mano, sin saturar de controles ni obligar a desplazarse constantemente. El PC ofrece más espacio y herramientas, no reglas ni ventajas exclusivas.

## 2. Pantallas y navegación

### Requisitos acordados
- Página principal: inicio de sesión y acceso al servidor/mundo. Debe permitir entrar a la experiencia desde móvil o PC.
- Gameplay: montón visual de cartas con una carta central activa que se gira para revelar la situación. Acciones mediante gestos o botones inferiores. El jugador pasa a la situación siguiente al resolver la anterior.
- Botón de menú siempre accesible, con inventario/mochila, mapa y ajustes como apartados imprescindibles. Se podrán ampliar.
- En móvil, los apartados se abren como vistas o paneles independientes de la carta. En PC se pueden consultar y manipular lateralmente sin abandonar el gameplay.

### Flujo propuesto (detalles por decidir)
Portada → autenticar → seleccionar/crear/unirse a un mundo privado → seleccionar/crear personaje → recuperar partida → gameplay. Reentrada con sesión existente debería ahorrar pasos. Separar visualmente la cuenta, el mundo y el personaje; son entidades distintas. El número de pantallas, rutas, opciones de registro y selector de personaje se concretarán con Auth y el diseño de mundos. Admin y Studio son herramientas independientes, no pantallas obligatorias del jugador.

## 3. Gameplay: baraja y carta activa

- El montón detrás de la carta activa representa continuidad de aventura. No implica un mazo finito, cartas coleccionables ni que el cliente tenga las cartas futuras.
- Al entrar o recibir una nueva situación, revelar la carta central mediante animación de giro; al elegir, desplazarla de forma coherente con la acción. Mantener el foco en una sola carta interactiva.
- La carta muestra situación, texto legible, imagen/ilustración cuando proceda y las acciones disponibles. Como propuestas: título, tipo de encuentro, personaje interlocutor, indicaciones de coste/riesgo si son conocidas. No fijar todavía una plantilla rígida.
- SCE v0.2.0 es la referencia existente para gestos, posiciones, feedback, sonidos y animaciones. Conservar respuesta durante arrastre: iluminación exacta del botón, etiqueta/sello visible en el lado opuesto al movimiento y cancelación si no se supera umbral.
- Acciones con IDs estables: farLeft, left, up, right, farRight, down. La interacción prioritaria es izquierda/derecha; los gestos largos horizontales y verticales son alternativas contextuales. No todas las cartas necesitan seis acciones. La semántica se define por situación, no por una equivalencia universal (derecha no siempre es atacar).
- Todo gesto habilitado tiene un botón equivalente y acceso por teclado en PC. Opciones deshabilitadas no emiten comandos. Texto o símbolo además de color. No confundir dirección con intensidad; evitar gestos diagonales ambiguos.
- Mantener la carta, botones y menú utilizables en pantallas pequeñas. Si el texto es largo, gestionar lectura sin interferir con el swipe; no cortar información decisiva.
- Accesibilidad: reducción de movimiento, contraste, foco visible, lectores de pantalla, alternativa sin arrastre, áreas táctiles generosas, no depender del audio. Las animaciones son presentación, no reglas.

## 4. Móvil: experiencia de referencia

Orientación vertical como diseño principal. Disposición conceptual (no mockup definitivo):

    ┌─────────────────────────────┐
    │ Contexto / estado      Menú │
    │                             │
    │       ┌──────────────┐      │
    │     ╱ │ CARTA ACTIVA │ ╲    │
    │    ╱  │              │  ╲   │
    │       │  Situación   │      │
    │       │  ilustración │      │
    │       │  y texto     │      │
    │       └──────────────┘      │
    │   «    ‹    ↑    ›    »     │
    │          ↓ (si existe)      │
    └─────────────────────────────┘

La carta debe ocupar la parte central útil, sin quedar tapada por notch, barra del navegador, teclado virtual o controles. Propuesta: adaptar altura a viewport dinámico y safe areas; usar layout que se reduzca sin ocultar acciones; evitar scroll global durante arrastre, pero permitir scroll dentro de menús. Los datos mínimos visibles (p.ej. vida, oro, estado de conexión, ubicación) y su posición están por decidir. Evitar convertir el HUD en un panel de estadísticas constante.

Menú: abrir mediante botón, navegar a apartado y volver a la misma carta. Modal/pantalla/panel de altura completa según pruebas. El botón Atrás del navegador o sistema no debe provocar una acción de juego. Al salir del panel restaurar foco y posición; los gestos de desplazamiento de mochila no deben activar cartas.

## 5. PC: experiencia ampliada

Requisito: mantener la carta central y mostrar un paisaje contextual en el espacio sobrante de los bordes. No estirar una tarjeta móvil a toda la pantalla. Permitir consulta/manipulación de mochila y menú en uno o varios paneles laterales, aprovechando espacio disponible.

    ┌────────────────────────────────────────────────────────────┐
    │ Identidad / contexto                            Menú       │
    │                                                            │
    │   PAISAJE           ┌───────────────┐          PAISAJE     │
    │   ┌──────────┐      │ CARTA CENTRAL │      ┌───────────┐   │
    │   │ Menú     │      │               │      │ Mochila   │   │
    │   │ Mapa     │      │   Situación   │      │ Objetos   │   │
    │   │ Ajustes  │      │               │      │ Detalle   │   │
    │   └──────────┘      └───────────────┘      └───────────┘   │
    │                      «  ‹  ↑  ›  »                       │
    └────────────────────────────────────────────────────────────┘

La colocación concreta izquierda/derecha, paneles simultáneos, tamaños y persistencia de preferencias son propuestas. Es recomendable poder plegarlos para disfrutar del paisaje y adaptar a ventanas estrechas. Un PC con ventana pequeña utiliza layout compacto; una tablet amplia podría usar layout expandido. Determinar por espacio real y capacidad de uso, no solo user-agent. Ratón, teclado y táctil mantienen mismas acciones y reglas. Las teclas no deben disparar gestos al editar campos o manipular un menú. No duplicar el motor ni la lógica de inventario entre layouts.

## 6. Paisaje ambiental contextual

Requisito en PC: fondo relacionado con situación/localización y momento. Ejemplos acordados: exterior diurno/nocturno, cueva, mazmorra, castillo. Propuestas adicionales: bosque, montaña, costa, pueblo, iglesia, taberna/hostal; lluvia, nieve, amanecer, atardecer; iluminación y sonidos ambientales configurables.

Separar ilustración de carta (situación puntual) y panorama (contexto persistente). No generar imágenes durante la partida ni descargar recursos masivos por cada gesto. Propuesta técnica: manifiesto versionado de escenas, claves de ambiente derivadas de contexto confirmado por el motor, variantes hora/bioma/interior, fallback neutro, precarga limitada y transiciones discretas. El mismo fondo puede durar muchas cartas. Evitar parpadeos o cambios de paisaje antes de que el servidor confirme viaje o transición. No obligar a cargar panoramas de escritorio en móvil; opción de ahorro de datos y desactivar animaciones ambientales. La hora visual no determina por sí sola el tiempo del mundo.

La dirección artística (tarot editorial, cartografía, numismática, fantasía) y paleta en BRAND.md son propuestas, no diseño final.

## 7. Menú, mochila y apartados

| Apartado | Estado | Función |
|---|---|---|
| Aventura / volver | Requisito funcional | Recuperar carta pendiente sin resolverla |
| Mochila / inventario | Acordado | Consultar objetos y realizar acciones permitidas |
| Mapa | Acordado | Consultar mundo y localizaciones |
| Ajustes | Acordado | Preferencias de interfaz |
| Personaje | Propuesto | Atributos, experiencia, habilidades |
| Equipamiento | Propuesto | Armas, armaduras, accesorios; podría integrarse en mochila |
| Diario / misiones | Propuesto | Objetivos, rumores, acontecimientos |
| Grupo / social | Propuesto | Compañeros, invitaciones, expediciones |
| Enciclopedia | Propuesto | Descubrimientos, criaturas y objetos |
| Salir | Propuesto | Volver a portada/mundo sin perder progreso |

Mochila: representar ítems, cantidades, detalles y acciones contextuales. En PC el jugador puede manipularla mientras ve la carta central; en móvil debe poder hacerlo en una vista propia. Cuadrícula/lista, slots, peso, arrastrar objetos, rarezas, comparar equipo y atajos están por decidir. No confundir ver con actuar: consultar no altera estado; equipar, consumir, vender o viajar pueden ser comandos autorizados con consecuencias, restricciones de combate o coste de turno. No aplicar efectos directamente desde la UI.

Ajustes candidatos: sonido/volumen, idioma ES/EN, sensibilidad, movimiento reducido, fondo, calidad gráfica. Guardar preferencias locales separadas del estado de partida. Definir accesibilidad y opciones definitivas antes de cierre de alfa.

## 8. Persistencia, interacción y sincronización

La carta pendiente es estado de juego, no un componente visual ni índice de un mazo. Debe sobrevivir a abrir/cerrar menú, mochila, mapa, cambio de layout, recargar navegador y reentrada en partida. En online, recuperar snapshot autorizado y la misma cardInstanceId mientras no haya un cambio legítimo en servidor. En multijugador pueden llegar cambios de otros participantes, caducar turnos o resolverse una situación; mostrar actualización explícita y no conservar una carta inválida. El menú no pausa automáticamente a los demás.

Separar tres estados:
1. Estado de dominio confirmado: mundo, personaje, pendingCard, opciones válidas, revisión y contexto ambiental.
2. Intención en curso: gesto/acción y commandId, espera/confirmación/rechazo, sin duplicar envío.
3. Estado UI: menú abierto, paneles, foco, arrastre, animación, preferencias; nunca fuente de autoridad.

SCE emite una intención, no una recompensa. Antes de avanzar aplicar resultado confirmado por motor local de prueba o servidor. Bloquear doble confirmación; al rechazar restaurar carta/mostrar explicación, al reconectar recuperar snapshot/reintentar el mismo ID si corresponde. No usar undo de cuestionario online. No ocultar pérdidas/errores mediante un avance ficticio. Nunca exponer semillas futuras ni acciones privadas de otros jugadores en el frontend.

## 9. Criterios de aceptación para el futuro desarrollador

Prototipo UI v0.0.2 (sin necesidad de construir todo el RPG):
- Carta central y montón visual; transición/giro observable con alternativa de movimiento reducido.
- Gestos y botones equivalentes en un caso de prueba, feedback SCE fiel y cancelación sin avanzar.
- Vista vertical móvil y escritorio con panorama de ejemplo y menú/mochila lateral manipulable. Mismo contrato de acciones; no dos juegos.
- Abrir/cerrar menú y cambiar viewport conserva cardInstanceId, revisión y estado; probar navegación y teclas dentro de panel.
- Una acción válida avanza según el motor de prueba; inválida no avanza; doble evento no duplica resultado.
- No afirmar guardado online o login real si es un prototipo local. Pruebas posteriores: restauración tras recarga/reentrada, Auth, sincronía dos dispositivos, acciones en carrera, permisos.
- Verificar manualmente teléfono pequeño/grande, PC estrecho/ancho, mouse/touch/keyboard, foco, lectura, movimiento reducido y carga de fondos. Medir antes de fijar breakpoints o presupuestos de recursos.

## 10. Pendiente de diseño

Próximo bloque: taxonomía de cartas (viaje, exploración, diálogo, combate, comercio, botín, eventos), encadenamiento de situaciones y decisiones, cómo se elige destino, cómo se presenta una respuesta y qué ocurre entre cartas. Después: personaje/atributos, combate, equipo/inventario, economía, NPC, mapa, tiempo, mazmorras, multiplayer, administración y contenido. Establecer requisitos, ejemplos, invariantes, preguntas abiertas y pruebas para cada bloque. No convertir ejemplos ficticios de cartas o nombres en lore definitivo. No implementar todas las pantallas de golpe.

Ver GDD.md, GAME_RULES.md, ARCHITECTURE.md, MULTIPLAYER.md, BRAND.md y DECISIONS.md.
