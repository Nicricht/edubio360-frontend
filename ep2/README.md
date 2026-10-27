# EduBío 360 — Evaluación Parcial 2

**DSY1104 · Desarrollo Fullstack II**

Versión React + Vite + TypeScript del frontend de EduBío 360. Las páginas de la primera evaluación están conservadas en la raíz del repositorio. Esta carpeta corresponde a la migración EP2.

## Instalación y ejecución

Se requiere Node.js 22 y npm. Desde `ep2/`:

```bash
npm ci
npm run dev
```

Abrir la dirección indicada por Vite, habitualmente `http://localhost:5173`.

```bash
npm run build
npm run test:run
npm run test:coverage
```

El reporte de cobertura se genera en `coverage/index.html`. La evaluación no exige un porcentaje fijo de cobertura.

## Docker

Desde `ep2/`, con Docker en funcionamiento:

```bash
docker build -t edubio360-ep2 .
docker run --rm -p 8080:80 edubio360-ep2
```

Abrir `http://localhost:8080`. El contenedor usa Nginx y permite acceder directamente a rutas de React Router. El flujo de GitHub Actions `EP2 React y Docker` verifica la compilación, los tests y la respuesta HTTP del contenedor al actualizar la rama de EP2.

## Vistas y funcionalidades

| Vista | Ruta | Funciones |
|---|---|---|
| Inicio | `/` | Presentación y ofertas destacadas |
| Catálogo | `/carreras` | 21 ofertas originales, búsqueda, filtro de área y comuna |
| Detalle | `/carreras/:id` | Información y acceso a comparación/orientación |
| Comparación | `/comparar` | Hasta 3 carreras de un mismo grupo |
| Mapa | `/mapa` | Selección de las cinco sedes, mapa y acceso a catálogo filtrado |
| Registro e ingreso | `/registro`, `/login` | Formularios validados y sesiones simuladas por pestaña |
| Estudiante | `/estudiante` | Panel, perfil, solicitudes, historial, notificaciones |
| Orientación | `/solicitar` | Envío de solicitud, motivo y fecha preferida |
| Orientador | `/orientador` | Solicitudes disponibles, asignación, gestión y resultados |
| Administración | `/admin` | CRUD de ofertas y usuarios, consulta de solicitudes |
| Institucional | `/nosotros`, `/contacto`, `/novedades` | Información, consultas y artículos |

Los accesos de demostración mantienen los correos de EP1:

- Estudiante: `estudiante@duoc.cl`
- Orientador: `orientador@duoc.cl`
- Administrador: `admin@duoc.cl`

La clave de demostración para los tres roles es `1234`. No se utiliza un sistema real de autenticación ni se deben ingresar credenciales personales.

## Componentes y patrón

- `src/components/atoms`: elementos básicos como campos, marca y precio.
- `src/components/molecules`: tarjetas y estados de listados.
- `src/components/organisms`: encabezado, pie y formularios completos.
- `src/pages`: vistas accesibles por React Router.
- `src/context`: datos, sesión y seguimiento de orientación con `useState`.
- `src/services`: repositorios de ofertas/usuarios, sesiones y solicitudes de orientación.
- `src/data`: 21 ofertas históricas y cuentas de ejemplo migradas de EP1.
- `src/utils`: filtros y validaciones independientes.

**Atomic Design** organiza la interfaz, mientras que el patrón **Repository** separa la persistencia de los componentes. Las operaciones CRUD de ofertas y usuarios se guardan localmente, y las solicitudes y notificaciones se almacenan también en el navegador.

## Alcance y precauciones

Los valores académicos corresponden a datos de ejemplo e históricos; deben verificarse con cada institución. No existen backend, base de datos remota ni seguridad de servidor. La sesión se guarda por pestaña y los datos se comparten entre pestañas del mismo origen a través de `localStorage`.

La versión React conserva el catálogo, el comparador y los flujos de roles del EP1. El mapa utiliza una vista incrustada de OpenStreetMap por sede, mientras que el HTML original conserva su implementación con Leaflet. Las solicitudes son simuladas y no generan comunicaciones externas.

Los entregables académicos incluyen el repositorio y su historial de trabajo en ramas, un ZIP del proyecto, el ERS actualizado y el informe de pruebas/cobertura. La explicación y demostración individual se preparan sobre los comandos, componentes y flujos realmente implementados.
