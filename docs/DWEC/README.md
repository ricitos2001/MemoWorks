# FASE 1 --- Documentación Técnica

## Manipulación del DOM y Sistema de Eventos en Angular

Esta fase implementa la interactividad inicial de la aplicación mediante
**manipulación del DOM**, **gestión de eventos**, **componentes
interactivos** y **cambio de tema dinámico**. Todos los ejemplos se han
desarrollado utilizando Angular en modo standalone, siguiendo buenas
prácticas de arquitectura y accesibilidad.

------------------------------------------------------------------------

# 1. Arquitectura general de eventos en la aplicación

La aplicación utiliza el **modelo unidireccional de flujo de datos de
Angular**, donde los eventos viajan desde el DOM hacia los componentes
para actualizar estado o disparar acciones.

``` html
(click)="handler($event)"
(keyup.enter)="handler()"
(pointerdown)="handler($event)"
```

Angular utiliza **Zone.js** para detectar automáticamente cambios en el
estado del componente al ejecutar un handler.

### Características clave:

-   Los eventos se vinculan directamente en la plantilla.
-   `$event` provee el objeto nativo (MouseEvent, KeyboardEvent, etc.).
-   Estados como `isOpen`, `activeTab` o `showTooltip` controlan
    visibilidad.
-   Servicios y RxJS pueden recibir eventos para flujos avanzados.

------------------------------------------------------------------------

# 2. Diagrama de Flujo de Eventos

    Usuario
       ↓
    DOM Event (click, keydown, mouseenter…)
       ↓
    Template Binding
       ↓
    Método del Componente
       ↓
    Actualización de Estado
       ↓
    Motor de Detención de Cambios
       ↓
    Re-render de la Vista

------------------------------------------------------------------------

# 3. Manipulación del DOM con ViewChild y Renderer2

### `@ViewChild` + `ElementRef`

``` ts
@ViewChild('miDiv') miDiv!: ElementRef;
```

### `Renderer2`

-   `setStyle`
-   `setProperty`
-   `addClass` / `removeClass`
-   `createElement`, `appendChild`, `removeChild`

------------------------------------------------------------------------

# 4. Sistema de Eventos

### Teclado

``` html
<input (keyup.enter)="onEnter()">
```

### Mouse

``` html
<button (mouseenter)="onHover()">Hover</button>
```

### Focus

``` html
<input (focus)="onFocus()" (blur)="onBlur()">
```

### stopPropagation y preventDefault

``` ts
event.preventDefault();
event.stopPropagation();
```

------------------------------------------------------------------------

# 5. Componentes Interactivos

## 5.1. Menú hamburguesa responsive

-   Toggle de apertura
-   Cierre automático por click fuera
-   `@HostListener('document:click')`

## 5.2. ModalComponent con cierre por ESC

-   `@HostListener('document:keydown.escape')`
-   Cierre en backdrop

## 5.3. TabsComponent

``` ts
activeTab: string = 'detalles';
```

## 5.4. TooltipsComponent

``` ts
showTooltip = false;
```

------------------------------------------------------------------------

# 6. Theme Switcher

## Detección automática

``` ts
window.matchMedia('(prefers-color-scheme: dark)').matches
```

## Persistencia

``` ts
localStorage.setItem('theme', this.currentTheme);
```

## Aplicación del tema

``` ts
document.documentElement.classList.add('theme-dark');
```

------------------------------------------------------------------------

# 7. Compatibilidad

  Evento          Chrome   Firefox   Edge   Safari
  --------------- -------- --------- ------ --------
  click           ✔️       ✔️        ✔️     ✔️
  mouseenter      ✔️       ✔️        ✔️     ✔️
  keydown/keyup   ✔️       ✔️        ✔️     ✔️
  escape          ✔️       ✔️        ✔️     ✔️
  focus/blur      ✔️       ✔️        ✔️     ✔️
  pointerdown     ✔️       ✔️        ✔️     ✔️

------------------------------------------------------------------------

# 8. Entregables

-   Menú hamburguesa
-   ModalComponent
-   TabsComponent
-   Tooltip
-   Manipulación DOM con Renderer2
-   Theme Switcher con persistencia

------------------------------------------------------------------------

# 9. Conclusión

La fase 1 cubre adecuadamente la manipulación del DOM y eventos en
Angular, aplicando buenas prácticas, escalabilidad y un sistema sólido
de interactividad.
