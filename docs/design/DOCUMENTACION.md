# Sección 1: Arquitectura CSS y comunicación visual

## 1.1 Principios de comunicación visual

En nuestro proyecto, hemos aplicado los cinco principios básicos de comunicación visual:

### Jerarquía

Usamos tamaños, pesos y espaciado para indicar la importancia de los elementos.

* **Ejemplo:** Los títulos `<h1>` usan `$font-size-3xl` y `$font-weight-bold` para destacarse sobre los subtítulos `<h2>` y párrafos `<p>`.
* **Captura de Figma:** Señalar el tamaño de los títulos y cómo guían la lectura.

### Contraste

Diferenciamos elementos usando color, tamaño y peso.

* Botones principales usan `$color-primary-5` sobre fondos `$color-primary-1`.
* Texto importante (`.card__title`) usa `$neutral-900` sobre fondos claros.
* **Captura de Figma:** Resaltar botones y títulos que destacan por color y peso.

### Alineación

Se mantiene coherencia mediante grid y flexbox.

* Contenido principal con `.container` centrado y columnas con `.grid` y `.col`.
* Textos alineados a la izquierda por consistencia en lectura.
* **Captura de Figma:** Mostrar rejilla de diseño y alineación de cards.

### Proximidad

Agrupamos elementos relacionados mediante espaciado.

* Párrafos relacionados en `<section>` con `$spacing-4` a `$spacing-6`.
* Botones y inputs agrupados en formularios.
* **Captura de Figma:** Señalar agrupaciones con espaciado consistente.

### Repetición

Creamos coherencia repitiendo patrones visuales.

* Botones, inputs, tarjetas (`.card`) y títulos usan estilos y tamaños consistentes.
* Uso de `$spacing-*` y `$font-size-*` de forma sistemática.
* **Captura de Figma:** Mostrar repetición de estilo en cards y botones.

## 1.2 Metodología CSS

Se utiliza **BEM (Block, Element, Modifier)** para la nomenclatura:

* **Bloques:** `.card`, `.button`, `.form`.
* **Elementos:** `.card__title`, `.card__description`, `.form__label`.
* **Modificadores:** `.card--featured`, `.button--primary`.

**Ejemplo:**

```scss
.card {
  padding: $spacing-6;
  background: $color-primary-2;

  &__title {
    @include text-style($font-size-lg, $font-weight-semibold);
    margin-bottom: $spacing-3;
  }

  &--featured {
    border: 2px solid $color-primary-5;
  }
}
```

## 1.3 Organización de archivos (ITCSS)

Se organiza de menor a mayor especificidad siguiendo **ITCSS**:

```
src/styles/
├─ 00-settings/       // Variables, design tokens
│  └─ _variables.scss
├─ 01-tools/          // Mixins y funciones
│  └─ _mixins.scss
├─ 02-generic/        // Reset CSS y normalización
│  └─ _reset.scss
├─ 03-base/           // Estilos base de HTML
│  └─ _base.scss
├─ 04-layout/         // Contenedores y grids
│  └─ _grid.scss
├─ 05-components/     // Componentes individuales
├─ 06-pages/          // Estilos específicos por página
└─ main.scss          // Importación general
```

**Justificación:**

* Comenzamos con settings y tools para definir variables y mixins globales.
* Luego resets y base para normalizar estilos.
* Layout y components para estilos reutilizables, aumentando la especificidad.
* Pages para estilos concretos de cada vista.

## 1.4 Sistema de Design Tokens

### Colores

* `$color-primary-*`: colores cálidos para fondos y destacados.
* `$color-secondary-*`: tonos oscuros para textos y elementos secundarios.
* `$color-success-*`, `$color-error-*`, `$color-warning-*`, `$color-info-*`: paleta semántica.

### Tipografía

* `$font-primary`: Montserrat para cuerpo de texto.
* `$font-secondary`: Montserrat Alternates para títulos.
* Escala tipográfica basada en `$type-ratio: 1.25` para jerarquía consistente.

### Espaciado

* `$spacing-1` a `$spacing-24` para márgenes, paddings y gaps.

### Breakpoints

* `$break-sm` a `$break-xl` para un diseño responsive fluido.

## 1.5 Mixins y funciones

### `respond($bp)`

Media queries con breakpoints predefinidos:

```scss
@include respond('md') {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

### `flex-center`

Centrado con flex:

```scss
@include flex-center;
```

### `flex(...)`

Flexbox parametrizable:

```scss
@include flex(row, $spacing-4, center, stretch);
```

### `grid-center`

Centrado con grid:

```scss
@include grid-center;
```

### `text-style($size, $weight, $lh)`

Tipografía consistente:

```scss
@include text-style($font-size-lg, $font-weight-semibold);
```

### `button-base(...)`

Botones reutilizables con padding, borde y shadow:

```scss
@include button-base($spacing-3 $spacing-5, $radius-md, $shadow-sm);
```

## 1.6 ViewEncapsulation en Angular

Se mantiene la estrategia **Emulated** (por defecto):

* Estilos encapsulados por componente para evitar fugas a otros componentes.
* Permite usar variables globales de `_variables.scss` sin afectar otros módulos.

**Justificación:**

* Favorece mantenibilidad y modularidad.
* Los estilos globales se manejan en ITCSS (`00-settings`, `02-generic`, `03-base`) y no requieren `ViewEncapsulation.None`.
