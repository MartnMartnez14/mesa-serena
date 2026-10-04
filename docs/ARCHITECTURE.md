# Arquitectura y mantenimiento

HTML/CSS/ES modules. No build ni dependencias de producción. Un solo origen estático; rutas por fragmentos.

- `core.js`: funciones puras, cifras, fechas, formato de respaldo y normalización por whitelist.
- `db.js`: IndexedDB v1, store state, clave personal. Escrituras atómicas de un estado pequeño y versionado; no se guarda antes de validar.
- `app.js`: interfaz con DOM seguro y controles de cambios sin guardar.
- Datos públicos JSON separados del estado personal. IDs USDA y editoriales estables.
- Service worker: precache completo; fallo elimina caché incompleta; cache-first para versión coherente; activación voluntaria de actualización; solo elimina cachés propias. Nunca elimina IndexedDB al actualizar.

Respaldo v1: `{app:"mesa-serena",version:1,created:ISO,data:{profile,habits,entries,favorites}}`. Altura cm, peso kg, cintura cm. Fechas locales YYYY-MM-DD; una entrada por fecha; planned y done conservan selección histórica. Máximo 3 hábitos activos; máximo 40.000 fechas, 2.000 caracteres por nota, 1.000 favoritos y archivo 5 MB. Una versión desconocida se rechaza antes de escribir.

Cambios futuros al esquema necesitan migración explícita y pruebas contra respaldos anteriores. No usar migración destructiva. Actualizar catálogos conservando IDs; los favoritos que ya no estén en el catálogo no deben provocar pérdida del diario. En la primera versión no hay migración desde otra app.

Desarrollo: Python http.server en loopback. Mantener URL/puerto para conservar el mismo origen de datos. Regenerar sw.js con scripts/update_cache.py después de cambiar contenido. Publicación en Pages desde main / raíz con .nojekyll. Antes de publicar comprobar pruebas, ausencia de datos privados, URL real y modo offline.

Objetivo inicial de transferencia de recursos offline: menos de 500 KB sin compresión. Evitar fotografías, fuentes remotas y librerías pesadas. El tamaño del diario depende del uso.

## Cambios futuros

V1.1: correcciones y feedback. V1.2: ampliar catálogo tras revisar fuentes. V2: estudiar traducción o empaquetado Android si existe demanda. Sin analítica ni premium de manera implícita.
