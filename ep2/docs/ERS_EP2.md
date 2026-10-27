# EduBío 360

## Especificación de Requisitos de Software — Evaluación Parcial 2

**Asignatura:** DSY1104 · Desarrollo Fullstack II

**Proyecto:** EduBío 360

**Versión:** EP2 · React, Vite y TypeScript

**Fecha:** 26 de octubre de 2026

### 1. Propósito

EduBío 360 facilita la exploración y comparación de carreras de educación superior en la Región del Biobío y permite coordinar solicitudes de orientación académica. La Evaluación Parcial 2 contempla la migración del frontend desarrollado en HTML, CSS y JavaScript a React, Vite y TypeScript, conservando las funciones comprometidas en la primera evaluación.

### 2. Alcance

La aplicación dispone de una interfaz pública y tres perfiles de uso: estudiante, orientador y administrador. La información y las operaciones se simulan en el navegador mediante almacenamiento local. No se contempla integración con un backend, servicios de correo, pasarelas de pago ni autenticación productiva.

El catálogo inicial incorpora las 21 ofertas de la primera evaluación. Se presentan los valores académicos como antecedentes referenciales, sujetos a verificación con las instituciones.

### 3. Actores

| Actor | Responsabilidades |
|---|---|
| Visitante | Consultar el catálogo, los detalles, el mapa y el comparador; registrarse o iniciar sesión |
| Estudiante | Gestionar su perfil, solicitar orientación, revisar estados e historial y leer notificaciones |
| Orientador | Tomar solicitudes disponibles, aceptar o reprogramar atenciones, registrar resultados y consultar el historial |
| Administrador | Mantener ofertas y usuarios mediante CRUD completo y consultar solicitudes |

### 4. Requisitos funcionales

| Código | Requisito | Criterio de aceptación |
|---|---|---|
| RF-01 | Presentar las ofertas académicas | Mostrar las 21 ofertas iniciales y los registros creados por administración |
| RF-02 | Buscar y filtrar ofertas | Aplicar texto, área y comuna; permitir limpiar filtros; informar cuando no haya resultados |
| RF-03 | Visualizar detalles | Acceder por URL con identificador y mostrar un estado de oferta inexistente cuando corresponda |
| RF-04 | Comparar ofertas | Mantener hasta tres ofertas equivalentes, mostrar costos y características y permitir quitarlas |
| RF-05 | Consultar mapa | Seleccionar una de las cinco sedes y abrir el catálogo filtrado por comuna |
| RF-06 | Registrar estudiantes | Validar RUN, correo, nombres, región, comuna y dirección mediante formulario controlado |
| RF-07 | Iniciar y cerrar sesión | Validar las cuentas de demostración, mantener la sesión por pestaña y redirigir al panel del perfil |
| RF-08 | Restringir vistas por rol | Enviar a ingreso si no existe sesión y redirigir al panel propio ante una ruta no autorizada |
| RF-09 | Crear solicitudes de orientación | Registrar carrera, motivo y fecha no anterior al día actual; conservar las alternativas comparadas cuando corresponda; iniciar en estado pendiente |
| RF-10 | Administrar solicitudes como estudiante | Mostrar solicitudes propias, solicitar reprogramaciones y cancelar solicitudes activas |
| RF-11 | Gestionar solicitudes como orientador | Tomar solicitudes disponibles y registrar estado, fecha, observaciones y resultado de atención |
| RF-12 | Conservar historial y avisos | Registrar cambios de estado y notificaciones consultables desde el panel del estudiante |
| RF-13 | Mantener ofertas | Crear, listar, editar y eliminar ofertas, incluyendo cupos y umbral crítico |
| RF-14 | Mantener usuarios | Crear, listar, editar y eliminar registros, asignar perfil estudiante, orientador o administrador y activar o desactivar cuentas |
| RF-15 | Consultar contenidos institucionales | Presentar inicio, nosotros, novedades, artículos y contacto |

### 5. Requisitos no funcionales

| Código | Requisito | Criterio |
|---|---|---|
| RNF-01 | Plataforma frontend | React, Vite y TypeScript con compilación de producción |
| RNF-02 | Arquitectura de interfaz | Atomic Design, separación en átomos, moléculas, organismos y páginas |
| RNF-03 | Patrón de diseño | Repositorios genéricos para ofertas y usuarios, separados de los componentes |
| RNF-04 | Estado y formularios | Uso de `useState`, propiedades tipadas y validaciones con mensajes específicos |
| RNF-05 | Navegación | React Router con rutas públicas, protegidas y de detalle por parámetro |
| RNF-06 | Adaptación a dispositivos | Bootstrap con distribución flexible para móvil, tableta y escritorio |
| RNF-07 | Calidad y pruebas | Vitest, React Testing Library, jsdom y reporte de cobertura |
| RNF-08 | Persistencia de demostración | `localStorage` para ofertas, usuarios, comparaciones y solicitudes; `sessionStorage` para sesión |
| RNF-09 | Ejecución reproducible | Scripts npm y contenedor Docker con Nginx |

### 6. Reglas del negocio

1. El comparador admite tres ofertas como máximo, todas del mismo grupo académico.
2. Solo el estudiante propietario puede cancelar o solicitar reprogramación de una solicitud activa.
3. El orientador puede tomar solicitudes pendientes o reprogramadas que no tengan responsable.
4. La gestión de una solicitud asignada corresponde al orientador responsable.
5. Una atención marcada como atendida requiere registrar el resultado.
6. Una atención finalizada o cancelada no admite nuevas modificaciones.
7. El registro y la actualización de ofertas y usuarios se reflejan en la interfaz sin recarga manual.
8. El mapa depende de OpenStreetMap para mostrar cartografía; el catálogo y los datos locales pueden consultarse sin ese servicio.

### 7. Datos y restricciones

El conjunto inicial de ofertas se tomó del catálogo funcional de EP1. Contiene instituciones, comunas, áreas, jornada, duración, valores de matrícula y arancel, imágenes, cupos y grupos de comparación.

La autenticación usa tres cuentas de demostración con clave común. No debe interpretarse como un control de seguridad equivalente a un servidor. Los datos son locales al navegador y no se sincronizan entre equipos.

### 8. Vistas principales

Inicio, catálogo, detalle, comparador, mapa, registro, ingreso, panel de estudiante, solicitud de orientación, solicitudes, notificaciones, perfil, panel de orientador, gestión de solicitud, panel administrativo, ofertas, usuarios, solicitudes generales, noticias, nosotros y contacto.

### 9. Condiciones de entrega

El proyecto se ejecuta desde `ep2/` con `npm ci` y `npm run dev`. La validación técnica considera `npm run build`, `npm run test:coverage` y el flujo de GitHub Actions para construir y comprobar el contenedor Docker. El repositorio debe evidenciar cambios en ramas y aportes identificables del equipo. La defensa individual requiere explicar las decisiones y ejecutar las funciones y pruebas seleccionadas.
