# Seguridad

## Modelo de amenazas

Datos a proteger: notas, medidas, altura, historial y favoritos. Amenazas consideradas: pérdida de dispositivo, acceso a sesión abierta, importaciones malformadas, inyección de HTML, errores de cuota y actualizaciones incompletas. Fuera de las garantías: dispositivo comprometido, extensiones con permisos amplios, scripts de otros proyectos del mismo origen, análisis forense, copias externas.

Medidas: DOM construido con textContent y nodos; sin innerHTML ni eval; CSP de recursos propios; validación estricta y límite de 5 MB al importar; whitelist de campos; transacción IndexedDB antes de confirmar éxito; cachés y base independientes; activación explícita de actualizaciones; enlaces externos con noopener/noreferrer. Sin claves ni SDK externos.

Los nombres de caché incluyen el scope del service worker. La base usa el identificador exclusivo mesa-serena-v1. Eso evita colisiones accidentales pero no aísla proyectos dentro del mismo origen GitHub Pages.

No hay cifrado propio ni recuperación remota. No usar como registro clínico. Informar un problema sin ejemplos con datos personales; usar datos sintéticos.
