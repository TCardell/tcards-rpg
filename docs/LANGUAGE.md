# Idioma y textos

Decisión acordada: español como único idioma inicial, incluyendo interfaz, cartas, diálogos, misiones, objetos, habilidades, Admin, Studio y documentación nueva. Sustituye la previsión ES/EN inicial. No traducir documentación histórica ni código de SCE. Marca e identificadores técnicos en inglés cuando aporten claridad.

Dejar abierta traducción futura al inglés u otros idiomas sin duplicar esfuerzo hoy:
- Separar textos visibles de reglas; IDs estables independientes del idioma.
- Contenido declarativo con texto español; no usar nombres traducibles como claves o condiciones. No exigir estructura multilingüe prematura.
- Evitar texto en ilustraciones; layouts flexibles y fuentes con caracteres españoles.
- Formatear datos/fechas legibles en español; timestamps e IDs canónicos internamente.
- No implementar selector de idioma, traducciones inglesas ni i18n completo hasta hito explícito.

Pruebas: tildes, ñ, signos, nombres largos, wrapping y truncamiento accesible; ausencia de texto inglés involuntario. Idioma futuro no altera reglas.
