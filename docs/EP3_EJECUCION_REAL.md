# Ejecución Fullstack EP3

La compilación normal de React usa la API real. El modo local de EP2 solo se mantiene de forma explícita (VITE_REAL_API=false) y en pruebas de regresión; no se debe usar para presentar la integración Fullstack. npm run dev utiliza el proxy Vite hacia localhost:8080. El contenedor nginx utiliza el DNS privado api-gateway:8080 y reenvía /api, /openapi y Swagger; no requiere exponer directamente los microservicios.

Sesión: JWT en sessionStorage para persistencia al recargar la pestaña, comprobación /api/auth/me, cierre al recibir 401 en petición autenticada. Pendiente validar vencimiento, cambios de rol e invalidación de token en toda la arquitectura. No almacenar contraseñas en el navegador ni en GitHub.

Los resultados de tests unitarios que usan mocks no equivalen a una prueba real navegador → Gateway → microservicio → MySQL. Esa certificación se realiza con la infraestructura conjunta y usuarios de prueba.
