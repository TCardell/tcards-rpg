# Propiedades personales y bases

Estado: requisito acordado; detalles pendientes, 2026-11-26.

## Acordado
Los personajes pueden crear/construir o comprar una base propia personalizable: choza, casa, castillo, piso franco en ciudad u otras propiedades. Es un lugar físico visitable dentro del mundo, no solo una pantalla de inventario. Otros usuarios pueden visitar la propiedad conforme a permisos que habrá que definir. El personaje puede almacenar allí su loot. La base sirve de referencia para reaparición de personajes persistentes tras derrota; ver CHARACTERS.md.

## Propuesta de experiencia
Comprar o crear la propiedad en una localización válida; navegar por el mundo hasta ella y entrar; ver carta de la propiedad y opciones para visitar habitaciones, gestionar almacén y personalizar. Ejemplos adicionales: granja, torre, refugio. Personalización inicial mediante estilos, muebles, habitaciones y mejoras seleccionables por cartas; no exigir editor 3D. Posibles funciones: descanso/recuperación, armería, sala de trofeos, taller futuro, visitas. No convertirlas todas en requisitos de primera versión.

## Permisos y persistencia
Propuesta: propiedad ligada a mundo y propietario (personaje); identificador estable, posición en grafo, tipo, nombre, estado de decoración, almacén separado y reglas de visita. Permisos privados, amigos, invitados o públicos como candidatos. Visitar no autoriza a coger, mover, vender ni modificar objetos. Diferenciar permisos de entrar, administrar, almacenar/retirar y decorar; validar servidor y scope. Compra/construcción y transferencia de bienes deben ser atómicas, sin vender dos veces parcela ni duplicar dinero/items. No permitir robo o asalto a propiedades por defecto sin diseño explícito.

## Pendiente
Número de propiedades por personaje, parcelas libres, coste y adquisición/construcción, propiedad inicial, mejoras y capacidades, si puede venderse o compartirse, visitas cuando dueño está offline, bases colectivas/gremios, herencia y propiedad de fallecidos hardcore, recuperación si no hay base. No se ha aprobado mercado inmobiliario complejo, crafting, profesiones, producción de granjas ni clanes; mantenerlos como ideas. Decidir más adelante si puede haber propiedad de cuenta o compartida.

## Aceptación futura
Una propiedad creada aparece en la ruta física del mundo y persiste tras recarga. Su propietario deposita/retira objetos sin duplicación; visita autorizada no concede acceso a almacén. Otro mundo no puede acceder ni heredar estado. Reaparición de modo libre resuelve destino válido. Personalización persiste sin modificar cartas pendientes de forma ilegítima. Ver WORLD.md, INVENTORY.md y DATABASE.md.
