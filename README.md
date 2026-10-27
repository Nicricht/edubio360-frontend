# EduBío 360 — Evaluación Parcial 2

Proyecto React para explorar, comparar y orientar decisiones sobre ofertas de Educación Superior en la Región del Biobío. La entrega de la segunda evaluación está en [`ep2/`](ep2/README.md), dentro de esta rama `main`. Los archivos HTML de la primera evaluación se conservan en la raíz como antecedente de la migración.

## Ejecutar el proyecto React

Se requiere Node.js 22 y npm:

```bash
cd ep2
npm ci
npm run dev
```

Abrir la dirección local indicada por Vite. Para comprobar la entrega:

```bash
npm run test:coverage
npm run build
```

El reporte de cobertura se genera en `ep2/coverage/index.html`. El ERS y el informe de pruebas se encuentran en [`ep2/docs/`](ep2/docs/).

## Tecnologías

React, Vite, TypeScript, React Router, Bootstrap, Vitest y React Testing Library. Los datos de la demostración se guardan en LocalStorage y las sesiones por pestaña en SessionStorage. La compilación y los tests se verifican también en GitHub Actions.

## Accesos de demostración

- Estudiante: `estudiante@duoc.cl` / `1234`
- Orientador: `orientador@duoc.cl` / `1234`
- Administrador: `admin@duoc.cl` / `1234`

## Flujo principal

El visitante puede explorar el catálogo, revisar detalles, comparar ofertas equivalentes entre instituciones y consultar el mapa. Para solicitar orientación debe iniciar sesión como estudiante. El orientador puede tomar solicitudes, aceptar o reprogramar la atención, registrar observaciones y finalizarla. El administrador gestiona usuarios, roles y ofertas académicas.

## Demostración de roles

Usa pestañas del mismo navegador y la misma dirección (incluido el puerto). Inicia sesión como estudiante en una y como orientador en otra: las solicitudes y notificaciones se actualizan entre ambas. Los datos se guardan en LocalStorage y las sesiones por pestaña en SessionStorage; no se comparten entre navegadores o equipos.

Las tarjetas de cada panel abren los listados correspondientes. Las solicitudes canceladas y atendidas se conservan, y los avisos leídos pueden consultarse nuevamente. El administrador puede revisar todas las solicitudes desde su panel; el orientador consulta el catálogo, toma solicitudes disponibles y gestiona las asignadas a su cuenta.
