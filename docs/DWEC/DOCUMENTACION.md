# DOCUMENTACIÓN TÉCNICA — DWEC

## Índice
1. Fase 1 — Manipulación del DOM y eventos
  - 1.1 Acceso y manipulación segura del DOM (ViewChild, ElementRef, Renderer2)
  - 1.2 Sistema de eventos en Angular (event binding, $event, pseudoeventos)
  - 1.3 Componentes interactivos implementados (menú, modal, tabs, tooltip)
  - 1.4 Theme switcher
  - 1.5 Entregables y checklist

2. Fase 2 — Comunicación entre componentes y servicios
  - 2.1 CommunicationService (BehaviorSubject)
  - 2.2 ToastService y componente `app-toast`
  - 2.3 LoadingService y manejo global de spinners
  - 2.4 Separación de responsabilidades (Dumb vs Smart)
  - 2.5 Entregables y checklist

3. Fase 3 — Formularios reactivos avanzados
  - 3.1 FormBuilder y ReactiveFormsModule
  - 3.2 Validadores personalizados síncronos y cross-field
  - 3.3 Validadores asincrónicos y debounce
  - 3.4 FormArray para colecciones dinámicas
  - 3.5 Feedback visual y manejo de estados
  - 3.6 Catálogo de validadores
  - 3.7 Entregables y checklist

4. Fase 4 — Sistema de rutas y navegación
  - 4.1 Configuración de rutas (app.routes.ts)
  - 4.2 Navegación programática y NavigationExtras
  - 4.3 Lazy loading y precarga
  - 4.4 Route Guards (authGuard, pendingChangesGuard)
  - 4.5 Resolvers y breadcrumbs dinámicos
  - 4.6 Entregables y checklist

5. Fase 5 — Servicios y comunicación HTTP
  - 5.1 provideHttpClient y ApiService base
  - 5.2 Interceptores (auth, error, logging)
  - 5.3 Operaciones CRUD y manejo de respuestas
  - 5.4 Formatos especiales (FormData, blobs)
  - 5.5 Estados de carga, error y success
  - 5.6 Entregables y checklist

6. Fase 6 — Gestión de estado y actualización dinámica
  - 6.1 Resumen ejecutivo y decisión de arquitectura
  - 6.2 Contrato para un store típico (ProductsStore)
  - 6.3 Ejemplo completo: ProductsStore con Signals
  - 6.4 Equivalente con BehaviorSubject
  - 6.5 Guía de integración en componentes
  - 6.6 Estrategias de testing (unit y e2e)
  - 6.7 Checklist de rendimiento y seguridad
  - 6.8 Mapping a criterios RA7.e, RA7.h, RA7.i
  - 6.9 Notas de migración y tie-ins con el código existente
  - 6.10 Recomendaciones operativas y de monitorización
  - 6.11 Pasos de entrega (después de Navidad)
  - 6.12 Resumen final

7. Guía rápida de integración y uso
8. Referencias y recursos

---

# Fase 1 — Manipulación del DOM y eventos

> Resumen: esta fase cubre técnicas seguras para acceder y manipular el DOM en Angular, patrones de evento y componentes interactivos básicos (menú, modal, tabs, tooltip).

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

> Resumen: patrones para comunicación entre componentes y servicios singleton; incluye ejemplos de `BehaviorSubject` para eventos y notificaciones.

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

> Resumen: formularios reactivos con validadores síncronos y asíncronos, FormArray y estrategias para feedback del usuario y control de estados.

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

> Resumen: configuración de rutas, lazy loading, guards y resolvers; buenas prácticas para navegación programática.

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

> Resumen: diseño de servicios HTTP, ApiService, interceptores y patrones para manejo consistente de estado de carga y errores.

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

# Fase 6 — Gestión de estado y actualización dinámica

Esta sección documenta el patrón de estado elegido, su contrato, ejemplos listos para copiar, estrategias de integración y testing, y recomendaciones operativas para la Fase 6. Está pensada para un proyecto docente Angular moderno (Angular 16+ cuando se usan Signals).

### 1. Resumen ejecutivo y decisión de arquitectura

Patrón elegido: Servicios de dominio (store por feature) basados en Signals de Angular, con RxJS/BehaviorSubject donde aporte valor (compatibilidad o casos existentes).

Justificación breve:
- Integración nativa con Angular (signals, computed, effect) y mejor encaje con ChangeDetection OnPush.
- Código más explícito y menos boilerplate RxJS para lectura/actualización de estado desde componentes.
- Fácil transición desde stores con BehaviorSubject y compatibilidad con APIs existentes (ProductService, ApiService, RealtimeService).

### 2. Contrato (mini-"contract") para un store típico (ProductsStore)

- Inputs: Peticiones HTTP desde `ProductService` / mensajes desde `RealtimeService` / acciones de UI (create/update/delete).
- Outputs: Estado público (lista, loading, error) expuesto como signals o como observables (`products`, `loading`, `error`).
- Formato de datos: Product { id: string; name: string; price: number; ... } (tipar según dominio real).
- Modos de error: errores de red (retry/fallback), errores de validación en create/update (propagar al componente), desconexión WS (reconexión/backoff).
- Criterios de éxito: operaciones CRUD reflejadas en el store y en todas las vistas suscritas sin recarga de página; preservación de scroll y mínimo re-render.


### 3. Ejemplo completo: `ProductsStore` con Signals (lista y derived values)

```ts
// src/app/stores/products.store.ts
import { Injectable, signal, computed } from '@angular/core';
import { ProductService } from '../services/product.service';
import type { Product } from '../models/product.model';
import { tap, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private _products = signal<Product[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Exposición pública (lectura)
  products = this._products.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  // Derived values
  totalCount = computed(() => this._products().length);
  totalPrice = computed(() => this._products().reduce((s, p) => s + (p.price ?? 0), 0));

  constructor(private api: ProductService) {
    this.load();
  }

  load() {
    this._loading.set(true);
    this._error.set(null);

    this.api.getAll().pipe(
      tap(list => this._products.set(list)),
      catchError(err => {
        this._error.set('Error al cargar productos');
        return of([] as Product[]);
      })
    ).subscribe(() => this._loading.set(false));
  }

  add(product: Product) {
    // optimista: actualizar inmediatamente (opcional)
    this._products.update(list => [...list, product]);
  }

  update(product: Product) {
    this._products.update(list => list.map(p => p.id === product.id ? product : p));
  }

  remove(id: string) {
    this._products.update(list => list.filter(p => p.id !== id));
  }

  // utility: refresh desde API
  refresh() {
    this.load();
  }
}
```

Notas:
- Usamos `asReadonly()` para evitar que consumidores muten el state directamente.
- `computed()` provee valores derivados (totales, contadores) que se actualizan automáticamente.
- Manejo de errores simple; puede adaptarse para exponer códigos y mensajes más detallados.


### 4. Equivalente con BehaviorSubject (cuando no se pueda usar Signals)

```ts
// src/app/stores/products-bs.store.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductService } from '../services/product.service';

@Injectable({ providedIn: 'root' })
export class ProductsBSStore {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private api: ProductService) { this.refresh(); }

  refresh() {
    this.loadingSubject.next(true);
    this.api.getAll().subscribe(list => {
      this.productsSubject.next(list);
      this.loadingSubject.next(false);
    }, () => this.loadingSubject.next(false));
  }

  add(p: Product) { this.productsSubject.next([...this.productsSubject.value, p]); }
  update(p: Product) { this.productsSubject.next(this.productsSubject.value.map(x => x.id === p.id ? p : x)); }
  remove(id: string) { this.productsSubject.next(this.productsSubject.value.filter(x => x.id !== id)); }
}
```

Cuándo usar cada uno:
- Signals: preferible en Angular 16+, menos boilerplate, mejor integración con OnPush y templates directos.
- BehaviorSubject: si la base del proyecto ya usa RxJS extensivamente o estás en Angular <16.


### 5. Guía de integración en componentes

Contrato mínimo del componente:
- Inyectar el store (no el ProductService directamente cuando la UI solo necesita estado).
- Leer signals con llamadas () en el template o exponer observables con `toObservable()` si es necesario.
- Usar `ChangeDetectionStrategy.OnPush` y `trackBy` en listas.

Ejemplo de componente (standalone/sintético):

```ts
// product-list.component.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ProductsStore } from '../stores/products.store';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  store = inject(ProductsStore);

  products = this.store.products; // signal readonly
  loading = this.store.loading;
}
```

Template:

```html
<div *ngIf="loading()" class="loading">Cargando...</div>
<ul>
  <li *ngFor="let p of products(); trackBy: trackById"> {{ p.name }} - {{ p.price | currency:'EUR' }} </li>
</ul>
<p>Total: {{ store.totalCount() }} productos — {{ store.totalPrice() | currency:'EUR' }}</p>
```

trackById:

```ts
import {Notification} from "./notifications.service";

export class NotificationsComponent {
  trackById(index: number, item: Notification) {
    return item.id;
  }
}
```

Buenas prácticas:
- Evitar subscribes manuales; si necesitas uno, usar `takeUntil` o patrón `destroy$`.
- Preferir `async` pipe con observables o usar signals directamente.
- Mantener inputs inmutables para maximizar beneficio de `OnPush`.


### 6. Estrategias de testing (unit y e2e)

Unit tests para el store:
- Mockear `ProductService` para devolver datos predecibles o errores.
- Probar `load()` (caso éxito y error), `add()`, `update()`, `remove()`, y valores derivados `totalCount`/`totalPrice`.

Ejemplo rápido con TestBed (Karma/Jasmine):

```ts
// products.store.spec.ts
import { TestBed } from '@angular/core/testing';
import { ProductsStore } from './products.store';
import { of, throwError } from 'rxjs';

const mockProducts = [{ id: '1', name: 'A', price: 10 }];
const mockApi = { getAll: () => of(mockProducts) };

describe('ProductsStore', () => {
  let store: ProductsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ProductsStore, { provide: ProductService, useValue: mockApi }] });
    store = TestBed.inject(ProductsStore);
  });

  it('carga productos inicialmente', () => {
    expect(store.products().length).toBe(1);
    expect(store.totalCount()).toBe(1);
  });
});
```

Notas de testing E2E:
- Probar flujos: crear producto → comprobar que aparece en la lista sin recarga; editar → se actualiza; borrar → elemento desaparece y scroll se mantiene.
- Simular eventos de tiempo real (websocket) mediante mocks en el backend de pruebas o interceptando la API.


### 7. Checklist de rendimiento y seguridad

Rendimiento:
- [ ] ChangeDetectionStrategy.OnPush en componentes de lista y elementos puros.
- [ ] `trackBy` siempre en `*ngFor` con ID estable.
- [ ] Evitar mutaciones in-place; usar actualizaciones inmutables en stores.
- [ ] Usar async pipe o signals; evitar subscribes manuales innecesarios.
- [ ] Paginación/infinite scroll para grandes volúmenes.

Seguridad y robustez:
- [ ] No exponer tokens en stores o en templates; usar `AuthService`/interceptor para Authorization headers.
- [ ] Manejo de errores centralizado (ErrorInterceptor + ToastService).
- [ ] Validar datos antes de insertarlos en el store (normalización y sanitización mínima).


### 8. Mapping a criterios RA7.e, RA7.h, RA7.i

(Asumo estos criterios se refieren a: RA7.e — Actualización reactiva del UI; RA7.h — Optimización/performance; RA7.i — Robustez/seguridad.)

- RA7.e (Actualización reactiva): La combinación store (signals) + componentes suscritos garantiza que cualquier CRUD o evento realtime actualice la UI automáticamente sin recarga de página ni navegación. Ejemplo: `ProductsStore.add()` actualiza `products()` y todos los templates reaccionan.

- RA7.h (Optimización): Uso de OnPush, trackBy, actualizaciones inmutables y derived values (computed) minimizan re-render y trabajo de detección de cambios. Infinite scroll/paginación evitan cargar grandes volúmenes.

- RA7.i (Robustez/Seguridad): Manejo centralizado de errores (ErrorInterceptor), no exponer secretos en el store, y estrategias de reconexión o fallback (polling) garantizan resiliencia ante fallos.


### 9. Notas de migración y tie-ins con el código existente

Dónde colocar los stores:
- `src/app/stores/` — almacenar `products.store.ts`, `users.store.ts`, `tasks.signal.store.ts` (ya hay `tasks.signal.store.ts` en el proyecto; usar ese patrón como referencia).

Servicios e interceptores a modificar/usar:
- `src/app/services/product.service.ts` o `src/app/services/api.service.ts` — el store debe delegar en estos para llamadas HTTP.
- `src/app/interceptors/auth-interceptor.ts` y `error-interceptor` — mantener para auth y manejo de errores.
- `src/app/services/realtime.service.ts` — conectar eventos WebSocket al store (ej.: recibir `product.created` y llamar `store.add()`).

Ejemplo de integración con realtime:

```ts
// en algún initializer o servicio
this.realtime.listen<EventMessage>().subscribe(msg => {
  if (msg.type === 'product.created') this.productsStore.add(msg.payload);
  if (msg.type === 'product.updated') this.productsStore.update(msg.payload);
});
```

Migración incremental recomendada:
1. Implementar store con Signals para una feature pequeña (ej. products) y reemplazar las dependencias del componente por la store.
2. Añadir trackBy y OnPush en los componentes de lista.
3. Introducir reconexión WebSocket/polling en `realtime.service` y conectar al store.
4. Probar e2e y ajustar performance.


### 10. Recomendaciones operativas y de monitorización

- Logs: Instrumentar puntos clave (errores de load, fallos WS) con un sistema de logging/monitorización (Sentry, LogRocket o similar) en producción.
- Reconexión WS: implementar backoff exponencial con límite de reintentos y fallback a polling si la conexión no se restaura.
- Métricas: monitorizar latencia de las peticiones principales, tasa de errores 5xx y número de reconexiones WS.
- Fallback: si el WS falla, activar polling con `timer(0, interval)` y `shareReplay(1)` para mantener consistencia entre suscriptores.

Parámetros sugeridos:
- Reconexión inicial: 1s, 2s, 5s, 10s (hasta 5 reintentos), luego fallback a polling cada 30s.
- Polling en entornos degradados: 30-60s según criticidad.


### 11. Pasos de entrega

- [ ] Implementar `ProductsStore` en `src/app/stores/products.store.ts` y adaptar `product-list` para usarlo.
- [ ] Añadir tests unitarios para store (happy path + error) y e2e flows básicos.
- [ ] Conectar `realtime.service` al store (eventos create/update/delete).
- [ ] Revisar componentes de lista: OnPush + trackBy.
- [ ] Desplegar en entorno de staging y validar métricas básicas (latencia, errores, reconexión WS).


### 12. Resumen final

La documentación anterior define un patrón claro y práctico (Services + Signals) que cumple los objetivos de la Fase 6: actualización reactiva sin recargas, rendimiento optimizado y robustez operativa. Se recomienda comenzar con una feature (products) como piloto y extender el patrón al resto del proyecto. La sección precedente incluye ejemplos listos para copiar, tests sugeridos y checklist operativo para la entrega posterior a Navidad.
