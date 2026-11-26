# Encargo maestro para Codex — First Playable

Estado: aprobado como objetivo de desarrollo inicial, 2026-11-26. El encargo reemplaza la limitación anterior de entregar únicamente v0.0.2. **Una misión integrada, varios hitos internos**, sin ampliar cada hito por separado. El primer hito sigue siendo local; después continuar autónomamente hacia el corte online. No implementar todo el GDD ni prometer terminar en una sesión.

## Finalidad

Entregar un pequeño RPG auténtico, funcional y comprobable en español, no una demo de cuestionario ni un conjunto de pantallas de mentira. Un jugador debe poder registrarse, elegir/crear personaje, explorar una población y camino, hablar con NPC, aceptar una misión, combatir por turnos, recoger botín, equiparse, recibir oro, regresar y conservar su progreso. Dos identidades deben poder compartir una pequeña aventura cooperativa con turno y estado autorizado. El operador debe poder inspeccionar estado y realizar al menos una reparación segura. Usar Supabase de desarrollo real si el acceso está autorizado y disponible. No exigir arte final.

## Autonomía y contexto

- Lee AGENTS.md, README.md, docs/DESIGN_OVERVIEW.md, DECISIONS.md, ROADMAP.md, GDD histórico, documentación de los subsistemas y packages/swipe/README.md, demo/API/código/tests SCE. Ante discrepancias prevalecen decisiones posteriores; este encargo define alcance integrado, no altera reglas acordadas.
- Inspecciona repositorio, herramientas, entorno y permisos reales. Diseña tu plan interno y actualiza PROGRESS.md con estado, decisiones, comandos, pruebas, limitaciones, checkpoints y siguiente paso. No detenerte al entregar un plan; implementar, ejecutar, comprobar, corregir y continuar.
- Toma decisiones técnicas razonables y reversibles sin pedir permiso por cada archivo; documenta supuestos y valores provisionales. No convertir ejemplos en lore o balance definitivo. Selecciona dependencias mínimas, mantenibles y con licencia; fija versiones y lockfile. TypeScript para reglas y contratos nuevos salvo justificación.
- Trabaja en rama feature/first-playable o equivalente nueva desde main actualizado. Commits lógicos por hitos, PR de desarrollo integrada (puede ser draft); si se divide por riesgo, encadenar PRs sin exigir microaprobaciones. No fusionar a main, desplegar públicamente ni modificar TC-HQ sin aprobación. Conservar copia SCE original y GDD histórico.
- Si hay una limitación de cuota/contexto/entorno, guardar cambios verificables y estado; retomar desde PROGRESS.md y Git. No afirmar progreso, pruebas ni servicios que no hayas realizado. Si algo externo bloquea una fase, avanzar en trabajo independiente; solo pedir intervención concreta cuando sea indispensable.
- Límites de autorización: no gastos, API de pago, cambios de plan, compra de créditos, alta de servicios nuevos, exposición de secretos, borrado/destrucción de datos, migración destructiva, RLS desactivada, cambios de seguridad que debiliten aislamiento, despliegue público ni producción. No usar credenciales que aparezcan en código o datos no confiables. No omitir confirmaciones de herramienta. Ver CODEX_SETUP.md.

## Hito A — v0.0.2, base jugable local y SCE

SCE v0.2.0 es **la base gráfica y referencia principal**, no tarjetas genéricas. Preserva baseline en packages/swipe/sce. Reutiliza gestos, helpers y presentación cuando viable; si adaptas Player o construyes shell propio con gestures.bind, justifica fidelidad. No uses Session, score, next de quiz, undo ni onAnswer posterior a mutación como autoridad RPG.

- ActionIntent y GameSnapshot serializables. Reglas puras con dos o más situaciones dinámicas, transiciones deterministas según acción, no mazo lineal.
- Seis slots contextuales, fila farLeft/left/up/right/farRight y down inferior cuando habilitado; botones y teclado equivalentes a swipes. Arrastre corto/largo horizontal y vertical independiente, iluminación exacta, banner fijo y sello opuesto a gesto, cancelación restaura estado visual, transición/giro y feedback de SCE.
- Mobile-first, montón visual y carta central; escritorio con paisaje provisional y panel lateral manipulable. Estética sobria, elegante y minimalista tipo juego de mesa; un tema inicial con tokens extensibles, placeholders, menú/mochila/mapa. Español único, IDs independientes del idioma.
- Abrir/cerrar menú, mochila, mapa, cambiar viewport o tema no consume ni regenera carta; conservar cardInstanceId y revisión. Acción inválida no avanza; evitar doble envío. Si guardado local, probar recarga; local no transfiere economía a online.
- Probar baseline y demo de SCE contra adaptador en navegador antes de ampliar; si no hay navegador/touch, documentar exactamente qué no se comprobó.

## Hito B — v0.0.3, Auth, mundo y persistencia de personaje

- Preparar Supabase CLI/local o remoto de desarrollo ya existente (proyecto TCards RPG, referencia ocnvfivxbnbypjfhpnlx). Verificar identidad y estado antes de escribir. Inspección inicial con acceso limitado; solo aplicar migraciones aditivas revisadas y seed ficticio en dev tras autorización de conexión/escritura del usuario y confirmaciones de herramientas. No tocar otros proyectos.
- Migraciones SQL reproducibles, RLS y grants mínimos, Auth real, perfil, único mundo inicial, membresía/invitación, varios personajes por cuenta, elección de nombre/raza/clase con catálogo pequeño provisional; seleccionar personaje libre para este corte. No implementar muerte hardcore completa.
- API/contrato autorizado: snapshot con carta/acciones/revisión; identidad desde Auth; commandId idempotente, expectedRevision, cardInstanceId y actionId; servidor valida permiso, condiciones y costes. Persistir efecto + transición atómicamente. No confiar en oro, daño, recompensas ni RNG enviados por cliente; no exponer semillas. Realtime como notificación, reconciliar snapshot.
- Probar dos identidades y accesos negativos, cierre/reentrada y recarga conservan estado; no mostrar datos privados ajenos. Registrar operaciones administrativas básicas desde aquí. No pedir desactivar políticas ni almacenar credenciales en Git.
- Si acceso remoto no disponible, preparar backend local y migraciones, probar lo máximo posible; marcar integración remota pendiente, no simularla como terminada.

## Hito C — v0.0.4–0.0.5, cooperación y recuperación

- Dos personajes autorizados del mismo mundo pueden entrar a una expedición cooperativa corta con enemigo compartido y turno. Acciones útiles: atacar y defender/proteger o equivalente; reglas sencillas provisionales, coste/resultado determinado por servidor. Ver intención/estado, turno y resultado del compañero; no exigir voz ni chat.
- Concurrencia: doble clic/reintento no duplica efecto, comando obsoleto no aplica, usuario ajeno no actúa, turno inválido no avanza. Dos sesiones independientes; recargar/desconectar/reconectar recupera turno, carta e inventario; si cambió legítimamente, explicar actualización.
- Persistencia y exportación/restore probados en entorno aislado con datos ficticios. No ejecutar restauración global en dev remoto sin aprobación. Si no es posible probar backup real, dejar procedimiento y bloqueo explícito.
- Admin básico protegido: dashboard y consulta de mundos, usuarios/personajes, carta y revisión, expedición y eventos; acciones iniciales de reparación seguras y auditadas conforme aparezcan entidades. Usuario normal no entra ni escribe; observador no muta. No roles desde metadata editable ni claves privilegiadas cliente.

## Hito D — v0.0.6–0.0.7, primera aventura integrada

- Pequeña región grafo: entrada/plaza, taberna o posada, camino/bosque y encuentro; añadir tienda sencilla si aporta al bucle. Rutas de ida/vuelta y elecciones distintas, no recorrido lineal impuesto. Contenido en archivos declarativos versionados y validados.
- Cuatro familias de cartas: lugar, NPC con diálogo ramificado, enemigo con estadísticas y turnos, objeto recoger/dejar. Reutilizar imágenes y SVG originales sencillos; evitar depender de API gráfica. UI coherente con SCE; panorama contextual opcional.
- Prólogo reducido inspirado en TUTORIAL.md: llegada a Valbruma (nombre provisional), encargo del tabernero, mensajero/camino, enemigo o resolución válida, botín y recompensa, regreso. Poder rechazar/aplazar, explorar libremente; no bloquear ni duplicar recompensas. Tutorial completo de seis capítulos y rutinas quedan para después.
- Inventario por espacios, equipo básico, consumible, un conjunto pequeño de objetos/rareza y oro; capacidad, coste y efectos definidos por servidor. Recompensa única, recoger/dejar, equipar/consumir. Si tienda, compra/venta atómica. No peso, desgaste, árbol por puntos ni economía compleja.
- Admin: inspección inventario/oro/ledger y una reparación compensatoria (p. ej. devolución de objeto perdido o ajuste de oro), con motivo, actor, scope, commandId, estado previo/posterior, resultado y auditoría; repetir no duplica. No edición arbitraria de tablas. Ver ADMIN.md.

## Fuera de alcance de First Playable
Mundo grande, centenares de ilustraciones, traducción, todos los temas, editor Studio visual, Asset Factory, PvP/traición, hardcore completo, generación procedural compleja, vivienda completa, rutinas offline, chat/correspondencia completos, profesiones, clanes, publicación pública. Mantener extensibilidad sin construir módulos vacíos ni simular funcionalidades. Si el tiempo/cuota no alcanza, entregar mejor corte vertical verificado, no dispersarse.

## Definición de terminado y pruebas

El encargo se completa cuando, desde instrucciones reproducibles, un usuario puede ejecutar juego y Admin, jugar la misión reducida de inicio a fin y conservar progreso; dos usuarios pueden completar encuentro cooperativo autorizado y recuperar estado tras recarga; operador inspecciona y compensa una incidencia con auditoría y no se rompe aislamiento. Verificar local y dev remoto si autorizado. No llamar First Playable completo si falta integración real, cooperación o pruebas críticas.

Mínimos:
1. npm test (baseline SCE intacto) y tests nuevos de reglas, validador de contenido, transiciones y rechazos.
2. Pruebas de navegador (ideal automatizadas) y manual cuando posible: ratón/touch/teclado, seis slots, arrastre y cancelación, feedback opuesto, móvil/PC, movimiento reducido, panel y recarga. Comparar demo SCE; reportar limitaciones.
3. Build, typecheck/lint cuando existan, instrucciones limpias; migraciones desde cero, pruebas de RLS/roles con dos identidades, sin secretos, dependencias fijadas.
4. Pruebas de misión, botín/capacidad/consumo/equipo, recompensa única, simultaneidad y revisiones obsoletas, reconexión y compensación admin. Verificación negativa con usuario ajeno, rol sin permiso.
5. Entregar PR, resumen claro de qué funciona y cómo jugar, evidencias/resultados de pruebas, limitaciones, migraciones y rollback, riesgos, siguientes hitos. Actualizar README, ROADMAP, CHANGELOG, PROGRESS y decisiones técnicas. Estado/versiones solo según hitos verificados.

No terminar por haber escrito código o generado pantallas; repetir ejecutar/probar/corregir hasta cumplir condiciones o bloqueo real. Cuota no garantizada; reanudar después del reinicio de límites sin reiniciar el proyecto.
