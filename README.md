# EduBío 360 — Evaluación Parcial 2

**DSY1104 · Desarrollo Fullstack II**

Versión React + Vite + TypeScript del frontend de EduBío 360 integrada con Spring Boot para la Evaluación Parcial 3. El proyecto se ejecuta desde la raíz de este repositorio.

## Instalación y ejecución

La demo publicada en GitHub Pages se abre desde un navegador sin instalar Node.js. Para publicarla, en `Settings > Pages` elegir `GitHub Actions` como origen; el flujo `Publicar demo en GitHub Pages` compila y actualiza el sitio en cada cambio de `main`. Su dirección será `https://nicricht.github.io/edubio360-frontend/`. En esa versión las rutas se muestran después de `/#/` para que funcionen también al recargar la página.

El modo real es el predeterminado. Primero levanta el [backend](https://github.com/Nicricht/edubio360-backend/tree/nico) con Docker Compose y comprueba `http://localhost:8080/actuator/health`. Vite dirige `/api` al Gateway en el puerto 8080; no necesita URL externa ni claves de base de datos.

Se requiere Node.js 22 y npm. Desde la raíz del repositorio:

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

Desde la raíz del repositorio, con Docker en funcionamiento:

```bash
docker build -t edubio360-ep2 .
docker run --rm --network edubio360-backend-nico_default -p 127.0.0.1:8088:80 edubio360-ep2
```

Abrir `http://localhost:8088`. El nombre de la red debe coincidir con el proyecto Compose del backend (`docker network ls`); se muestra el ejemplo de una carpeta llamada `edubio360-backend-nico`. Nginx dirige `/api` al servicio `api-gateway:8080`. El contenedor usa Nginx y permite acceder directamente a rutas de React Router. El flujo de GitHub Actions `EP2 React y Docker` verifica la compilación, los tests y la respuesta HTTP del contenedor al actualizar `main`.

## Vistas y funcionalidades

| Vista | Ruta | Funciones |
|---|---|---|
| Inicio | `/` | Presentación y ofertas destacadas |
| Catálogo | `/carreras` | 21 ofertas originales, búsqueda, filtro de área y comuna |
| Detalle | `/carreras/:id` | Información y acceso a comparación/orientación |
| Comparación | `/comparar` | Hasta 3 carreras de un mismo grupo |
| Mapa | `/mapa` | Selección de las cinco sedes, mapa y acceso a catálogo filtrado |
| Registro e ingreso | `/registro`, `/login` | Formularios validados y sesión JWT por pestaña en modo real |
| Estudiante | `/estudiante` | Panel, perfil, solicitudes, historial, notificaciones |
| Orientación | `/solicitar` | Envío de solicitud, motivo y fecha preferida |
| Orientador | `/orientador` | Solicitudes disponibles, asignación, gestión y resultados |
| Administración | `/admin` | CRUD de ofertas y usuarios, consulta de solicitudes |
| Institucional | `/nosotros`, `/contacto`, `/novedades` | Información, consultas y artículos |

Solo en la demo estática de EP2 (`VITE_REAL_API=false`) se mantienen los correos de ejemplo:

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

**Atomic Design** organiza la interfaz, mientras que el patrón **Repository** separa la persistencia de los componentes. En modo real, las operaciones CRUD, solicitudes, perfil y notificaciones se envían al API Gateway y se persisten en MySQL; los repositorios locales quedan reservados a la demo y las pruebas.

## Alcance y precauciones

Los valores académicos corresponden a datos de ejemplo e históricos; deben verificarse con cada institución. En modo real el JWT se guarda en `sessionStorage` y se verifica con el backend; los permisos se aplican en el servidor. La demo estática no usa backend ni credenciales reales.

La versión React conserva el catálogo, el comparador y los flujos de roles del EP1. El mapa utiliza una vista incrustada de OpenStreetMap por sede. Las solicitudes del modo real se persisten y generan eventos internos de notificación; las solicitudes de la demo son simuladas.

Los entregables académicos incluyen el repositorio y su historial de trabajo en ramas, un ZIP del proyecto, el ERS actualizado y el informe de pruebas/cobertura. La explicación y demostración individual se preparan sobre los comandos, componentes y flujos realmente implementados.
