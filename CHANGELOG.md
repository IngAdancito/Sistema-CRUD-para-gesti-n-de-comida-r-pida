# Changelog

Todos los cambios relevantes del proyecto **FastFood Manager** se documentan
en este archivo.

El formato sigue el estándar [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el versionado se basa en [Versionado Semántico (SemVer)](https://semver.org/lang/es/).

## [1.1.0] - 2026-05-07

### Añadido

- Pipeline de Integración Continua con **GitHub Actions** (`.github/workflows/ci.yml`)
- Suite de **18 pruebas unitarias** para funciones puras (`tests/utils.test.js`)
- Módulo `lib/utils.js` con funciones reutilizables y testeables:
  `formatearPrecio`, `escapeHtml`, `nextId`, `calcularTotalPedido`,
  `filtrarPorCategoria`
- Configuración de **ESLint 9** con reglas de calidad de código
- Configuración de **html-validate** para validación de HTML
- Script de build (`scripts/build.js`) que empaqueta el entregable en `dist/`
- Generación automática de **reportes JUnit XML** en cada ejecución del pipeline
- Documentación del flujo de integración en `docs/CI-FLOW.md` con diagrama Mermaid

### Cambiado

- `package.json` ahora declara dependencias y scripts del proyecto
- `.gitignore` extendido para excluir `node_modules/`, `dist/` y `reports/`

### Corregido

- Regla `no-implicit-button-type` desactivada en html-validate para evitar
  falsos positivos en botones de navegación

## [1.0.0] - 2026-05-06

### Añadido

- Estructura HTML base con sistema de **pestañas** (Productos, Clientes, Pedidos, Dashboard)
- **CRUD de Productos** con campos nombre, categoría, precio, stock y descripción
- Filtros de búsqueda y filtrado por categoría en productos
- **CRUD de Clientes** con datos de contacto completos
- **CRUD de Pedidos** con relación cliente-productos y cálculo automático de total
- Estados de pedido: *Pendiente*, *En preparación*, *Entregado*, *Cancelado*
- **Dashboard** con métricas: total de productos, clientes, pedidos e ingresos
- Botón de carga de **datos demo** y de borrado total
- Notificaciones tipo *toast* y confirmaciones de borrado
- Persistencia con `localStorage` del navegador
- Diseño **responsive** para dispositivos móviles

### Seguridad

- Función `escapeHtml()` aplicada a todos los campos de texto para prevenir
  inyección XSS al renderizar contenido del usuario

## [0.1.0] - 2026-05-06

### Añadido

- Estructura inicial del proyecto
- README con descripción y guía de uso
- Configuración inicial de Git con flujo de ramas Git Flow simplificado

[1.1.0]: https://github.com/IngAdancito/Sistema-CRUD-para-gesti-n-de-comida-r-pida/releases/tag/v1.1.0
[1.0.0]: https://github.com/IngAdancito/Sistema-CRUD-para-gesti-n-de-comida-r-pida/releases/tag/v1.0
[0.1.0]: https://github.com/IngAdancito/Sistema-CRUD-para-gesti-n-de-comida-r-pida/commits/main
