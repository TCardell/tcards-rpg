# Combate por turnos

Estado: principios acordados, mecánica todavía abierta (2026-11-26).

## Acordado
Enemigos presentados mediante cartas con vida, ataque y defensa, actualizadas conforme al combate. Resolución por turnos aunque el reloj del mundo sea real. Combate sencillo de comprender, con profundidad por decisiones y cooperación. Inspiración en Regicide (gestión sencilla de recursos, acciones complementarias y cooperación frente a enemigos), y en la propuesta de combate anticipativo; no copiar textos, recursos o reglas completas de otro juego. Sigue siendo un RPG, no un juego de mazos coleccionables. Rescate de compañeros abatidos antes de derrota definitiva; ver CHARACTERS.md.

## Propuestas a discutir
- PvE anticipativo: mostrar intención del enemigo (ataque, defensa, hechizo, agotamiento, etc.) para permitir reacción estratégica. No confirmar aún que todos los ataques se anuncian ni qué información exacta se revela.
- PvP: elecciones simultáneas ocultas hasta resolución, o turnos alternos; no está decidido. Coop puede utilizar ronda de acciones o turnos individuales; diseño exacto pendiente.
- Acciones candidatas: atacar, ataque poderoso con coste, defender, proteger a un aliado, usar habilidad, utilizar consumible, huir. Seis slots SCE contextuales; algunas acciones pueden abrir selección de objetivo/habilidad. Sin obligar a seis acciones fijas. Los arquetipos flexibles permiten roles de daño, protección, apoyo o curación sin imponerlos.
- Valores sencillos, feedback breve tras turno; evitar calcular decenas de modificadores o atacar siempre sin alternativas. Distinguir recursos de personaje y estadísticas derivadas. No fijar tabla de daño, críticos, defensa, orden, velocidad, regeneración, estados alterados, coste de energía/maná ni número de enemigos por encuentro.
- Rescate en coop podría consumir turno, habilidad o consumible. La derrota, huida o abandono deben ser reglas explícitas, no efectos de animación.

## Contrato técnico
Mantener encuentro y enemigos como entidades persistentes; resolver acción una sola vez, validar objetivo y turno, devolver snapshot y resultado; no recalcular daño ni botín al mostrar carta. En online, el servidor conserva autoridad, plazos y acciones ocultas. Si se desconecta, seguir la política de expedición, no matar automáticamente al personaje. Ajuste sutil de dificultad solo en encuentros/mazmorras elegidos (DUNGEONS.md).

## Pendiente y pruebas
Definir primero un combate mínimo, después daño/defensa y recursos, turnos coop, rescate, PvP, variedad y balance. Probar que defender o apoyar tenga utilidad y que progresar se note; dos jugadores con acciones diferentes, reconexión y resolución única. Ningún ejemplo numérico de conversación es una fórmula aprobada.
