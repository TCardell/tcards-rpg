# Cuentas, personajes, clases y derrota

Estado: diseño acordado parcialmente, 2026-11-26. No implementado.

## Identidad y creación (acordado)
Una cuenta de usuario puede crear varios personajes. Nombre de usuario y nombre de personaje son conceptos distintos. Cada personaje conserva su identidad, progresión, inventario, equipo y estado; los permisos de cuenta y mundo se gestionan aparte. El límite de personajes, unicidad de nombres, retrato, razas y personalización están pendientes.

Clases flexibles: permitir arquetipos iniciales definidos para quien los quiera (p. ej. guerrero o mago), personajes genéricos y combinaciones híbridas. Evitar encerrar al personaje en una clase irrevocable. No añadir demasiadas estadísticas: preferencia por sistemas simples, fáciles de leer, mantener y equilibrar. Propuesta de creación rápida para expediciones: nombre/retrato/arquetipo/equipo inicial generado o preseleccionado, con posibilidad de editar; objetivo entrar rápidamente, sin formulario largo.

## Atributos (propuesta, no lista definitiva)
Candidatos: fuerza, destreza, constitución, inteligencia, carisma y suerte. Recursos/estadísticas visibles: vida, ataque, defensa y, si justifican mecánicas, energía y maná; oro, experiencia y nivel como datos de progresión. Calcular derivados desde base, equipo, habilidades y efectos; evitar duplicados, modificadores innecesarios y una pantalla saturada. No fijar aún fórmula, número de atributos, escalas, ramas de habilidad, reparto de puntos, límites ni nombres finales de clases.

## Modalidades acordadas
- Modo libre/persistente: personaje de larga duración, exploración y progresión; puede participar en expediciones. Si no puede ser rescatado tras derrota, reaparece en su base (o punto seguro de respaldo si todavía no tiene base, propuesta). Posibles penalizaciones moderadas: debuff/herida, pérdida parcial de oro o descanso; decidir exactamente más adelante.
- Hardcore: personaje con muerte permanente, rápido y fácil de crear, apropiado para mazmorras cortas con amigos, aproximadamente una hora como ejemplo. Si puede ser rescatado, no está definitivamente muerto. Si la derrota es definitiva, no vuelve a ser jugable y se genera una lápida en el cementerio del mundo. No confundir expedición rápida con eliminación automática al terminar; reutilizar supervivientes en otras expediciones es una propuesta.
- Modalidad del personaje y modalidad de expedición son distintas. Un personaje libre puede participar en estas partidas sin adquirir muerte permanente automáticamente. Compatibilidad de grupos mixtos y equilibrio por definir; indicar condiciones antes de entrar.

## Derrota, rescate y muerte
Vida cero -> abatido (si hay posibilidad de rescate) -> rescate por compañeros o resolución definitiva. Rescate posible por compañeros; tipo de acción, coste, plazo, vida restaurada y momento de confirmación por diseñar. No establecer muerte definitiva solo por perder conexión. Cuando ya no haya rescate posible, aplicar la modalidad del personaje. Propuesta: máquina de estados explícita activo/abatido/recuperación/fallecido; resolución autoritativa atómica, no duplicar lápida ni penalizaciones al reintentar. No resucitar un hardcore fallecido mediante recarga, creación de copia o cambio de modo. Reglas de cambio de modalidad y destino de bienes tras muerte pendientes; no implementar explotación de herencia.

## Cementerio
Requisito: lápida de hardcore fallecido en cementerio físico del mundo. Propuestas de memorial: nombre del personaje (no datos privados de cuenta), fecha, nivel, causa, duración, hazañas y compañeros si procede; visibilidad conforme a permisos. Mantener historial tras dejar de ser jugable. No borrar la identidad para reutilizarla sin preservar el memorial. Número de cementerios, ubicación y visita por definir.

## Pruebas futuras
Crear dos personajes de una cuenta sin mezclar sus inventarios, roles o revisiones. Rescate evita muerte definitiva; derrota no rescatada de libre regresa a base con regla elegida, de hardcore crea una sola lápida y bloquea acciones futuras. Reintentar comando y recargar no revierten estado ni duplican efectos. Personaje libre conserva modalidad al participar en expedición corta. Ver COMBAT.md, DUNGEONS.md y HOUSING.md.
