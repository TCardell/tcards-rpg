# Producción artística

Estrategia propuesta, sin assets definitivos. Una ilustración por entidad/escena cuando sea útil, no por carta dinámica. Reutilizar retratos NPC, enemigos durante turnos, objetos en loot/tienda/mochila, escenas para distintas situaciones. Separar imagen puntual, panorama, ornamento CSS/SVG y reglas.

Flujo: prototipo con placeholders (10–20 recursos como estimación), seleccionar muestra de las familias de cartas y panorama, validar dirección, definir guía de prompts, encuadres y proporciones. Generar con IA; hojas de 4/9/16 ilustraciones para iconos, retratos y objetos cuando recorte sea viable; revisar divisiones, anatomía, defectos y coherencia. Panoramas importantes individuales si necesitan resolución. Recortar, nombrar por ID, optimizar WebP/PNG/SVG según contenido; conservar originales fuera del bundle cuando convenga. Catalogar assetId, categoría, ruta, dimensiones, versión, procedencia/licencia, alt español, revisión. Validar referencias y fallback; carga diferida y precarga limitada, no cargar panorama pesado en móvil. No generar imágenes durante juego.

Posible Asset Factory: lista de pendientes/prompts, importación de láminas, recorte guiado, revisión, renombrado, compresión y exportación de catálogo; posible integración Studio. No requisito v0.0.2. ChatGPT por lotes, API (facturación independiente) o modelos locales/ComfyUI cuando hardware, licencias y coste permitan; no contratar proveedor ni fijar cuotas. 154 imágenes fue estimación ilustrativa para región, no requisito. No producir cientos antes de probar UI.

Arte original o autorizado, registrar procedencia/licencia, revisión humana; no copiar Regicide. No texto incrustado, marcas de agua ni SVG/HTML no confiables. Fallback simple si falta imagen. Ver ART_DIRECTION y STUDIO.
