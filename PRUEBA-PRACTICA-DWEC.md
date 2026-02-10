# Prueba practica examen

## Trabajo realizado

He modificado el archivo `app.routes.ts` para incluir las siguientes rutas que implementan lazy-loading para la carga pasiva de las rutas:

```
{
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/user-list/user-list').then(m => m.UserList),
    data: {title: 'users', breadcrumb: 'users'},
    children: [
      {path: '', redirectTo: 'userList', pathMatch: "full"},
      {
        path: 'userList',
        loadChildren: () => import('./components/shared/users/users-module').then(m => m.UsersModule),
        data: {title: 'User-list', breadcrumb: 'User-list'}
      },
    ]
  },
```

También he modificado el footer incluyendo una navegacion hacia dicha ruta:

```
# en el html
<li *ngIf="loggedIn">
    <a (click)="goToSite()">{{ userList | translate }}</a>
</li>

# en el ts
  goToSite() {
    this.router.navigate(['/users/userList'])
  }
```

Además, he modificado el sistema de traducción para traducir los elementos de dichos componentes

## Jerarquía de componentes

La jerarquia de componentes implementada consta de lo siguiente:

- Componente padre `user-list`: componente ubicado en `src/app/pages` que se encarga de mostrar el contenido del componente hijo `users`
- Componente hijo `users`: componente ubicado en `src/app/components/shared` que esta enlazado al componente padre `user-list`, se encarga de recibir la información de `user-service` a traves del `users-signal.store` y mostrarla en pantalla
- Componente `users.signal.store`: encargado de sincronizar la cache del frontend con la informacion que se obtiene de `user-service`
- Componente `users-service`: encargado de realizar las peticiones al backend

## Instrucciones de ejecucion

El componente `users` realiza una petición a `users-service` a traves de `users.signal.store` y cuando el servicio recibe la peticion este hace un peticion al backend del proyecto para obtener la informacion solicitada, cuando obtiene dicha informacion esta es enviada a su store el cual se encarga de sincroniczar las peticiones con la cache del proyecto provocando que la informacion se muestre en la pantalla sin tener que darle al botón de actualizar
