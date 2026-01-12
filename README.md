# MemoWorks

MemoWorks es una aplicación diseñada para ayudar a los usuarios a organizar y gestionar sus notas y tareas de manera eficiente. Con una interfaz intuitiva y funcionalidades avanzadas, MemoWorks facilita la creación, edición y seguimiento de notas y listas de tareas.

## Documentacion
### Características Principales

- **Gestión de Notas**: Crear, editar y eliminar notas fácilmente.
- **Listas de Tareas**: Crear listas de tareas con diferentes etiquetas.
- **Recordatorios**: Configurar recordatorios para tareas importantes.
- **Creación de grupos**: crea grupos familiares para poder asignar tareas a otros usuarios
- **Sincronización en la Nube**: Accede a tus notas y tareas desde cualquier dispositivo.
- **Interfaz Intuitiva**: Diseño amigable y fácil de usar.

### Tecnologías Utilizadas
- **Frontend**: Angular para una experiencia de usuario dinámica y responsiva.
- **Backend**: Spring Boot para una gestión robusta de datos y lógica de negocio.
- **Base de Datos**: MySQL para almacenamiento seguro y eficiente de datos.
- **Autenticación**: JWT para asegurar el acceso a la aplicación.
- **Despliegue**: Docker y render para facilitar la implementación y escalabilidad de la aplicación.
- **Diseño UI/UX**: Figma para prototipado y diseño de interfaces.

### Instalación y Configuración
1. Clona el repositorio desde GitHub:
    ```bash
    git clone <REPO_URL>
   ```
2. Configura la base de datos MySQL y actualiza las credenciales en el archivo de configuración del backend.
3. Navega al directorio del backend y ejecuta la aplicación Spring Boot.
4. Navega al directorio del frontend y ejecuta la aplicación Angular:
    ```bash
    npm install
    npm start
    ```
5. Accede a la aplicación desde tu navegador en `http://localhost:4200`.
6. Configura las variables de entorno necesarias para la conexión a la base de datos y otros servicios.
7. Construye y despliega la aplicación utilizando Docker.
8. Sigue las instrucciones específicas para desplegar en render.
9. Abre tu navegador y accede a la URL proporcionada por render para utilizar la aplicación.

## Contribuciones
Las contribuciones son bienvenidas. Si deseas contribuir al proyecto, por favor sigue estos pasos
1. Haz un fork del repositorio.
2. Crea una nueva rama para tu característica o corrección de errores.
3. Realiza tus cambios y haz commit de los mismos.
4. Envía un pull request describiendo tus cambios.
5. Espera la revisión y aprobación de tus cambios.
6. ¡Gracias por contribuir a MemoWorks!

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## Contacto
Para cualquier consulta o soporte, por favor contacta a [cuchsou815@g.educaand.es] o a [cesar2001ricitos@gmail.com]
¡Gracias por usar MemoWorks!

URL del frontend: https://memoworks.onrender.com
URL del backend: https://backend-memoworks.onrender.com

## Arquitectura de eventos (DOM y Angular)

Arquitectura y decisiones de diseño (resumen extendido)

En MemoWorks se ha seguido una política clara y documentada para el manejo de eventos en la capa de presentación. El objetivo es garantizar accesibilidad (A11Y), separación de responsabilidades, pruebas fáciles y compatibilidad con renderizado en servidor (SSR) cuando proceda.

Detalles (500+ palabras):

La capa de interfaz usa bindings declarativos en las plantillas Angular siempre que sea posible: `(click)`, `(submit)`, `(input)`, `(keydown)`, `(focusin)` y `(focusout)` para capturar interacciones del usuario. Estos handlers llaman a métodos del componente que realizan validaciones, emiten eventos a servicios o actualizan el estado local. Evitamos el uso de manejadores inline de bajo nivel (`onclick` en HTML) o manipulación directa del DOM sin control.

Para eventos globales (por ejemplo detectar Escape para cerrar modales o menús) se emplea `@HostListener('document:keydown.escape')` o `@HostListener('document:click')` en componentes que necesitan ese comportamiento. El uso de `@HostListener` centraliza la lógica de escucha sin crear listeners manuales dispersos. Donde se crean listeners directamente (por ejemplo `renderer.listen(...)` para traps de foco) se guarda el callback de limpieza y se ejecuta en `ngOnDestroy()` para evitar fugas de memoria.

Accesibilidad y teclado: los componentes interactivos implementan soporte completo por teclado: los modales capturan `Escape` para cerrar, el menú hamburguesa también cierra con `Escape` y con click fuera; las pestañas (`app-tabs`) soportan `ArrowLeft`, `ArrowRight`, `Home` y `End` para navegar entre tabs, y la gestión de `tabindex` asegura que sólo la pestaña activa sea alcanzable por tabulador (tabindex=0) mientras que las demás tienen tabindex=-1. Los tooltips soportan `focusin`/`focusout` y activación por teclado (`Enter` / `Space`) y exponen `aria-describedby` con un id único por instancia.

Manipulación del DOM: cuando es necesario crear o modificar nodos dinámicamente (botones en dashboard, overlays), se usa `Renderer2` para `createElement`, `setAttribute`, `appendChild`, `removeChild`, `setStyle`, `removeStyle` y `listen`. Esto evita operaciones directas sobre `nativeElement` que pueden romper la compatibilidad con entornos SSR o producir vulnerabilidades XSS. Además, los accesos a `nativeElement` están protegidos con comprobaciones de existencia y se realiza la manipulación dentro de `ngAfterViewInit` cuando es necesario.

Control de eventos y flujo: el flujo típico es: usuario → template (binding) → handler del componente → servicio/store (BehaviorSubject / Signal) → otros componentes suscritos actualizan su vista. En casos de comunicación entre componentes no relacionados jerárquicamente se usan servicios singleton (`AuthModalService`, `ThemeService`) que exponen APIs para abrir/cerrar componentes UI sin que el emisor conozca la estructura del DOM.

preventDefault / stopPropagation: en handlers de teclado y algunos clicks (por ejemplo navegación por flechas en tabs) se usa `event.preventDefault()` para evitar el comportamiento nativo que interfiere con la accesibilidad, y `event.stopPropagation()` sólo en casos controlados donde es necesario evitar burbujeo hacia listeners globales (por ejemplo, si un click interno no debe disparar el `document:click` de cierre de menú). El uso de estas APIs está comentado y justificado en los puntos donde aparece.

Gestión de foco: los modales guardan el foco previo al abrir y lo restauran al cerrar; además bloquean el scroll del body mientras el modal está abierto (`overflow: hidden`) y aplican un trap de Tab para mantener el foco dentro del diálogo. El menú hamburguesa devuelve el foco al botón toggler al cerrarse. Los tabs enfocan la pestaña activada y mantienen un manejo predecible del foco para lectores de pantalla.

Diagrama de flujo de eventos (Mermaid)

```mermaid
flowchart LR
  User[Usuario]
  Template[Template (bindings)]
  Component[Componente (TS)]
  Service[Servicio / Store]
  Other[Otros componentes]

  User --> Template --> Component --> Service --> Other
  Component -->|@HostListener| Document[(document/window)]
  Document --> Component
```

Tabla de compatibilidad (resumen por evento / API)

| Evento / API | Chrome | Firefox | Safari | Edge | Notas / Fallback |
|---|---:|---:|---:|---:|---|
| click | ✅ | ✅ | ✅ | ✅ | Nativo, no requiere polyfill |
| keydown (Escape/Arrows/Enter/Space) | ✅ | ✅ | ✅ | ✅ | Usado para accesibilidad; usar preventDefault cuando corresponda |
| mouseenter / mouseleave | ✅ | ✅ | ✅ | ✅ | nativo; no burbujea como mouseover/mouseout |
| focusin / focusout | ✅ | ✅ | ✅ | ✅ | Recomendado frente a focus/blur por propagación |
| matchMedia('(prefers-color-scheme)') | ✅ (76+) | ✅ (67+) | ✅ (12.1+) | ✅ (79+) | Escuchar cambios con addEventListener('change') o addListener para compatibilidad incremental |
| document / window listeners (HostListener) | ✅ | ✅ | ✅ | ✅ | Requiere comprobaciones SSR (typeof window !== 'undefined') si se usa en Universal |

Cómo probar (pasos rápidos)

1. Modal: abrir modal → Tab debe enfocar el primer control dentro del modal; Escape cierra; al cerrar el foco vuelve al disparador; el body no debe scrollear cuando modal abierto.
2. Menú hamburguesa: abrir menú → Escape cierra; click fuera cierra; atributo `aria-expanded` del botón actualiza correctamente.
3. Tabs: navegar con ArrowLeft/ArrowRight/Home/End y verificar que `aria-selected` y `tabindex` reflejan el estado.
4. Tooltip: foco en trigger + Enter/Space muestra tooltip; `aria-describedby` apunta correctamente al elemento tooltip.

Comandos útiles

- Tests unitarios (Karma/Jasmine): `npm test`
- Linter/compilación (Angular CLI): `npm run build` o `ng build`


---

A partir de la sección anterior, el repositorio implementa las prácticas descritas: `@HostListener` para eventos globales, `Renderer2` para manipulación segura del DOM, manejo explícito de foco y atributos ARIA en los componentes interactivos (modal, hamburger, tabs, tooltips). Si necesitas que añada diagramas adicionales o casos de test automáticos (Karma/Cypress) puedo crearlos en la próxima iteración.
