# Informe de validación

Fecha: 4 de octubre de 2026. Pruebas con datos ficticios en perfiles temporales de Chrome de escritorio. No se instalaron paquetes ni navegadores; se utilizó el Chrome existente y el runtime de pruebas ya disponible.

## Automatizadas

11 pruebas de lógica: IMC, cintura/altura, decimales y límites, nutrientes ausentes, conversión de porciones, sumas de recetas, conteo e integridad del catálogo, energía de referencia USDA, roundtrip de respaldos, archivos inválidos, fechas, duplicados, favoritos y whitelist de preferencias.

Validación Python: 50 alimentos, 10 recetas, 8 lecturas, referencias de ingredientes y fuentes, recursos offline existentes, versión de caché consistente con contenido, ausencia de innerHTML en módulos de aplicación. Recursos offline ~111 KB sin compresión.

18 comprobaciones E2E: caché completa; diario tras recargar; protección de borradores al navegar; búsqueda/favoritos/porciones; cálculos y gráficos; añadir fecha histórica sin borrar hoy; importación dañada sin pérdida; exportación válida; eliminación y restauración; ocultar mediciones sin borrarlas; límite de tres hábitos; recarga y consulta offline; tema oscuro persistente; ausencia de desbordamiento a 320 y 390 px; ausencia de errores de ejecución y peticiones externas; descarga inicial incompleta y recuperación; almacenamiento no disponible; capturas funcionales con perfil vacío.

3 comprobaciones de actualización: mantiene formulario sin guardar hasta confirmación; activación conserva diario y hábitos; nueva caché funciona offline bajo subcarpeta /project/ y retira únicamente su caché anterior.

## Reproducción

- `node tests/core.test.mjs`
- `python3 scripts/validate.py`
- `python3 -m http.server 8765 --bind 127.0.0.1`
- `PLAYWRIGHT_PATH=/ruta/existente/a/playwright node tests/e2e.cjs`
- `PLAYWRIGHT_PATH=/ruta/existente/a/playwright node tests/update.cjs`

Para cálculos sin Node: abrir tests/index.html desde el servidor. Las pruebas E2E crean perfiles temporales; nunca usar un perfil personal con registros reales.

## Inspección visual

Vista de escritorio y móvil revisadas mediante capturas. Navegación por enlaces, etiquetas de formulario, estado accesible, texto dinámico sin HTML, gráficos con tabla y controles táctiles de al menos 48 px. No equivale a auditoría completa WCAG.

## Límites explícitos

Pendiente: instalación y uso en teléfono físico; lectores de pantalla reales; Safari/iOS y otros motores; revisión clínica independiente. No se hicieron pruebas de eficacia médica. La primera versión de IndexedDB no necesita migración previa; cualquier cambio de esquema futuro debe añadir fixtures y pruebas de migración.

Los datos viven en el origen web. Cambiar dominio/puerto requiere exportar y restaurar manualmente. La app no ofrece sincronización, cifrado propio ni garantía de conservación frente al borrado del navegador. Usar una sola pestaña para editar registros evita conflictos entre sesiones simultáneas.
