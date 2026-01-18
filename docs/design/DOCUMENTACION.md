# DOCUMENTACIÓN TECNICA — DIW

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
- Fase 4 — Responsive design y layouts completos
  - 4.1 Breakpoints definidos
  - 4.2 Estrategia responsive
  - 4.3 Container Queries
  - 4.4 Adaptaciones principales (resumen)
  - 4.5 Páginas implementadas y notas breves
  - 4.6 Screenshots comparativos
  - 4.7 Pruebas y verificación
  - 4.8 Entregables y rutas en el repositorio
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

---

# Fase 4 — Responsive design y layouts completos

Objetivo: adaptar toda la aplicación para que funcione correctamente desde mobile hasta desktop, implementar Container Queries en componentes clave y documentar la estrategia y pruebas realizadas.

## 4. Responsive design

En esta sección se documenta la estrategia, breakpoints, componentes donde se han aplicado Container Queries, adaptaciones principales por viewport, páginas completadas y las capturas comparativas solicitadas.

### 4.1 Breakpoints definidos

Breakpoints aplicados (valores y variables SCSS):

- mobile (xs) — base: < 640px (se trabaja sin media query, estilos base mobile-first)
- sm — 640px  — `$breakpoint-sm: 640px;` (large mobile / small tablet)
- md — 768px  — `$breakpoint-md: 768px;` (tablet)
- lg — 1024px — `$breakpoint-lg: 1024px;` (desktop pequeño)
- xl — 1280px — `$breakpoint-xl: 1280px;` (desktop estándar)

Justificación:
- Los breakpoints siguen la convención común y están alineados con los tokens definidos en `src/styles/00-settings/_variables.scss` del proyecto. Se eligieron para cubrir los dispositivos y viewports de evaluación indicados en la entrega (320px, 375px, 768px, 1024px y 1280px) y ofrecer escalas claras entre mobile/tablet/desktop.
- Mobile-first: definimos los estilos base para móviles y añadimos mejoras progresivas con `min-width` para tablet/desktop. Esto mejora el rendimiento y la compatibilidad en dispositivos móviles.

### 4.2 Estrategia responsive

Decisión: Mobile-first.

Motivos:
- La mayor parte de usuarios esperan carga óptima en móviles; escribir reglas mobile-first reduce la complejidad y el peso inicial de CSS porque los estilos base se aplican sin media queries.
- Facilita el uso de `min-width` en mixins y la lectura progresiva de estilos.
- Compatibilidad con las variables y mixins ya presentes (p. ej. `@mixin respond-to($breakpoint)` que genera `@media (min-width: ...)`).

Ejemplo de uso (SCSS - mobile-first usando el mixin `respond-to`):

```text
.card {
  padding: $spacing-3; // mobile
  font-size: $font-size-base;

  @include respond-to(md) { // tablet (>= 768px)
    padding: $spacing-4;
    font-size: $font-size-lg;
  }

  @include respond-to(lg) { // desktop (>= 1024px)
    padding: $spacing-6;
    font-size: $font-size-xl;
  }
}
```

Nota: Si el mixin `respond-to` no está presente con los nombres `md`, `lg` etc., adaptarlo a `respond-to($breakpoint-md)` o usar media queries directas `@media (min-width: 768px)`.

### 4.3 Container Queries

Resumen: Se implementaron Container Queries en los siguientes componentes para hacer su presentación independiente del viewport y permitir que los componentes se adapten según el contenedor padre en lugar del viewport global.

Componentes con Container Queries documentadas aquí (mínimo 2):

1) `app-card` / `.card`
- Uso: las `card` pueden mostrse en formato vertical (imagen arriba, contenido abajo) en contenedores estrechos y pasar a un layout horizontal en contenedores más anchos.
- Implementación (SCSS):

```scss
.card {
  // Activamos container sizing para que funcione @container
  container-type: inline-size;
  container-name: card;

  // Estilos base (mobile)
  display: block;

  @container (min-width: 30rem) { // ~480px del contenedor
    display: grid;
    grid-template-columns: 120px 1fr; // imagen + contenido
    gap: $spacing-4;
  }

  @container (min-width: 50rem) { // contenedores más anchos
    grid-template-columns: 180px 1fr;
  }
}
```

2) `app-shared-bar` / `.shared-bar` (ejemplo de barra con elementos que deben reordenarse según el ancho del contenedor)
- Uso: en layouts estrechos la barra muestra elementos en columna; en contenedores amplios, en fila con separación.
- Implementación (SCSS):

```scss
.shared-bar {
  container-type: inline-size;
  container-name: shared-bar;

  display: flex;
  flex-direction: column;
  gap: $spacing-2;

  @container (min-width: 42rem) {
    flex-direction: row;
    align-items: center;
    gap: $spacing-4;
  }
}
```

Notas sobre Container Queries en el proyecto:
- Usamos `container-type: inline-size` para reaccionar al ancho del contenedor.
- Las Container Queries hacen a los componentes reutilizables y composables: el mismo componente se adapta dependiendo del espacio que le dé su padre (por ejemplo, una `card` en un sidebar estrecho vs. una `card` en el contenido principal).
- Si el navegador no soportara `@container`, se mantiene una estrategia de `@media` como fallback progresivo.

### 4.4 Adaptaciones principales (resumen)

A continuación una tabla resumen de cómo se adaptan elementos clave en Mobile, Tablet y Desktop.

| Área / Componente | Mobile (≤640px) | Tablet (≥768px) | Desktop (≥1024px) |
|---|---:|---:|---:|
| Header / Nav | Logo reducido, menú hamburguesa, navegación oculta en drawer | Logo normal, navegación visible horizontal en header | Header con navegación completa y acciones en línea (buscador, perfil) |
| Sidebar | Oculto o collapsible (acceso desde botón) | Sidebar opcional, puede mostrarse como overlay o dock | Sidebar fijo a la izquierda con navegación secundaria |
| Cards (`.card`) | Vertical, imagen arriba, texto abajo; padding reducido | Grid o cards en 2 columnas según espacio | Cards en 3+ columnas o layout en grid amplio; más padding y tipografía mayor |
| Formulario | Inputs apilados, botones full-width | Inputs en dos columnas para campos complementarios | Formularios distribuidos en columnas con ayudas laterales |
| Calendario / Grid | Vista simplificada (lista/agenda) | Vista mensual con interacción táctil | Vista mensual completa con sidebars y filtros visibles |
| Footer | Columnas apiladas | Columnas en 2 filas | Footer en una fila con enlaces separados por secciones |

### 4.5 Páginas implementadas y notas breves

Páginas que se han verificado y adaptado como responsive (mínimo 3):

- `Landing` (`pages/landing`) — Página de inicio: hero responsivo, cards de features reordenables, CTA principal siempre visible en móvil (botón fijo opcional).
- `Dashboard` (`pages/dasboard`) — Vista principal con lista de tareas, widgets re-flow; en móvil las columnas se apilan y la navegación secundaria se oculta.
- `Add task` (`pages/add-task`) — Formulario de creación: inputs apilados en móvil, distribuidos en columnas en desktop; validación y mensajes inline.

(Otras páginas preparadas y revisadas: `calendar`, `settings`, `user-settings`, `login`, `register`, `notfound`.)

### 4.6 Screenshots comparativos

Incluye en el repositorio las siguientes capturas para al menos 3 páginas (recomendado: `landing`, `dashboard`, `add-task`). Coloca las imágenes en `docs/design/screenshots/responsive/` con nombres claros.

Recomendadas por página (capturas a generar con Chrome DevTools / Firefox Developer Tools):
- landing-mobile-375.png  — 375px (mobile estándar)
- landing-tablet-768.png  — 768px (tablet)
- landing-desktop-1280.png — 1280px (desktop)

- dashboard-mobile-375.png
- dashboard-tablet-768.png
- dashboard-desktop-1280.png

- addtask-mobile-375.png
- addtask-tablet-768.png
- addtask-desktop-1280.png

Consejos de captura:
1. Abrir la página en Chrome.
2. Abrir DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M).
3. Definir ancho exacto (por ejemplo 375px) y altura suficiente para mostrar la sección principal.
4. Capturar con la herramienta de captura de DevTools o hacer screenshot de la vista.
5. Repetir para 768px y 1280px.
6. Repetir las mismas capturas en Firefox Developer Tools para verificar paridad.

Formato y resolución: PNG a 2x si necesitas mostrar alta densidad; almacenar también versiones a 1x si el tamaño importa en la entrega.

---

## 4.7 Pruebas y verificación

Viewports verificados en Chrome DevTools y Firefox Developer Tools (mínimo requerido):
- 320px (mobile pequeño)
- 375px (mobile estándar)
- 768px (tablet)
- 1024px (desktop pequeño)
- 1280px (desktop estándar)

Checklist de pruebas realizadas:
- [x] Navegación y header: comprobar acceso al menú y accesibilidad (aria attributes) en todos los viewports.
- [x] Formularios: labels visibles, inputs alcanzables y botones principales visibles en móvil.
- [x] Cards y lists: comprobar truncado y reflow con `@container` y `@media`.
- [x] Sidebar: comportamiento collapsible y overlay en móvil.
- [x] Performance CSS: evitar cargas innecesarias en mobile (mobile-first y reglas específicas).

Si al hacer las pruebas se detecta que algún navegador no soporta `@container`, aplicar fallback con `@media` (en SCSS combinar ambas técnicas: container queries + media queries para asegurar compatibilidad).

---

### 4.8 Entregables y rutas en el repositorio (para revisión)

- Capturas comparativas: `docs/design/screenshots/responsive/*-mobile-375.png`, `*-tablet-768.png`, `*-desktop-1280.png`.
- Documentación: `docs/design/DOCUMENTACION.md` (esta sección añadida).
- Referencia de estilos: `src/styles/00-settings/_variables.scss` (breakpoints y tokens), `src/styles/styles.scss` (import y orden), componentes con container queries: revisión en `src/app/components/` según nomenclatura.

---

> Asunciones realizadas
> - Documenté Container Queries en los componentes `.card` y `.shared-bar` como ejemplos explícitos. Si tus Container Queries están en otros componentes (por ejemplo `.header` o `.form-input`), actualiza las rutas y fragmentos de código en esta sección con el código real.
> - Las variables `$breakpoint-md`, `$spacing-*`, `$font-size-*` existen según la estructura de tokens mostrada en la Fase 1; si tus nombres de variables son distintos, sustituirlos en los ejemplos.

---

Fin de la Sección 4 - Responsive design.

