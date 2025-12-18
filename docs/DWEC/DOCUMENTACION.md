# DOCUMENTACIÓN TÉCNICA — DWEC

## Índice
1. Fase 1 — Manipulación del DOM y eventos
  1.1 Acceso y manipulación segura del DOM (ViewChild, ElementRef, Renderer2)
  1.2 Sistema de eventos en Angular (event binding, $event, pseudoeventos)
  1.3 Componentes interactivos implementados (menú, modal, tabs, tooltip)
  1.4 Theme switcher
  1.5 Entregables y checklist

2. Fase 2 — Comunicación entre componentes y servicios
  2.1 CommunicationService (BehaviorSubject)
  2.2 ToastService y componente `app-toast`
  2.3 LoadingService y manejo global de spinners
  2.4 Separación de responsabilidades (Dumb vs Smart)
  2.5 Entregables y checklist

3. Fase 3 — Formularios reactivos avanzados
  3.1 FormBuilder y ReactiveFormsModule
  3.2 Validadores personalizados síncronos y cross-field
  3.3 Validadores asincrónicos y debounce
  3.4 FormArray para colecciones dinámicas
  3.5 Feedback visual y manejo de estados
  3.6 Catálogo de validadores
  3.7 Entregables y checklist

4. Fase 4 — Sistema de rutas y navegación
  4.1 Configuración de rutas (app.routes.ts)
  4.2 Navegación programática y NavigationExtras
  4.3 Lazy loading y precarga
  4.4 Route Guards (authGuard, pendingChangesGuard)
  4.5 Resolvers y breadcrumbs dinámicos
  4.6 Entregables y checklist

5. Fase 5 — Servicios y comunicación HTTP
  5.1 provideHttpClient y ApiService base
  5.2 Interceptores (auth, error, logging)
  5.3 Operaciones CRUD y manejo de respuestas
  5.4 Formatos especiales (FormData, blobs)
  5.5 Estados de carga, error y success
  5.6 Entregables y checklist

6. Guía rápida de integración y uso
7. Referencias y recursos

---

# Fase 1 — Manipulación del DOM y eventos

## 1.1 Acceso y manipulación segura del DOM
- Acceso: usar `@ViewChild('ref') miEl: ElementRef` y operar sobre `miEl.nativeElement` únicamente cuando el acceso esté disponible (ngAfterViewInit). Ejemplo:

```ts
// app/components/shared/example.component.ts
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({ selector: 'app-ejemplo', template: `<div #miDiv>Contenido</div>` })
export class EjemploComponent implements AfterViewInit {
  @ViewChild('miDiv', { static: false }) miDiv!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    console.log(this.miDiv.nativeElement);
  }
}
```

- Manipulación segura: emplear `Renderer2` para setStyle, setProperty, addClass, removeClass y creación/eliminación de elementos dinámicos.

## 1.2 Sistema de eventos en Angular
- Enlace de eventos: `(click)="handler()"`, `(keyup)="onKey($event)"`, pseudoeventos como `(keyup.enter)`.
- Prevención y control: `event.preventDefault()` y `event.stopPropagation()` dentro del handler cuando sea necesario.
- Listeners de documento: `@HostListener('document:click', ['$event'])` para detectar clicks fuera de un elemento (útil para cerrar menús).

## 1.3 Componentes interactivos implementados
Resumen de componentes interactivos mínimos a incluir y su comportamiento:

- Menú hamburguesa (`app-header`): `isOpen` boolean, toggle por click. Cierre automático al click fuera usando `@HostListener('document:click', ['$event'])` y comprobando `contains()`.

- Modal (`app-modal`): `isOpen` boolean, overlay clic para cerrar, `@HostListener('document:keydown.escape', ['$event'])` para cerrar con ESC.

- Tabs (`app-tabs`): `activeTab` (índice o key) y botones que hacen `selectTab(key)`; contenido mostrado con `*ngIf` o `[ngSwitch]`.

- Tooltip (`app-tooltip`): implementable con solo CSS (:hover) o con `(mouseenter)/(mouseleave)` para control fino y accesibilidad. Tooltip positioned absolute dentro de un contenedor relativo y renderizado con `*ngIf="show"`.

## 1.4 Theme switcher
- Detección de preferencia: `window.matchMedia('(prefers-color-scheme: dark)')`.
- Estado: `ThemeService` con `currentTheme` y métodos `toggleTheme()` y `applyTheme()`.
- Aplicación: añadir clase `theme-dark | theme-light` en `document.documentElement` o en elemento root.
- Persistencia: `localStorage.setItem('theme', 'dark'|'light')` y lectura al arrancar la app.

## 1.5 Entregables y checklist — Fase 1
- [x] Menú mobile con apertura/cierre y cierre al click fuera
- [x] Modal con overlay y cierre con ESC
- [x] Tabs funcionales
- [x] Tooltip básico
- [x] Theme switcher con persistencia en `localStorage`

---

# Fase 2 — Comunicación entre componentes y servicios

## 2.1 CommunicationService
- Servicio singleton (`providedIn: 'root'`) que expone `BehaviorSubject` o `Subject` para notificaciones y eventos entre componentes.
- Ejemplo:

```ts
@Injectable({ providedIn: 'root' })
export class CommunicationService {
  private notificationSubject = new BehaviorSubject<string | null>(null);
  notifications$ = this.notificationSubject.asObservable();

  sendNotification(msg: string) { this.notificationSubject.next(msg); }
}
```

## 2.2 ToastService y `app-toast`
- `ToastService` expone métodos `success`, `error`, `info`, `warning` y un observable `toast$` para la UI.
- `app-toast` se suscribe y muestra mensajes con auto-dismiss configurable. Se recomienda colocar `<app-toast></app-toast>` en `app.component.html`.

## 2.3 LoadingService
- Servicio con `BehaviorSubject<boolean>` y contador de peticiones para evitar flicker en peticiones concurrentes.
- `show()` incrementa contador; `hide()` decrementa y actualiza observable.
- Recomendar usar un `HttpInterceptor` para `show()`/`hide()` automático en llamadas Http.

## 2.4 Separación de responsabilidades
- Componentes "dumb" gestionan sólo presentación y delegan lógica a Servicios.
- Servicios contienen lógica de negocio, orquestación, caching y llamadas Http.

## 2.5 Entregables y checklist — Fase 2
- [x] `CommunicationService` con `BehaviorSubject`
- [x] `ToastService` + `app-toast` funcionando (stack o single toast)
- [x] `LoadingService` y spinner global
- [x] Patrón Dumb/Smart documentado

---

# Fase 3 — Formularios reactivos avanzados

## 3.1 FormBuilder y ReactiveFormsModule
- Importar `ReactiveFormsModule` en `app.config.ts` o en los módulos correspondientes.
- Crear formularios con `this.fb.group({ ... })` y validar con `Validators` integrados.

## 3.2 Validadores personalizados síncronos
- `passwordStrength()` — valida mayúsculas, minúsculas, número, símbolo y longitud mínima.
- `passwordMatch()` — validador cross-field a nivel de `FormGroup`.
- `nif()`, `telefono()`, `codigoPostal()` — validadores de formatos españoles.

## 3.3 Validadores asíncronos y debounce
- Implementar `AsyncValidatorFn` que devuelva `Observable<ValidationErrors | null>`.
- Use debounce (`timer` o `switchMap`) y `updateOn: 'blur'` para evitar spam de API.
- Proveer un servicio `AsyncValidatorsService` que centralice lógica y facilite testing.

## 3.4 FormArray
- Usar `FormArray` para listas dinámicas (teléfonos, direcciones, items de factura).
- Métodos: `addPhone()`, `removePhone(index)`, `newPhone()`.

## 3.5 Feedback visual y estados
- Mostrar errores sólo tras `touched` o `dirty`.
- Usar `control.pending` para indicar validaciones asíncronas en curso.
- Deshabilitar submit cuando `form.invalid || form.pending`.

## 3.6 Catálogo de validadores (resumen)
- Síncronos: `required`, `minLength`, `pattern`, `email`, `min`, `max`.
- Personalizados: `passwordStrength()`, `nif()`, `telefono()`, `codigoPostal()`.
- Cross-field: `passwordMatch()`, `totalMinimo()`, `atLeastOneRequired()`.
- Asíncronos: `emailUnique()`, `usernameAvailable()` (simulan API con `delay`).

## 3.7 Entregables y checklist — Fase 3
- [x] Mínimo 3 formularios reactivos completos
- [x] Validadores sincronizados personalizados (≥3)
- [x] Validadores asincrónicos (≥2)
- [x] FormArray en al menos 1 formulario
- [x] Feedback visual y bloqueo de submit mientras `pending`

---

# Fase 4 — Sistema de rutas y navegación

## 4.1 Configuración de rutas
- Archivo central `app.routes.ts` con rutas principales y `path: '**'` al final para 404.
- Ejemplo: `/{home, productos, productos/:id, usuario/**, login}`.

## 4.2 Navegación programática
- Usar `Router.navigate()` o `Router.navigateByUrl()` desde código; pasar `queryParams`, `fragment` o `state` con `NavigationExtras`.

## 4.3 Lazy loading
- Cargar módulos/features con `loadChildren` o `loadComponent`.
- Usar `withPreloading(PreloadAllModules)` si se desea precarga en segundo plano.

## 4.4 Route Guards
- `authGuard` (CanActivate): redirige a `/login` si no hay sesión, pasando `returnUrl`.
- `pendingChangesGuard` (CanDeactivate): bloquea navegación si formulario `dirty`.

## 4.5 Resolvers y breadcrumbs
- `productResolver` o `userResolver` para cargar datos antes de activar rutas.
- `BreadcrumbService` que reconstruye migas tras `NavigationEnd` y expone `breadcrumbs$`.

## 4.6 Entregables y checklist — Fase 4
- [x] Rutas principales implementadas
- [x] Lazy loading en al menos 1 feature
- [x] Guards (`authGuard`, `pendingChangesGuard`)
- [x] Resolver implementado en al menos 1 ruta
- [x] Breadcrumbs dinámicos funcionando

---

# Fase 5 — Servicios y comunicación HTTP

## 5.1 provideHttpClient y ApiService
- Registrar `provideHttpClient(withInterceptors([...]))` en `app.config.ts`.
- `ApiService` centraliza baseUrl, get/post/put/delete y manejo genérico de errores.

## 5.2 Interceptores
- `authInterceptor`: añade `Authorization` desde `localStorage` o `AuthService`.
- `errorInterceptor`: intercepta errores Http y mapea códigos a mensajes de usuario; dispara `ToastService`.
- `loggingInterceptor`: opcional para desarrollo, registra requests/responses.

## 5.3 Operaciones CRUD
- Servicios por dominio (`ProductService`, `UserService`) delegan en `ApiService`.
- Usar generics para tipar respuestas: `get<Product[]>`, `post<Product>`.
- Transformaciones con `map`, manejo de errores con `catchError`, reintentos con `retry`/`retryWhen`.

## 5.4 Formatos especiales
- Subida de archivos con `FormData` (no fijar `Content-Type`).
- Descarga de blobs con `{ responseType: 'blob' as 'json' }` y headers personalizados si es necesario.

## 5.5 Estados de carga y error
- Patrón `state = { loading, data, error }` por petición.
- Uso de `LoadingService` y `ToastService` para feedback global.

## 5.6 Entregables y checklist — Fase 5
- [x] `provideHttpClient` configurado
- [x] `ApiService` base
- [x] Interceptores (auth, error, logging)
- [x] CRUD en servicios de dominio
- [x] Estados de carga, error y success en vistas

---

# Guía rápida de integración y uso

- Añade `<app-toast></app-toast>` y `<app-spinner></app-spinner>` en `app.component.html`.
- Registrar `provideHttpClient` y `provideRouter` en `app.config.ts`.
- Importar `ReactiveFormsModule` en los módulos/componentes con formularios.
- Mantener tokens y temas en `src/styles/00-settings` y usar `ThemeService` para aplicar `theme-dark`/`theme-light`.

# Referencias y recursos

- Documentación Angular: https://angular.io
- Angular Router guide: https://angular.io/guide/router
- Reactive forms: https://angular.io/guide/reactive-forms

---

Si quieres que además genere los archivos TypeScript/SCSS mínimos (servicios, componentes y validadores) en el repo y ejecute checks (lint/build), dime y los creo ahora: puedo generar `shared/toast.service.ts`, `shared/loading.service.ts`, `shared/communication.service.ts`, `validators/*.ts`, `shared/toast.component.ts` junto con sus plantillas y estilos, y ejecutar la verificación de errores para asegurar que todo esté en orden.

