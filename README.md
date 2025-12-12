# MemoWorks

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# Documentación Fase 2 – Componentes Interactivos y Comunicación

## 1. Objetivo

Implementar comunicación entre componentes, separar responsabilidades y gestionar estados globales (notificaciones y loading) usando **servicios singleton**, **BehaviorSubject/Subject**, **signals** y **AsyncPipe** en Angular 16+. Esto permite componentes "dumb" que solo gestionan presentación, y servicios "smart" que encapsulan lógica de negocio y comunicación.

---

## 2. Arquitectura de servicios

### 2.1 Servicios singleton

* `CommunicationService`: Comunicación entre componentes hermanos mediante `BehaviorSubject`.
* `ToastService`: Gestión centralizada de notificaciones/toasts tipadas (`success`, `error`, `info`, `warning`) con duración configurable.
* `LoadingService`: Estado global de carga (spinner overlay) con contador de peticiones para evitar flickering.

### 2.2 Flujo de comunicación

```
[Componentes (Dumb)]  <--subscribe--  [Servicios Smart: CommunicationService, ToastService, LoadingService]
       |                                    ^
       | emit / call                         |
       v                                    |
[Servicios de dominio / Facade] ---> [HttpClient + Interceptors] ---> [Backend API]
                  |
                  v
           [Estado global: BehaviorSubjects / Signals]
```

**Principios:**

* Unidirectional data flow: los componentes solo emiten eventos o llaman métodos del servicio.
* Observables o signals para actualizar la UI.
* Separación clara: componentes gestionan UI, servicios gestionan datos y lógica.

---

## 3. Patrones de comunicación implementados

| Patrón               | Servicio / Ejemplo                    | Uso recomendado                                |
| -------------------- | ------------------------------------- | ---------------------------------------------- |
| Observable / Subject | `CommunicationService`                | Eventos entre componentes, estado persistente  |
| BehaviorSubject      | `ToastService`, `LoadingService`      | Estado global, notificaciones, loading         |
| HttpInterceptor      | `LoadingInterceptor`                  | Mostrar spinner automáticamente durante HTTP   |
| Signals + AsyncPipe  | `UserListComponent`, `ToastComponent` | Estado local reactivo, sin subscribes manuales |

---

## 4. Separación de responsabilidades

**Componentes "Dumb":**

* Solo templates, signals locales y handlers que delegan.
* No contienen llamadas HTTP ni lógica de negocio compleja.
* Uso de `ChangeDetectionStrategy.OnPush` para performance.

**Servicios "Smart":**

* Encapsulan lógica de negocio, validaciones, caching y orquestación de APIs.
* Gestionan estados globales (`BehaviorSubject`) y notificaciones.
* Permiten pruebas unitarias independientes de la UI.

**Ejemplo:**

```ts
// Componente
users$ = this.userService.getUsers();
onSave() { this.userService.saveUser(user); }

// Servicio
getUsers(): Observable<User[]> { ... }
saveUser(user: User) { ... }
```

---

## 5. Sistema de notificaciones (Toasts)

**Características:**

* Servicio centralizado con `BehaviorSubject` para emitir mensajes tipados.
* Componente overlay que se subscribe automáticamente.
* Auto-dismiss configurable por mensaje (`duration` en ms).
* Posibilidad de dismiss manual con botón ×.
* Tipos de mensajes: `success`, `error`, `info`, `warning`.
* Evita memory leaks y overlap de toasts con timeout dinámico.

**Integración:**

* Añadir `<app-toast>` en `app.component.html` para overlay global.
* Desde cualquier servicio o componente:

```ts
this.toastService.success('Guardado correctamente', 3000);
this.toastService.error('Error crítico', 0); // persistente
```

---

## 6. Gestión de loading states

**Características:**

* Spinner global controlado por `LoadingService`.
* Conteo de peticiones concurrentes para evitar flickering.
* Integración opcional con `HttpInterceptor` para mostrar spinner automáticamente en llamadas HTTP.
* Señales locales en botones o componentes específicos para estados individuales.
* Uso de `finalize()` de RxJS para garantizar cleanup.

**Ejemplo de botón:**

```ts
<button [disabled]="isSaving()" (click)="save()">
  {{ isSaving() ? 'Guardando...' : 'Guardar' }}
</button>
```

* `isSaving` es un signal local y el servicio `LoadingService` gestiona spinner global.

---

## 7. Buenas prácticas

* Usar `AsyncPipe` y `takeUntilDestroyed()` para suscripciones: evita memory leaks.
* Componentes deben ser "dumb", servicios "smart".
* Aplicar `OnPush` + `signals` para máxima performance.
* Centralizar lógica de negocio en servicios para testabilidad.
* Feedback visual: toasts para errores o información, spinner para operaciones async.
* Escalabilidad: considerar un store (NgRx, Akita) o `facade service` si el estado crece.

---

## 8. Estructura de carpetas recomendada

```
src/app/
├── core/
│   └── interceptors/
├── features/
│   └── user/
│       ├── user.service.ts
│       └── user-list.component.ts
├── shared/
│   ├── components/
│   │   ├── toast/
│   │   └── spinner/
│   └── services/
│       ├── communication.service.ts
│       ├── toast.service.ts
│       └── loading.service.ts
├── app.component.html
└── app.module.ts
```

---

## 9. Entregables validados

* [x] Servicio de comunicación entre componentes.
* [x] Sistema de notificaciones funcional.
* [x] Loading states en operaciones asíncronas.
* [x] Separación clara entre lógica y presentación.
* [x] Documentación de arquitectura, patrones y buenas prácticas.
