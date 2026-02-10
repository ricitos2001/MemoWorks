Crear PRUEBA-PRACTICA-DWEC.md detallando la jerarquía de componentes creada y las instrucciones de ejecución.

# Prueba practica examen

## Trabajo realizado

He modificado el archivo `app.routes.ts` para incluir la siguiente estructura de rutas:

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

Tambien he modificado el footer incluyendo una navegacion hacia dicha ruta:

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
- Componente hijo `users`: componente ubicado en `src/app/components/shared` que esta enlazado al componente padre `user-list`, se encarga de recibir la información de `user-service` a traves del `users-signal.store` y mostrarla en pantall()
