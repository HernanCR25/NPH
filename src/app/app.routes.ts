import { Routes } from '@angular/router';

export const routes: Routes = [
  // Módulo Galpón
  {
    path: 'Modulo-Galpon',
    loadComponent: () =>
      import('./components/components.component').then(
        (m) => m.ComponentsComponent
      ),
    children: [
      // Dashboard General
      {
        path: 'Dashboard',
        title: 'Dashboard General',
        loadComponent: () =>
          import('./components/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      // Maestros
      {
        path: 'Proveedor',
        title: 'Maestros Proveedor',
        loadComponent: () =>
          import(
            './components/pages/masters/proveedor/proveedor.component'
          ).then((m) => m.ProveedorComponent),
      },
      {
        path: 'Food',
        title: 'Maestro Food',
        loadComponent: () =>
          import(
            './components/pages/masters/food/food.component'
          ).then((m) => m.FoodComponent),
      },
      {
        path: 'Shed',
        title: 'Maestro Galpon',
        loadComponent: () =>
          import(
            './components/pages/masters/shed/shed.component'
          ).then((m) => m.ShedComponent),
      },
      {
        path: 'Location',
        title: 'Maestro Ubicaciones',
        loadComponent: () =>
          import(
            './components/pages/masters/location/location.component'
          ).then((m) => m.LocationComponent),
      },
      {
        path: 'Hen',
        title: 'Maestro Gallinas',
        loadComponent: () =>
          import(
            './components/pages/masters/hen/hen.component'
          ).then((m) => m.HenComponent),
      },
      // Transaccionales
      {
        path: 'Kardex-Alimentos',
        title: 'Kardex de Alimentos',
        loadComponent: () =>
          import(
            './components/pages/transactions/kardex-food/kardex-alimentos.component'
          ).then((m) => m.KardexAlimentosComponent),
      },
      {
        path: 'Cost-Alimentos',
        title: 'Costo de Alimentos',
        loadComponent: () =>
          import(
            './components/pages/transactions/costs-food/costs-food.component'
          ).then((m) => m.CostsFoodComponent),
      },
      {
        path: 'LifeCycle',
        title: 'Maestro Ciclo de Vida',
        loadComponent: () =>
          import(
            './components/pages/transactions/lifecycle/lifecycle.component'
          ).then((m) => m.LifecycleComponent),
      },
    ],
  },

  // Módulo Bienestar Común
  {
    path: 'Modulo-Bienestar-Comun',
    loadComponent: () =>
      import('./components/components.component').then(
        (m) => m.ComponentsComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'Dashboard',
        pathMatch: 'full',
      },
      {
        path: 'Dashboard',
        title: 'Dashboard Bienestar',
        loadComponent: () =>
          import('./components/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },

  // Módulo Psicología
  {
    path: 'Modulo-Psicologia',
    title: 'Módulo Psicología',
    loadComponent: () =>
      import('./components/components.component').then(
        (m) => m.ComponentsComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'Dashboard',
        pathMatch: 'full',
      },
      {
        path: 'Dashboard',
        title: 'Dashboard Psicología',
        loadComponent: () =>
          import('./components/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },

  {
    path: '',
    redirectTo: 'Modulo-Galpon/Dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'Modulo-Galpon/Dashboard',
  },
];
