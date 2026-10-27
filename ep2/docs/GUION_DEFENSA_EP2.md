# Guion de presentación de EduBío360 EP2

**Asignatura:** DSY1104 Desarrollo Fullstack II

**Tiempo disponible:** 10 minutos por equipo y 10 minutos de preguntas.

## Distribución de los 10 minutos

| Tiempo | Demostración | Concepto que explicar |
|---|---|---|
| 0:00 a 1:00 | Abrir la portada y el catálogo | Migración HTML a React, Vite y TypeScript; 21 ofertas iniciales |
| 1:00 a 2:00 | Mostrar una tarjeta y un formulario | Atomic Design: átomos, moléculas, organismos y propiedades tipadas |
| 2:00 a 3:00 | Mostrar `src/services/repositories.ts` | Patrón Repository separado de Atomic Design; origen de datos simulado |
| 3:00 a 5:00 | Crear, editar y eliminar una oferta o un usuario en administración | `useState`, formulario controlado, validaciones y las cuatro operaciones CRUD |
| 5:00 a 6:00 | Filtrar catálogo y entrar al detalle | Texto, comuna y área, React Router, parámetro `:id` |
| 6:00 a 7:00 | Mostrar versión móvil y formulario administrativo | Bootstrap, columnas responsive y navegación |
| 7:00 a 8:30 | Ejecutar `npm run test:run` | Vitest, React Testing Library, jsdom y 78 pruebas |
| 8:30 a 9:30 | Ejecutar `npm run test:coverage` y abrir `coverage/index.html` | 92,25 % líneas, 82,31 % ramas, 83,01 % funciones; límites de la cobertura |
| 9:30 a 10:00 | Mostrar los commits de cada integrante | Trabajo con ramas, contribuciones reales y decisiones tomadas |

## Demostración de pruebas seleccionadas

1. **Validación:** ejecutar la prueba `muestra error contextual al enviar Contacto vacío` en `src/pages/Formularios.test.tsx`. Preparación: formulario vacío. Acción: clic en Enviar. Comprobación: aparecen tres mensajes de error.
2. **Filtros:** ejecutar la prueba `filtra por texto y actualiza las tarjetas` en `src/pages/Catalogo.test.tsx`. Preparación: catálogo con 21 registros. Acción: búsqueda de automatización y control. Comprobación: aparece una única tarjeta correspondiente.
3. **CRUD:** ejecutar `crea una oferta desde el formulario y actualiza el listado` en `src/pages/AdminOfertas.test.tsx`. Preparación: listado inicial y formulario nuevo. Acción: ingresar información válida y guardar. Comprobación: aparece la nueva oferta y la cantidad pasa a 22.
4. **Espía:** ejecutar `guarda las ofertas con la clave correcta del almacenamiento` en `src/services/repositories.test.ts`. Acción: crear una oferta. Comprobación: `vi.spyOn` detecta la escritura en `edubio360:ofertas` y se comprueba el registro persistido. Se utiliza `mockRestore` para restaurar el método.
5. **Bootstrap:** ejecutar `organiza el formulario con columnas responsivas de Bootstrap` en `src/pages/AdminOfertas.test.tsx`. Comprobación: el formulario utiliza `col-md-6`, `col-md-4` y `col-12`. Es una prueba estructural; no sustituye una revisión visual real.

## Preguntas que pueden aparecer

**¿Por qué TypeScript?** Porque la pauta lo exige y permite tipar las propiedades, los registros y las funciones de los componentes.

**¿Atomic Design es el patrón Repository?** No. Atomic Design estructura la interfaz en átomos, moléculas y organismos. Repository separa el acceso y persistencia de datos de las vistas.

**¿Dónde está la base de datos?** Esta EP2 utiliza `localStorage` para datos locales y `sessionStorage` para sesiones de demostración. No hay backend; el ERS declara este límite.

**¿Qué comprueba `expect`?** La condición concreta que debe cumplirse después de ejecutar la acción de la prueba. Una prueba que pasa no garantiza que toda la aplicación carezca de errores.

**¿Para qué sirve `vi.spyOn`?** Permite observar una función existente. En nuestro caso verifica que el repositorio llame a `setItem` con la clave correcta; se restaura con `mockRestore`.

**¿Por qué las ramas no están al 100 %?** Algunas condiciones y caminos de error no se ejecutan en los casos actuales. La pauta no fija un mínimo de cobertura, pero exige analizar los comportamientos pendientes.

**¿Por qué no Jasmine, Karma o JaCoCo?** La pauta EP2 pide Vitest, React Testing Library y jsdom. JaCoCo corresponde a Java y no es aplicable a la cobertura de este frontend.

**¿Qué hizo cada integrante?** Mostrar el historial Git real y explicar los cambios que realizó efectivamente cada persona. No atribuirse commits o trabajos que no haya realizado.

## Preparación antes de la presentación

- Ejecutar `npm ci`, `npm run build`, `npm run test:run` y `npm run test:coverage` en `ep2/`.
- Abrir `coverage/index.html` y tener una terminal visible con las pruebas aprobadas.
- Comprobar los tres perfiles de demostración: estudiante, orientador y administrador.
- Verificar en navegador móvil, tableta y escritorio el catálogo, la navegación y los formularios.
- Mostrar las cuatro acciones CRUD y el resultado inmediato en las listas.
- Confirmar quién realizó cada aporte a partir de Git y GitHub antes de asignar partes del discurso.
