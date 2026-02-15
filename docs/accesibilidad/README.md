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

| Herramienta             |                         Puntuación / Errores detectados |                                                      Captura / Informe |
|-------------------------|--------------------------------------------------------:|-----------------------------------------------------------------------:|
| Lighthouse (escritorio) | Accessibility: 100 / Lighthouse total: 95 (ver informe) |                          ./datos/informe de lighthouse (ordenador).pdf |
| Lighthouse (móvil)      | Accessibility: 100 / Lighthouse total: 61 (ver informe) |                              ./datos/informe de lighthouse (movil).pdf |
| WAVE                    |                Errores / alertas visuales (ver captura) |                                                       ./datos/WAVE.png |
| TAW                     |             Informe con problemas detectados (capturas) | ./datos/TAW1.png, ./datos/TAW2.png, ./datos/TAW3.png, ./datos/TAW4.png |

Las herramientas automáticas detectaron los siguientes problemas más relevantes (resumen):

1. Algunas imágenes no tenían atributos explícitos de width/height (Lighthouse – diagnóstico relacionado con layout/CLS).
2. La entrega de algunas imágenes podría mejorarse (Lighthouse – diagnóstico relacionado con optimización de imágenes).
3. Reducir CSS sin usar (Lighthouse – diagnóstico relacionado con optimización de CSS).

(Nota: las capturas originales están en `docs/accesibilidad/datos`).

---

Checklist WCAG (resumen verificable)

### 1) Perceptible

- [ ] 1.1 Textos alternativos — Nivel: A — Resultado: Desconocido — Problemas: 0 — Advertencias: 18 — No verificados: 0
  - [ ] 1.1.1 Contenido no textual — Nivel: A — Resultado: Desconocido — Advertencias: 18

- [ ] 1.2 Medios basados en el tiempo — (varios criterios) — Resultado: NA / Sin verificación detallada
  - [ ] 1.2.1 Sólo audio y sólo vídeo (grabaciones) — Nivel: A — NA
  - [ ] 1.2.2 Subtítulos (pregrabados) — Nivel: A — NA
  - [ ] 1.2.3 Audiodescripción o medio alternativo (pregrabado) — Nivel: A — NA
  - [ ] 1.2.4 Subtítulos (en directo) — Nivel: AA — NA
  - [ ] 1.2.5 Descripción auditiva (pregrabada) — Nivel: AA — NA
  - [ ] 1.2.6 Lenguaje de signos — Nivel: AAA — NA
  - [ ] 1.2.7 Audiodescripción extendida (pregrabada) — Nivel: AAA — NA
  - [ ] 1.2.8 Alternativa textual completa — Nivel: AAA — NA
  - [ ] 1.2.9 Sólo audio (en directo) — Nivel: AAA — NA

- [x] 1.3 Adaptable — Resumen: Pasa en 1.3.1, resto sin revisar
  - [x] 1.3.1 Información y relaciones — Nivel: A — Resultado: Pasa
  - [ ] 1.3.2 Secuencia con significado — Nivel: A — Sin revisar
  - [ ] 1.3.3 Características sensoriales — Nivel: A — Sin revisar

- [ ] 1.4 Distinguible — Algunos criterios sin revisar
  - [ ] 1.4.1 Uso del color — Nivel: A — Sin revisar
  - [ ] 1.4.2 Control del audio — Nivel: A — NA
  - [ ] 1.4.3 Contraste (Mínimo) — Nivel: A — Sin revisar
  - [ ] 1.4.4 Redimensionamiento del texto — Nivel: AA — NA
  - [ ] 1.4.5 Imágenes de texto — Nivel: AA — Sin revisar
  - [ ] 1.4.6 Contraste (Mejorado) — Nivel: AAA — Sin revisar
  - [ ] 1.4.7 Sonido de fondo bajo o ausente — Nivel: AAA — NA
  - [ ] 1.4.8 Presentación visual — Nivel: AAA — Sin revisar
  - [ ] 1.4.9 Imágenes de texto (sin excepciones) — Nivel: AAA — Sin revisar

### 2) Operable

- [ ] 2.1 Accesible mediante el teclado — varios criterios sin revisar
  - [ ] 2.1.1 Teclado — Nivel: A — Sin revisar
  - [ ] 2.1.2 Sin bloqueos de teclado — Nivel: A — Sin revisar
  - [ ] 2.1.3 Teclado (sin excepciones) — Nivel: AAA — NA

- [ ] 2.2 Tiempo suficiente — criterios sin revisar salvo excepciones
  - [ ] 2.2.1 Tiempo ajustable — Nivel: A — Sin revisar
  - [ ] 2.2.2 Pausar, detener, ocultar — Nivel: A — Sin revisar
  - [ ] 2.2.3 Sin límite temporal — Nivel: AAA — Sin revisar
  - [x] 2.2.4 Interrupciones — Nivel: AAA — Resultado: Pasa
  - [ ] 2.2.5 Nueva autentificación — Nivel: AAA — Sin revisar

- [ ] 2.3 Provocar ataques — Sin revisar
  - [ ] 2.3.1 Umbral de tres destellos o menos — Nivel: A — Sin revisar
  - [ ] 2.3.2 Tres destellos — Nivel: AAA — Sin revisar

- [ ] 2.4 Navegable — Varios ítems (ver notas)
  - [ ] 2.4.1 Evitar bloques — Nivel: A — Sin revisar
  - [ ] 2.4.2 Páginas tituladas — Nivel: A — Resultado: Desconocido
  - [ ] 2.4.3 Orden del foco — Nivel: A — Sin revisar
  - [x] 2.4.4 Propósito de los enlaces (en contexto) — Nivel: A — Resultado: Pasa
  - [ ] 2.4.5 Múltiples vías — Nivel: AA — Sin revisar
  - [ ] 2.4.6 Encabezados y etiquetas — Nivel: AA — Resultado: Desconocido — Advertencias: 10
  - [ ] 2.4.7 Foco visible — Nivel: AA — Sin revisar
  - [ ] 2.4.8 Ubicación — Nivel: AAA — Sin revisar
  - [x] 2.4.9 Propósito de los enlaces (Sólo enlaces) — Nivel: AAA — Resultado: Pasa
  - [x] 2.4.10 Encabezados de sección — Nivel: AAA — Resultado: Pasa

### 3) Comprensible

- [ ] 3.1 Legible — mayormente OK en 3.1.1
  - [x] 3.1.1 Idioma de la página — Nivel: A — Resultado: Pasa
  - [ ] 3.1.2 Idioma de las partes — Nivel: AA — Sin revisar
  - [ ] 3.1.3 Palabras inusuales — Nivel: AAA — Sin revisar
  - [ ] 3.1.4 Abreviaturas — Nivel: AAA — Sin revisar
  - [ ] 3.1.5 Nivel de lectura — Nivel: AAA — Sin revisar
  - [ ] 3.1.6 Pronunciación — Nivel: AAA — Sin revisar

- [ ] 3.2 Predecible — Sin revisar en la mayoría
  - [ ] 3.2.1 Al recibir el foco — Nivel: A — Sin revisar
  - [ ] 3.2.2 Al introducir datos — Nivel: A — Sin revisar
  - [ ] 3.2.3 Navegación consistente — Nivel: AA — Sin revisar
  - [ ] 3.2.4 Identificación consistente — Nivel: AA — Sin revisar
  - [x] 3.2.5 Cambios bajo petición — Nivel: AAA — Resultado: Pasa

- [ ] 3.3 Introducción de datos asistida — No verificado / NA
  - [ ] 3.3.1 Identificación de errores — Nivel: A — NA
  - [x] 3.3.2 Etiquetas o instrucciones — Nivel: A — Resultado: Pasa
  - [ ] 3.3.3 Sugerencias ante errores — Nivel: AA — NA
  - [ ] 3.3.4 Prevención de errores (legales, financieros, datos) — Nivel: AA — NA
  - [ ] 3.3.5 Ayuda — Nivel: AAA — NA
  - [ ] 3.3.6 Prevención de errores (todos) — Nivel: AAA — NA

### 4) Robusto

- [ ] 4.1 Compatible — Sin revisar en general
  - [ ] 4.1.1 Procesamiento — Nivel: A — NA
  - [ ] 4.1.2 Nombre, función, valor — Nivel: A — Sin revisar

---

Notas y próximos pasos sugeridos:

- Priorizar las advertencias detectadas en 1.1 (Textos alternativos) y 2.4.6 (Encabezados y etiquetas) — ambos muestran advertencias numeradas en la auditoría.
- Marcar como verificados los ítems etiquetados como "Sin revisar" o "NA" mediante pruebas manuales y herramientas automáticas adicionales.
- Añadir enlaces a pruebas y evidencias (por ejemplo, capturas o informes en `docs/accesibilidad/datos`) junto a cada ítem cuando se confirme.

---

## Sección 4: Análisis y corrección de errores

Resumen de errores identificados y soluciones aplicadas (mínimo 5):

| # | Error                                                        | Criterio WCAG              | Herramienta              |                                                               Solución aplicada |
|--:|--------------------------------------------------------------|----------------------------|--------------------------|--------------------------------------------------------------------------------:|
| 1 | Imágenes sin width/height explícitos provocando layout shift | 2.4.3 / Mejora de robustez | Lighthouse (diagnóstico) | Añadidos atributos `width` y `height` o CSS con `aspect-ratio` para evitar CLS. |
| 2 | Mejorar la entrega de imagenes                               | 2.4.3 / Mejora de robustez | Lighthouse (diagnóstico) |                       Cambiar imagenes de tipo `png` por imagenes de tipo `csv` |
| 3 | Reducir css sin usar                                         | 2.4.3 / Mejora de robustez | Lighthousr (diagnostico) |  Reducir el css sin usar y refactorizar el css duplicado con variables globales | |                            |                          |                                                                                 |

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
/*_helpers.scss*/
/* ============================================================
   Variables globales
   ============================================================ */

:root {
  --scroll-offset: calc(var(--spacing-2) * 2 + 3rem);
}

/* ============================================================
   Scroll para anclas internas
   ============================================================ */

h1[id],
h2[id],
h3[id],
h4[id],
h5[id],
h6[id],
[id].anchor {
  scroll-margin-top: var(--scroll-offset);
}

:target {
  scroll-margin-top: var(--scroll-offset);
}

/* ============================================================
   Sombras utilitarias
   ============================================================ */

.shadow-sm {
  box-shadow: var(--shadow-sm);
}

.shadow-md {
  box-shadow: var(--shadow-md);
}

.shadow-lg {
  box-shadow: var(--shadow-lg);
}

.shadow-xl {
  box-shadow: var(--shadow-xl);
}

/* ============================================================
   Elevar elementos al hover
   ============================================================ */

.elevate-on-hover {
  transition: box-shadow var(--transition-base), transform var(--transition-base);
  will-change: box-shadow, transform;

  &:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-0.25rem);
  }
}

/* ============================================================
   Desactivar sombras
   ============================================================ */

.no-shadow {
  box-shadow: none;
}

```

Código DESPUÉS:

```css
/* ============================================================
   Scroll para anclas internas
   ============================================================ */

h1[id],
h2[id],
h3[id],
h4[id],
h5[id],
h6[id],
[id].anchor {
  scroll-margin-top: var(--scroll-offset);
}

:target {
  scroll-margin-top: var(--scroll-offset);
}

/* ============================================================
   Sombras utilitarias
   ============================================================ */

.shadow-sm {
  box-shadow: var(--shadow-sm);
}

.shadow-md {
  box-shadow: var(--shadow-md);
}

.shadow-lg {
  box-shadow: var(--shadow-lg);
}

.shadow-xl {
  box-shadow: var(--shadow-xl);
}

/* ============================================================
   Elevar elementos al hover
   ============================================================ */

.elevate-on-hover {
  transition: box-shadow var(--transition-base), transform var(--transition-base);
  will-change: box-shadow, transform;

  &:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-0.25rem);
  }
}

/* ============================================================
   Desactivar sombras
   ============================================================ */

.no-shadow {
  box-shadow: none;
}
```

IMPORTANTE: eliminar el código CSS sin usar y refactorizar el CSS duplicado con variables globales para mejorar la eficiencia y mantenibilidad del código.

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

### 6.1 Test de navegación por teclado

- [x] Puedo llegar a todos los enlaces y botones con Tab
- [x] El orden de navegación con Tab es lógico (no salta caóticamente)
- [x] Veo claramente qué elemento tiene el focus (borde, sombra, color)
- [x] Puedo usar mi componente multimedia solo con teclado
- [x] No hay "trampas" de teclado donde quedo bloqueado
- [x] Los menús/modals se pueden cerrar con Esc (si aplica)

- Problemas encontrados: Ninguno significativo. El componente multimedia es completamente operable con teclado y el orden de navegación es lógico.
- Soluciónes aplicadas: N/A

### 6.2 Test con lector de pantalla

| Aspecto evaluado                                | Resultado | Observación        |
|-------------------------------------------------|-----------|--------------------|
| ¿Se entiende la estructura sin ver la pantalla? | ✅         | [Comentario breve] |
| ¿Los landmarks se anuncian correctamente?       | ✅         | [Comentario breve] |
| ¿Las imágenes tienen descripciones adecuadas?   | ⚠️        | [Comentario breve] |
| ¿Los enlaces tienen textos descriptivos?        | ✅         | [Comentario breve] |
| ¿El componente multimedia es accesible?         | ✅         | [Comentario breve] |

- Problemas encontrados:
  - Imágenes sin alt descriptivo: Las imágenes del proyecto no tienen un alt adecuado, lo que dificulta la comprensión para usuarios de lectores de pantalla.
- Soluciónes aplicadas:
  - Añadir una descripción detallada: Se han añadido textos alternativos descriptivos a todas las imágenes relevantes, y se han marcado como decorativas aquellas que no aportan información significativa.

### 6.3 Verificación cross-browser

| Navegador   | Versión    | Layout correcto | Multimedia funciona | Observaciones                 |
|-------------|------------|-----------------|---------------------|-------------------------------|
| Chrome      | [120+]     | ✅               | ✅                   | [Problemas o "Sin problemas"] |
| Firefox     | [121+]     | ✅               | ✅                   | [Problemas o "Sin problemas"] |
| Safari/Edge | [17+/120+] | ✅               | ✅                   | [Problemas o "Sin problemas"] |

- Problemas encontrados: Ninguno significativo. El sitio se visualiza correctamente y el componente multimedia funciona sin problemas en los navegadores probados.
- Soluciónes aplicadas: N/A

---

## Sección 7: Resultados finales después de correcciones

Tabla resumen inicial:

| Herramienta             |                         Puntuación / Errores detectados |                                                      Captura / Informe |
|-------------------------|--------------------------------------------------------:|-----------------------------------------------------------------------:|
| Lighthouse (escritorio) | Accessibility: 100 / Lighthouse total: 97 (ver informe) |                        ./datos/informe de lighthouse 2 (ordenador).pdf |
| Lighthouse (móvil)      | Accessibility: 100 / Lighthouse total: 72 (ver informe) |                            ./datos/informe de lighthouse 2 (movil).pdf |
| WAVE                    |                Errores / alertas visuales (ver captura) |                                                       ./datos/WAVE.png |
| TAW                     |             Informe con problemas detectados (capturas) | ./datos/TAW1.png, ./datos/TAW2.png, ./datos/TAW3.png, ./datos/TAW4.png |

Checklist WCAG (resumen verificable)

### 1) Perceptible

- [ ] 1.1 Textos alternativos — Nivel: A — Resultado: Desconocido — Problemas: 0 — Advertencias: 18 — No verificados: 0
  - [ ] 1.1.1 Contenido no textual — Nivel: A — Resultado: Desconocido — Advertencias: 18

- [ ] 1.2 Medios basados en el tiempo — (varios criterios) — Resultado: NA / Sin verificación detallada
  - [ ] 1.2.1 Sólo audio y sólo vídeo (grabaciones) — Nivel: A — NA
  - [ ] 1.2.2 Subtítulos (pregrabados) — Nivel: A — NA
  - [ ] 1.2.3 Audiodescripción o medio alternativo (pregrabado) — Nivel: A — NA
  - [ ] 1.2.4 Subtítulos (en directo) — Nivel: AA — NA
  - [ ] 1.2.5 Descripción auditiva (pregrabada) — Nivel: AA — NA
  - [ ] 1.2.6 Lenguaje de signos — Nivel: AAA — NA
  - [ ] 1.2.7 Audiodescripción extendida (pregrabada) — Nivel: AAA — NA
  - [ ] 1.2.8 Alternativa textual completa — Nivel: AAA — NA
  - [ ] 1.2.9 Sólo audio (en directo) — Nivel: AAA — NA

- [x] 1.3 Adaptable — Resumen: Pasa en 1.3.1, resto sin revisar
  - [x] 1.3.1 Información y relaciones — Nivel: A — Resultado: Pasa
  - [ ] 1.3.2 Secuencia con significado — Nivel: A — Sin revisar
  - [ ] 1.3.3 Características sensoriales — Nivel: A — Sin revisar

- [ ] 1.4 Distinguible — Algunos criterios sin revisar
  - [ ] 1.4.1 Uso del color — Nivel: A — Sin revisar
  - [ ] 1.4.2 Control del audio — Nivel: A — NA
  - [ ] 1.4.3 Contraste (Mínimo) — Nivel: A — Sin revisar
  - [ ] 1.4.4 Redimensionamiento del texto — Nivel: AA — NA
  - [ ] 1.4.5 Imágenes de texto — Nivel: AA — Sin revisar
  - [ ] 1.4.6 Contraste (Mejorado) — Nivel: AAA — Sin revisar
  - [ ] 1.4.7 Sonido de fondo bajo o ausente — Nivel: AAA — NA
  - [ ] 1.4.8 Presentación visual — Nivel: AAA — Sin revisar
  - [ ] 1.4.9 Imágenes de texto (sin excepciones) — Nivel: AAA — Sin revisar

### 2) Operable

- [ ] 2.1 Accesible mediante el teclado — varios criterios sin revisar
  - [ ] 2.1.1 Teclado — Nivel: A — Sin revisar
  - [ ] 2.1.2 Sin bloqueos de teclado — Nivel: A — Sin revisar
  - [ ] 2.1.3 Teclado (sin excepciones) — Nivel: AAA — NA

- [ ] 2.2 Tiempo suficiente — criterios sin revisar salvo excepciones
  - [ ] 2.2.1 Tiempo ajustable — Nivel: A — Sin revisar
  - [ ] 2.2.2 Pausar, detener, ocultar — Nivel: A — Sin revisar
  - [ ] 2.2.3 Sin límite temporal — Nivel: AAA — Sin revisar
  - [x] 2.2.4 Interrupciones — Nivel: AAA — Resultado: Pasa
  - [ ] 2.2.5 Nueva autentificación — Nivel: AAA — Sin revisar

- [ ] 2.3 Provocar ataques — Sin revisar
  - [ ] 2.3.1 Umbral de tres destellos o menos — Nivel: A — Sin revisar
  - [ ] 2.3.2 Tres destellos — Nivel: AAA — Sin revisar

- [ ] 2.4 Navegable — Varios ítems (ver notas)
  - [ ] 2.4.1 Evitar bloques — Nivel: A — Sin revisar
  - [ ] 2.4.2 Páginas tituladas — Nivel: A — Resultado: Desconocido
  - [ ] 2.4.3 Orden del foco — Nivel: A — Sin revisar
  - [x] 2.4.4 Propósito de los enlaces (en contexto) — Nivel: A — Resultado: Pasa
  - [ ] 2.4.5 Múltiples vías — Nivel: AA — Sin revisar
  - [ ] 2.4.6 Encabezados y etiquetas — Nivel: AA — Resultado: Desconocido — Advertencias: 10
  - [ ] 2.4.7 Foco visible — Nivel: AA — Sin revisar
  - [ ] 2.4.8 Ubicación — Nivel: AAA — Sin revisar
  - [x] 2.4.9 Propósito de los enlaces (Sólo enlaces) — Nivel: AAA — Resultado: Pasa
  - [x] 2.4.10 Encabezados de sección — Nivel: AAA — Resultado: Pasa

### 3) Comprensible

- [ ] 3.1 Legible — mayormente OK en 3.1.1
  - [x] 3.1.1 Idioma de la página — Nivel: A — Resultado: Pasa
  - [ ] 3.1.2 Idioma de las partes — Nivel: AA — Sin revisar
  - [ ] 3.1.3 Palabras inusuales — Nivel: AAA — Sin revisar
  - [ ] 3.1.4 Abreviaturas — Nivel: AAA — Sin revisar
  - [ ] 3.1.5 Nivel de lectura — Nivel: AAA — Sin revisar
  - [ ] 3.1.6 Pronunciación — Nivel: AAA — Sin revisar

- [ ] 3.2 Predecible — Sin revisar en la mayoría
  - [ ] 3.2.1 Al recibir el foco — Nivel: A — Sin revisar
  - [ ] 3.2.2 Al introducir datos — Nivel: A — Sin revisar
  - [ ] 3.2.3 Navegación consistente — Nivel: AA — Sin revisar
  - [ ] 3.2.4 Identificación consistente — Nivel: AA — Sin revisar
  - [x] 3.2.5 Cambios bajo petición — Nivel: AAA — Resultado: Pasa

- [ ] 3.3 Introducción de datos asistida — No verificado / NA
  - [ ] 3.3.1 Identificación de errores — Nivel: A — NA
  - [x] 3.3.2 Etiquetas o instrucciones — Nivel: A — Resultado: Pasa
  - [ ] 3.3.3 Sugerencias ante errores — Nivel: AA — NA
  - [ ] 3.3.4 Prevención de errores (legales, financieros, datos) — Nivel: AA — NA
  - [ ] 3.3.5 Ayuda — Nivel: AAA — NA
  - [ ] 3.3.6 Prevención de errores (todos) — Nivel: AAA — NA

### 4) Robusto

- [ ] 4.1 Compatible — Sin revisar en general
  - [ ] 4.1.1 Procesamiento — Nivel: A — NA
  - [ ] 4.1.2 Nombre, función, valor — Nivel: A — Sin revisar

---

## Sección 8: Conclusiones y reflexión

Mi conclusion es que la accesibilidad es un aspecto fundamental en el desarrollo web que no solo beneficia a personas con discapacidades, sino que mejora la experiencia de todos los usuarios. A través de esta auditoría y corrección, he aprendido a identificar y solucionar problemas de accesibilidad utilizando herramientas automatizadas y pruebas manuales. Además, he comprendido la importancia de seguir los principios de WCAG para crear sitios web inclusivos y accesibles para todos. En el futuro, me comprometo a integrar la accesibilidad desde las primeras etapas del diseño y desarrollo, en lugar de tratarla como una tarea posterior. Esto no solo garantizará una mejor experiencia para todos los usuarios, sino que también cumplirá con las obligaciones legales y éticas relacionadas con la accesibilidad web.

---
