import { Route } from "../interface/route";

export const MENU_ITEMS: Route[] = [

  // Dashboard General
  {
    title: 'Dashboard',
    path: '/Modulo-Galpon/Dashboard',
  },

  // Módulo Galpón
  {
    title: 'Modulo Galpón',
    path: '/Modulo-Galpon',
    children: [
      {
        title: 'Maestros',
        path: '/Modulo-Galpon/Masters',
        children: [
          { title: 'Proveedor', path: '/Modulo-Galpon/Proveedor' },
          { title: 'Alimento', path: '/Modulo-Galpon/Food' },
          { title: 'Ubicaciones', path: '/Modulo-Galpon/Location' },
          { title: 'Tipo de Proveedores', path: '/Modulo-Galpon/Tipo-Proveedores' },
          { title: 'Galpón', path: '/Modulo-Galpon/Shed' },
          { title: 'Productos', path: '/Modulo-Galpon/Productos' },
          { title: 'Gallinas', path: '/Modulo-Galpon/Hen' },
        ],
      },
      { title: 'Kardex de Alimentos', path: '/Modulo-Galpon/Kardex-Alimentos' },
      { title: 'Costos de Alimentos', path: '/Modulo-Galpon/Cost-Alimentos' },
      { title: 'Ciclo de Vida', path: '/Modulo-Galpon/LifeCycle' },
    ],
  },

  // Módulo Bienestar Común
  {
    title: 'Modulo Bienestar Común',
    path: '/Modulo-Bienestar-Comun',
    children: [
      { title: 'Dashboard', path: '/Modulo-Bienestar-Comun/Dashboard' },
      { title: 'Masters', path: '/Modulo-Bienestar-Comun/Masters' },
    ],
  },

  // Módulo Psicología
  {
    title: 'Modulo Psicología',
    path: '/Modulo-Psicologia',
    children: [
      { title: 'Dashboard', path: '/Modulo-Psicologia/Dashboard' },
      { title: 'Masters', path: '/Modulo-Psicologia/Masters' },
    ],
  },
];
