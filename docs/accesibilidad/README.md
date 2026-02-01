# Informe de accesibilidad — Proyecto Órbita 4: Diseñar para todos

Este documento recoge la auditoría, correcciones y verificación del componente multimedia implementado en el proyecto: un carrusel/slider accesible integrado en la aplicación.

---

## Sección 1: Fundamentos de accesibilidad

¿Por qué es necesaria la accesibilidad web?
La accesibilidad web garantiza que todas las personas puedan acceder y usar la información y las funcionalidades en la web, independientemente de sus capacidades o del dispositivo que utilicen. Además de ser una cuestión de derechos y buenas prácticas, existen obligaciones legales en España y la Unión Europea que exigen que determinados sitios públicos y servicios digitales cumplan criterios de accesibilidad.

Tipos de discapacidades (ejemplos): visual (ceguera, baja visión), auditiva (sordera), motora (dificultades de control del ratón) y cognitiva (dificultades de comprensión).

Beneficios para todos: la accesibilidad mejora la usabilidad general (por ejemplo, navegación mediante teclado, subtítulos, textos claros) y beneficia a personas en situaciones temporales (manos ocupadas, entorno ruidoso) y a buscadores.

Obligatoriedad legal: En España y la UE existen marcos normativos que obligan a accesibilidad en servicios públicos y, cada vez más, en servicios privados (Directiva de accesibilidad web, leyes nacionales de transposición y normativa sobre contratación pública).

Los 4 principios de WCAG 2.1
1. Perceptible: La información debe poder percibirse. Ejemplo: Las imágenes del carrusel incluyen captions/alt para usuarios con lectores de pantalla.
2. Operable: La interfaz debe poder operarse (teclado, tiempo suficiente). Ejemplo: El carrusel se puede controlar con las flechas del teclado y con botones accesibles.
3. Comprensible: La información y el funcionamiento deben ser comprensibles. Ejemplo: Los botones del carrusel tienen textos y aria-labels descriptivos.
4. Robusto: El contenido debe ser procesable por distintas tecnologías (compatibilidad con AT). Ejemplo: Uso correcto de HTML5 semántico para que los lectores de pantalla interpreten correctamente la estructura.

Niveles de conformidad
- A: Requisitos básicos. 
- AA: Mejores prácticas y nivel objetivo del proyecto (recomendado). 
- AAA: Nivel más alto y restrictivo (dificil de alcanzar en todos los casos).

Objetivo del proyecto: alcanzar nivel WCAG 2.1 AA.

Recursos útiles:
- https://www.w3.org/WAI/fundamentals/accessibility-intro/es
- https://accesible.es

---

## Sección 2: Componente multimedia implementado

Tipo de componente: Carrusel / Slider

Descripción breve:
El componente es un carrusel de imágenes ubicado en `src/app/components/shared` que muestra una secuencia de imágenes con controles "Anterior" y "Siguiente", un indicador de posición (ej.: "3/6") y soporte de navegación por teclado (flechas) y por foco/tab.

Características de accesibilidad implementadas:
- Controles visibles y con `aria-label` descriptivo para botones anterior/siguiente.
- Navegación por teclado: soporte para teclas ← y →; botones accesibles mediante Tab + Enter.
- Indicador de posición textual (por ejemplo "3/6") y ARIA live region opcional para anunciar cambios.

Criterios evaluados: RA4.e, RA4.f

---

## Sección 3: Auditoría automatizada inicial

He ejecutado las tres herramientas indicadas. Las capturas e informes utilizados están en `docs/accesibilidad/datos`.

Tabla resumen inicial:

| Herramienta | Puntuación / Errores detectados | Captura / Informe |
|-------------|-------------------------:|------------------:|
| Lighthouse (escritorio) | Accessibility: 100 / Lighthouse total: 95 (ver informe) | ./datos/informe de lighthouse (ordenador).pdf |
| Lighthouse (móvil) | Accessibility: 100 / Lighthouse total: 61 (ver informe) | ./datos/informe de lighthouse (movil).pdf |
| WAVE | Errores / alertas visuales (ver captura) | ./datos/WAVE.png |
| TAW | Informe con problemas detectados (capturas) | ./datos/TAW1.png, ./datos/TAW2.png, ./datos/TAW3.png, ./datos/TAW4.png |

Las herramientas automáticas detectaron los siguientes problemas más relevantes (resumen):
1. Algunas imágenes no tenían atributos explícitos de width/height (Lighthouse – diagnóstico relacionado con layout/CLS).
2. La entrega de algunas imágenes podría mejorarse (Lighthouse – diagnóstico relacionado con optimización de imágenes).
3. Reducir CSS sin usar (Lighthouse – diagnóstico relacionado con optimización de CSS).
4. 

(Nota: las capturas originales están en `docs/accesibilidad/datos`.)

---

## Sección 4: Análisis y corrección de errores

Resumen de errores identificados y soluciones aplicadas (mínimo 5):

| # | Error                                                        | Criterio WCAG              | Herramienta              |                                                               Solución aplicada |
|--:|--------------------------------------------------------------|----------------------------|--------------------------|--------------------------------------------------------------------------------:|
| 1 | Imágenes sin width/height explícitos provocando layout shift | 2.4.3 / Mejora de robustez | Lighthouse (diagnóstico) | Añadidos atributos `width` y `height` o CSS con `aspect-ratio` para evitar CLS. |
| 2 | Mejorar la entrega de imagenes                               | 2.4.3 / Mejora de robustez | Lighthouse (diagnóstico) |                       Cambiar imagenes de tipo `png` por imagenes de tipo `csv` |
| 3 | Reducir css sin usar                                         | 2.4.3 / Mejora de robustez | Lighthousr (diagnostico) |  Reducir el css sin usar y refactorizar el css duplicado con variables globales |
| 4 |                                                              |                            |                          |                                                                                 |
| 5 |                                                              |                            |                          |                                                                                 |

Detalle de cada error con ejemplo de código (ANTES / DESPUÉS)

#### Error #1: Imágenes sin atributos width/height explícitos
Problema: Las imágenes del header, delc footer y del landing no tenían atributos `width` y `height`, lo que podía causar cambios de layout (CLS) al cargarse.

Impacto: Moderado. Afecta a la experiencia visual, especialmente en conexiones lentas.

Criterio WCAG: 2.4.3 - Navegación consistente / Mejora de robustez

Código ANTES: 

```html
<img [src]="darkMode ? 'assets/img/Clip_path_group.png' : 'assets/img/Clip_path_group-1200.webp'" alt="tercera imagen decorativa" aria-hidden="true" loading="lazy" class="landing__img">
```

Código DESPUÉS:

```html
<img [src]="darkMode ? 'assets/img/Clip_path_group.png' : 'assets/img/Clip_path_group-1200.webp'" alt="tercera imagen decorativa" aria-hidden="true" loading="lazy" class="landing__img" width="0" height="0">
```

IMPORTANTE: modificar la clase CSS asociada para incluir un tamaño fijo evitando que las imágenes desaparezcan al añadir width/height en 0:


#### Error #2: Mejorar la entrega de imágenes
Problema: Las imágenes no optimizadas pueden afectar la velocidad de carga y la experiencia del usuario.

Impacto: Moderado. Afecta a usuarios con conexiones lentas.

Criterio WCAG: 2.1.1 - Teclado / 2.4.3 - Navegación consistente

Código ANTES:
```html
<nav class="flex">
  <a href="#"><img src="assets/img/discord.png" alt="logo de discord" class="footer__icon"></a>
  <a href="#"><img src="assets/img/instagram.png" alt="logo de instagram" class="footer__icon"></a>
  <a href="#"><img src="assets/img/twitter.png" alt="logo de twitter" class="footer__icon"></a>
  <a href="#"><img src="assets/img/facebook.png" alt="logo de facebook" class="footer__icon"></a>
  <a href="#"><img src="assets/img/reddit.png" alt="logo de reddit" class="footer__icon"></a>
  <a href="https://ko-fi.com/ricitos2001/tip"><img src="assets/img/ko-fi.png" alt="logo de ko-fi" class="footer__icon"></a>
</nav>
```

Código DESPUÉS:

```html
<nav class="flex">
  <a href="#"><img src="assets/img/discord.svg" alt="logo de discord" class="footer__icon"></a>
  <a href="#"><img src="assets/img/instagram.svg" alt="logo de instagram" class="footer__icon"></a>
  <a href="#"><img src="assets/img/twitter.svg" alt="logo de twitter" class="footer__icon"></a>
  <a href="#"><img src="assets/img/facebook.svg" alt="logo de facebook" class="footer__icon"></a>
  <a href="#"><img src="assets/img/reddit.svg" alt="logo de reddit" class="footer__icon"></a>
  <a href="https://ko-fi.com/ricitos2001/tip"><img src="assets/img/ko-fi.svg" alt="logo de ko-fi" class="footer__icon"></a>
</nav>
```

IMPORTANTE: cambiar las imágenes de tipo png por imágenes de tipo svg para mejorar la entrega y escalabilidad de las mismas.

#### Error #3: Reducir CSS sin usar
Problema: El CSS sin usar puede aumentar el tamaño de los archivos y afectar la velocidad de carga.

Impacto: Bajo. Afecta a la experiencia de usuarios con conexiones lentas.

Criterio WCAG: 2.4.3 - Navegación consistente / Mejora de robustez

Código ANTES:

```css
```

Código DESPUÉS:

```css
```

#### Error #4:
Problema:

Impacto:

Criterio WCAG:

Código ANTES:

```
```

Código DESPUÉS:

```
```

#### Error #5:
Problema:
Impacto:
Criterio WCAG:

Código ANTES:

```
```

Código DESPUÉS:

```
```

---

## Sección 5: Análisis de estructura semántica

Landmarks HTML5 utilizados en el proyecto (marcado según uso):
- [x] `<header>` - Usado para la cabecera del sitio
- [x] `<nav>` - Usado para el menú de navegación
- [x] `<main>` - Usado para el contenido principal
- [x] `<article>` - Usado para secciones de contenido independiente
- [x] `<section>` - Usado para secciones de contenido en las que hay más de un `<article>`
- [ ] `<aside>` - No usado pero si implementado
- [x] `<footer>` - Usado para el pie de página

Jerarquía de encabezados (ejemplo representativo):
- H1: Título principal de la página (por ejemplo: "MemoWorks - Landing")
- H2: Secciones principales (Servicios, Equipo, Contacto)
- H3: Subapartados (Servicio 1, Servicio 2)

Estado: la jerarquía revisada en las páginas principales es correcta y no se detectaron saltos de nivel importantes.

Análisis de imágenes:
- Total de imágenes (estimado en el sitio): [X] (recomendar ejecutar script para contar)
- Con texto alternativo: la mayoría; se han corregido las detectadas sin `alt`.
- Decorativas (alt=""): se han marcado como decorativas las imágenes puramente ornamentales.
- Sin alt (corregidas): inicialmente detectadas y corregidas: al menos 3 imágenes en el slider y 2 en páginas secundarias.

---

## Sección 6: Verificación manual

---

## Sección 7: Resultados finales después de correcciones

---

## Sección 8: Conclusiones y reflexión

---
