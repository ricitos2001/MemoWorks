# DOCUMENTACIÓN DE DISEÑO — MemoWorks

## Índice

- Fase 1 — Fundamentos y Arquitectura CSS
  - 1.1 Principios de comunicación visual
  - 1.2 Metodología CSS
  - 1.3 Organización de archivos (ITCSS)
  - 1.4 Sistema de Design Tokens (SCSS)
  - 1.5 Mixins y funciones
  - 1.6 ViewEncapsulation en Angular
- Fase 2 — HTML semántico y componentes de layout
  - 2.1 Elementos semánticos utilizados
  - 2.2 Jerarquía de headings
  - 2.3 Estructura de formularios y componente `app-form-input`
- Fase 3 — Componentes UI básicos
  - 3.1 Componentes implementados
  - 3.2 Nomenclatura y metodología (BEM)
  - 3.3 Style Guide
- Cómo colaborar y buenas prácticas
- Rutas de interés en el repositorio
- Placeholders para capturas y recursos visuales

---

# Fase 1 — Fundamentos y Arquitectura CSS

Objetivo: establecer una base sólida y reutilizable para todos los estilos del proyecto: design tokens, mixins, sistema de ficheros ITCSS, reset, estilos base y un grid de layout.

## 1.1 Principios de comunicación visual

Aplicamos los siguientes 5 principios en todo el producto. Para cada principio indico cómo se aplica en MemoWorks.

1) Jerarquía
- Uso de la escala tipográfica y pesos para indicar importancia: `h1` (5xl, semibold), `h2` (3xl), `h3` (2xl), cuerpo (base, regular).
- Espaciado consistente (variables `spacing-*`) para separar secciones y destacar bloques.
- Ejemplo práctico: en la `card` el título usa `font-size: $font-size-2xl` y `margin-bottom: $spacing-2` mientras la descripción usa `font-size: $font-size-base`.

2) Contraste
- Uso de `color-primary` sobre fondos neutrales para acciones principales.
- Contraste tipográfico entre texto principal (neutral-900) y secundarios (neutral-600).
- Para estados interactivos (hover/focus) se aumenta ligeramente el contraste o la elevación (shadow-md).

3) Alineación
- Sistema de grid con contenedor centrado y gutters definidos por `spacing-4`.
- Títulos y textos principales alineados a la izquierda para lectura occidental; elementos de navegación centrados en headers compactos.

4) Proximidad
- Agrupamos controles relacionados dentro de `fieldset` y usamos `spacing-2`/`spacing-3` para indicar relación.
- Tarjetas con `padding: $spacing-4` y separaciones internas menores (`spacing-2`) para elementos relacionados.

5) Repetición
- Uso de un conjunto reducido de patrones visuales (botones, cards, formularios) y variables globales para mantener coherencia.
- Reutilización de clases BEM (`.button--primary`, `.card`, `.alert--success`) en todo el proyecto.

Capturas de Figma (placeholders):
- Insertar captura que señale jerarquía: `docs/design/screenshots/figma-jerarquia.png`
- Insertar captura sobre contraste: `docs/design/screenshots/figma-contraste.png`
- Insertar captura sobre alineación: `docs/design/screenshots/figma-alineacion.png`
- Insertar captura sobre proximidad: `docs/design/screenshots/figma-proximidad.png`
- Insertar captura sobre repetición: `docs/design/screenshots/figma-repeticion.png`

> Nota: Añade las capturas exportadas desde Figma en `docs/design/screenshots/` y actualiza las rutas si es necesario.

## 1.2 Metodología CSS

Metodología principal: BEM + ITCSS.

- BEM: Bloques, Elementos y Modificadores.
  - Block: `.card`
  - Element: `.card__title`, `.card__body`
  - Modifier: `.card--featured`, `.button--primary`

Reglas básicas BEM que seguimos:
- Un component es un bloque. Nombres en inglés y en minúsculas con guiones (`kebab-case`).
- Elementos usan `__` y modificadores `--`.
- Los estados no interactivos (p. ej. `disabled`) pueden representarse con un atributo (`[disabled]`) o con clase `.is-disabled` según contexto.

Por qué BEM: facilita localización y mantenimiento, evita colisiones y hace predecible la CSS cuando se escala el proyecto.

## 1.3 Organización de archivos (ITCSS)

Estructura de `src/styles/` que usamos (orden de menor a mayor especificidad):

- 00-settings/
  - `_variables.scss`         // Design tokens (colors, type, spacing, breakpoints)
  - `_css-variables.scss`     // CSS Custom Properties para theming
- 01-tools/
  - `_mixins.scss`            // Mixins y funciones reutilizables
- 02-generic/
  - `_reset.scss`             // Reset / Normalize
- 03-elements/
  - `_base.scss`              // Estilos de elementos HTML (p, a, h1..h6, lists)
- 04-layout/
  - `_grid.scss`
  - `_header.scss`
  - `_footer.scss`
  - `_layout.scss`            // Grid y contenedores globales
- 05-components/
  - `_button.scss`
  - `_card.scss`
  - `_form.scss`
  - ...                      // Componentes encapsulados
- 06-utilities/
  - `_helpers.scss`           // Utilities atómicas (display, spacing helpers)
- 07-pages/
  - `_style-guide.scss`

Importación en `styles.scss` (orden crítico):

1. `@import '00-settings/variables';`
2. `@import '00-settings/css-variables';`
3. `@import '01-tools/mixins';`
4. `@import '02-generic/reset';`
5. `@import '03-elements/base';`
6. `@import '04-layout/layout';`
7. `@import '05-components/button';` (y demás componentes)
8. `@import '06-utilities/helpers';`
9. `@import '07-pages/style-guide';`

Este orden garantiza que las variables y mixins estén disponibles antes de definir reglas que las usen, y que los estilos de baja especificidad sean cargados antes que los específicos de componentes.

## 1.4 Sistema de Design Tokens (SCSS)

Los tokens son la única fuente de verdad para colores, tipografías, tamaños y espaciados.
A continuación resumo los grupos principales y ejemplos de variables (ver `src/styles/00-settings/_variables.scss` para la implementación exacta):

1) Colores
- `$color-primary: #6C5CE7;`        // Color principal de la marca
- `$color-secondary: #F6C24A;`
- Neutrales: `$neutral-50` ... `$neutral-900` (de fondo muy claro a texto principal oscuro)
- Semánticos:
  - `$color-success: #22C55E;`
  - `$color-error: #EF4444;`
  - `$color-warning: #F97316;`
  - `$color-info: #3B82F6;`

Decisión: usar `rgba()` para sombras y micro-transparencias para que funcionen sobre fondos variables.

2) Tipografía
- Familias:
  - `$font-primary: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;`
  - `$font-secondary: 'Montserrat', sans-serif;` (si aplica)
- Pesos:
  - `$font-weight-light: 300;`
  - `$font-weight-regular: 400;`
  - `$font-weight-medium: 500;`
  - `$font-weight-semibold: 600;`
  - `$font-weight-bold: 700;`
- Escala tipográfica (ratio 1.25):
  - `$font-size-xs: 0.75rem;`
  - `$font-size-sm: 0.875rem;`
  - `$font-size-base: 1rem;`
  - `$font-size-lg: 1.25rem;`
  - `$font-size-xl: 1.563rem;`
  - `$font-size-2xl: 1.953rem;` ... hasta `5xl` según necesidad.
- Line-heights:
  - `$line-height-tight: 1.1;`
  - `$line-height-normal: 1.5;`
  - `$line-height-relaxed: 1.75;`

3) Espaciado
- Basado en 4px o 0.25rem como unidad base. Ejemplos:
  - `$spacing-1: 0.25rem;`  // 4px
  - `$spacing-2: 0.5rem;`   // 8px
  - `$spacing-3: 0.75rem;`
  - `$spacing-4: 1rem;`
  - ... hasta `$spacing-24: 6rem;`

4) Breakpoints
- `$breakpoint-sm: 640px;`
- `$breakpoint-md: 768px;`
- `$breakpoint-lg: 1024px;`
- `$breakpoint-xl: 1280px;`

5) Elevaciones (shadows)
- `$shadow-sm: 0 1px 2px rgba(0,0,0,0.04);`
- `$shadow-md: 0 4px 8px rgba(0,0,0,0.08);`
- `$shadow-lg: 0 10px 20px rgba(0,0,0,0.12);`
- `$shadow-xl: 0 20px 40px rgba(0,0,0,0.16);`

6) Bordes y radios
- `$border-thin: 1px;` `$border-medium: 2px;` `$border-thick: 4px;`
- Radios: `$radius-sm: 2px;` `$radius-md: 6px;` `$radius-lg: 12px;` `$radius-full: 9999px;`

7) Transiciones
- `$transition-fast: 150ms;`
- `$transition-base: 300ms;`
- `$transition-slow: 500ms;`
- Curva: `ease-in-out` por defecto.

Explicación de decisiones:
- Ratio tipográfico 1.25 proporciona escalado claro sin saltos bruscos.
- Breakpoints basados en dispositivos comunes (mobile→tablet→desktop).
- Escala de espaciado en múltiplos de 4px para mantener ritmo vertical consistente.

## 1.5 Mixins y funciones

Archivo: `src/styles/01-tools/_mixins.scss`

Mixins documentados y ejemplos de uso (estos son los mixins principales que implementamos):

1) `@mixin respond-to($breakpoint) { ... }`
- Simplifica media queries. Ejemplo de uso:
  ```text
  .card {
    padding: $spacing-3;
    @include respond-to(md) {
      padding: $spacing-4;
    }
  }
  ```

2) `@mixin truncate-lines($lines)`
- Trunca texto a N líneas con `-webkit-line-clamp`. Uso en tarjetas y descripciones.
  ```text
  .card__desc { @include truncate-lines(3); }
  ```

3) `@mixin visually-hidden()`
- Oculta visualmente elementos manteniéndolos accesibles para lectores de pantalla. Uso en labels que no deben mostrarse.

Otros mixins útiles incluidos: `center-flex()`, `icon-size($size)`, `transition($property: all, $duration: $transition-base)`.

## 1.6 ViewEncapsulation en Angular

Decisión: conservar `ViewEncapsulation.Emulated` por defecto.

Motivos:
- Permite que cada componente tenga estilos scoped evitando fugas accidentales hacia otros componentes.
- Mantiene los estilos globales (variables, resets, layout) en `styles.scss` y los estilos por componente en su propio `.scss`.

Cuándo usar `None` o `ShadowDom`:
- `None`: solo si necesitamos estilos globales que afecten al DOM entero (con cuidado). Recomendado para temas que afectan a todo el sitio cuando no se quiere repetir estilos.
- `ShadowDom`: si queremos aislamiento completo y evitar por completo la cascada (menos común en aplicaciones donde se comparte diseño y tokens).

---

# Fase 2 — HTML semántico y componentes de layout

Objetivo: crear contenedores semánticos reutilizables (header, main, footer, sidebar) y componentes de formulario accesibles.

## 2.1 Elementos semánticos utilizados

- `<header>`: cabecera global, contiene logo y navegación.
- `<nav>`: navegación principal, lista de enlaces.
- `<main>`: contenedor del contenido principal. Solo uno por página.
- `<aside>`: contenido secundario (sidebar, filtros).
- `<section>` / `<article>`: bloques de contenidos o artículos con sentido propio.
- `<footer>`: enlaces legales, copyright y redes.

Ejemplo de `app-header` (simplificado):

```html
<header class="header">
  <a class="header__logo" href="/">
    <img src="/assets/img/logo.svg" alt="MemoWorks">
  </a>
  <nav class="header__nav" aria-label="Navegación principal">
    <ul class="nav-list">
      <li class="nav-list__item"><a href="/">Inicio</a></li>
      <li class="nav-list__item"><a href="/tasks">Tareas</a></li>
    </ul>
  </nav>
  <button class="header__hamburger" aria-expanded="false" aria-controls="main-nav">☰</button>
</header>
```

Ejemplo de `app-main`:

```html
<main class="main"><ng-content></ng-content></main>
```

## 2.2 Jerarquía de headings

Reglas:
- Solo un `h1` por página (título principal de la vista).
- `h2` para secciones principales dentro de la página.
- `h3` para subsecciones, y así sucesivamente sin saltos de nivel (no usar `h4` si no hay `h3`).

Ejemplo jerárquico:
- `h1` — Dashboard
  - `h2` — Mis tareas
    - `h3` — Tareas urgentes
  - `h2` — Calendario

## 2.3 Estructura de formularios y `app-form-input`

Buenas prácticas en formularios:
- Usar `<form>` con `method` cuando aplica y `novalidate` si se gestiona validación por JS.
- Agrupar campos relacionados con `<fieldset>` y describirlos con `<legend>`.
- Asociar `label` con `input` mediante `for` y `id` para accesibilidad.
- Mostrar indicación visual de campo requerido (asterisco) y mensajes de error claros.

Ejemplo de uso del componente `app-form-input`:

```html
<form (ngSubmit)="onSubmit()">
  <fieldset>
    <legend>Acceso</legend>

    <app-form-input
      id="email"
      label="Correo electrónico"
      type="email"
      name="email"
      placeholder="tú@ejemplo.com"
      required
    ></app-form-input>

    <app-form-input
      id="password"
      label="Contraseña"
      type="password"
      name="password"
      required
    ></app-form-input>

    <button class="button button--primary" type="submit">Entrar</button>
  </fieldset>
</form>
```

Estructura interna recomendada de `app-form-input`:
- `label[for]` + `input[id]`
- Contenedor para `help text`
- Contenedor para `error message`

---

# Fase 3 — Componentes UI básicos

Objetivo: crear un set de componentes reutilizables con todas sus variantes y estados, y un Style Guide que sirva como referencia visual.

## 3.1 Componentes implementados

A continuación la lista de componentes obligatorios implementados y su documentación resumida.

1) Botones — `app-button` / `.button`
- Propósito: acciones primarias y secundarias.
- Variantes (modificadores):
  - `.button--primary` (acción principal)
  - `.button--secondary` (apoyo)
  - `.button--ghost` (sin fondo)
  - `.button--danger` (eliminar, destructivo)
- Tamaños:
  - `.button--sm`, `.button--md` (por defecto), `.button--lg`
- Estados soportados: `:hover`, `:focus` (outline accesible), `:active`, `[disabled]`.
- Ejemplo de uso:
  ```html
  <button class="button button--primary button--md">Guardar</button>
  ```

2) Cards — `app-card` / `.card`
- Propósito: contenedor de contenido resumido (imagen, título, descripción, acción).
- Variantes: básica (`.card`), horizontal (`.card--horizontal`).
- Estados: `:hover` eleva la card (`box-shadow` y `transform: translateY(-4px)` con `transition`).
- Ejemplo:
  ```html
  <article class="card">
    <img class="card__img" src="..." alt="..."/>
    <h3 class="card__title">Título</h3>
    <p class="card__desc">Descripción...</p>
  </article>
  ```

3) Textarea — `app-form-textarea` / `.textarea`
- Elemento `textarea` con `label`, `help` y `error`.

4) Select — `app-form-select` / `.select`
- `select` con `label` y opciones. Soporta placeholder y validación.

5) Alerts — `app-alert` / `.alert`
- Tipos: `.alert--success`, `.alert--error`, `.alert--warning`, `.alert--info`.
- Opcional: botón de cierre `aria-label="Cerrar alerta"`.

Componentes adicionales desarrollados (si aplica en el repo):
- `app-breadcrumbs`, `app-modal`, `app-badge` (documentar si están presentes en `src/app/components/shared/`).

## 3.2 Nomenclatura y metodología (BEM)

Ejemplos reales:
- `.card` (bloque)
  - `.card__title` (elemento)
  - `.card__actions` (elemento)
  - `.card--featured` (modificador)

Estado vs modificador:
- Preferir modificador en la definición de variantes visuales (`.button--ghost`) y clases de estado para interacciones JS (`is-open`, `is-active`) cuando el estado se maneja dinámicamente.

Utilities
- Utilidades atómicas limitadas en `06-utilities/_helpers.scss` (p. ej. `.u-mt-2`, `.u-text-center`) para no ensuciar la semántica de los componentes.

## 3.3 Style Guide

Ruta: `/style-guide` (componente `pages/style-guide`)

Qué incluye:
- Página que muestra cada componente con sus variantes, tamaños y estados.
- Bloques de ejemplo con el markup y el código SCSS usado.

Para mantenerla útil:
- Documentar nuevos componentes en la Style Guide al crear uno nuevo.
- Incluir pequeños ejemplos interactivos (botones que muestran `:hover` y `disabled`) y estados con datos reales.

Capturas del Style Guide (placeholder): `docs/design/screenshots/style-guide.png`

---

# Cómo colaborar y buenas prácticas

- Siempre usar variables en `_variables.scss` para colores, tipografías y espaciados. No hardcodear colores en los componentes.
- Añadir cualquier nuevo token en `00-settings/_variables.scss` y exportarlo a `00-settings/_css-variables.scss` si debe ser accesible como custom property para theming.
- Añadir estilos de componente en `05-components/` con su propio archivo `_component.scss` y un bloque en `styles.scss` para importarlo.
- Mantener los nombres BEM y documentar en la Style Guide.
- Preferir mixins de `01-tools/_mixins.scss` para media queries y transiciones.

Control de accesibilidad (A11Y):
- Labels asociados a inputs, roles y atributos `aria` donde sean necesarios.
- Focus visible para navegación con teclado.
- Contraste de color adecuado según WCAG (usar colores semánticos y variantes oscuras/claro cuando sea necesario).

---

# Rutas de interés en el repositorio

- `src/styles/00-settings/_variables.scss` — Design tokens (colores, tipografías, espaciado).
- `src/styles/00-settings/_css-variables.scss` — Custom properties para theming.
- `src/styles/01-tools/_mixins.scss` — Mixins y funciones.
- `src/styles/02-generic/_reset.scss` — Reset global.
- `src/styles/03-elements/_base.scss` — Estilos base de elementos HTML.
- `src/styles/04-layout/_layout.scss` — Grid y contenedores.
- `src/styles/05-components/` — SCSS por componente.
- `src/app/components/layout/` — Componentes `app-header`, `app-main`, `app-footer`.
- `src/app/components/shared/` — Componentes UI reutilizables: buttons, cards, forms.

---

# Placeholders para capturas y entregables gráficos

Incluye las siguientes imágenes en `docs/design/screenshots/`:
- `figma-jerarquia.png`
- `figma-contraste.png`
- `figma-alineacion.png`
- `figma-proximidad.png`
- `figma-repeticion.png`
- `style-guide.png`

Sugerencia: exporta desde Figma con resolución @2x y nombra las capturas exactamente como arriba para que los enlaces en este documento funcionen.

---

Si quieres, puedo:
- Generar automáticamente la estructura de `src/styles/` faltante y crear los `_variables.scss` y `_mixins.scss` con los tokens y mixins concretos.
- Crear ejemplos de componentes (HTML + SCSS) y ejecutar las pruebas/compilación.

Dime si quieres que aplique esos cambios directamente al repo ahora y creo los archivos básicos (variables, mixins y estructura ITCSS), o si prefieres que primero revises este documento y añadas las capturas de Figma.
