# Correspondencia y buzones

Estado: requisito acordado, 2026-11-26. No implementado.

Los personajes pueden leer buzón y escribir, enviar y recibir mensajes a/de otros jugadores o NPC. Correspondencia persistente durante ausencia. Puede servir para organizar partidas, recibir noticias, pistas, misiones o avisos del mundo. En NPC, respuestas y mensajes deben respetar contenido/estado definido; no asumir que requiere un LLM en tiempo real.

Propuesta: buzones físicos en casa, oficinas, tabernas u otros lugares, con notificación o consulta desde menú según diseño. Separar remitente personaje/NPC, destinatario y mundo; guardar mensaje, fecha, estado de lectura, tipo y contexto autorizado. Mensajes y notificaciones no consumen carta de gameplay. No ejecutar HTML/código incrustado ni activar recompensas por simple apertura; usar comandos validados para acciones adjuntas.

Pendiente: alcance de acceso remoto, entrega inmediata o diferida, coste, respuestas NPC, límites, moderación, bloqueo y retención; adjuntar oro u objetos no aprobado. Aislar mensajes privados, evitar spam y suplantación; no permitir cliente hacerse pasar por NPC. Pruebas: enviar a amigo desconectado, recuperar al volver, responder a NPC autorizado, impedir lectura de tercero y preservar carta pendiente.
