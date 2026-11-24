# EP3: paquete de trabajo catálogo y orientación

Este incremento añade clientes HTTP tipados y pruebas con fetch simulado. Aún no sustituye los contextos locales del frontend ni acredita integración real. La rama se entrega como base de colaboración; conservar autoría e historial de los cambios, y registrar las aportaciones efectivamente realizadas.

## Contrato compartido
- Gateway: VITE_API_URL apunta a la URL del backend, sin /api al final. En desarrollo puede configurarse un proxy Vite para /api.
- Catálogo: GET /api/ofertas, GET /api/sedes, GET /api/ofertas/{id}, POST /api/ofertas, PUT y DELETE /api/ofertas/{id}.
- Orientación: POST /api/solicitudes, GET /api/solicitudes/mias, PUT /api/solicitudes/{id}/confirmar y /cancelar.
- Los IDs remotos son numéricos; el frontend debe adaptar los identificadores de su interfaz.
- Enviar JWT válido proporcionado por el módulo de sesión; no confiar en roles ni correos escritos en cabeceras desde el navegador.

## Trabajo a completar y revisar
1. Conectar DatosContext y catálogo a los clientes REST, manejar carga, errores y sedeId; verificar creación, edición y eliminación reales.
2. Conectar OrientacionContext y sus formularios, adaptar CONFIRMADA/COMPLETADA a los estados de la interfaz sin perder información.
3. Completar notificaciones y estados de orientación en coordinación con el contrato backend; no usar localStorage como fuente de verdad.
4. Ejecutar npm ci, npm run build, npm run test:run, y validar el flujo real en navegador con backend MySQL.
5. Capturar evidencias reales para los anexos; abrir un PR hacia main y no fusionar si fallan las verificaciones.

El módulo de sesión, usuarios, seguridad del Gateway, infraestructura y observabilidad quedan en el paquete coordinado por el otro integrante. No publicar claves ni datos personales.
