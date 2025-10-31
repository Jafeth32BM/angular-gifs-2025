import { Routes } from '@angular/router';
import { SideMenuHeader } from './gifs/components/side-menu/side-menu-header/side-menu-header';
import { SideMenuOptions } from './gifs/components/side-menu/side-menu-options/side-menu-options';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./gifs/pages/dashboard/dashboard-page'),
    children:[
        {
          path: 'search',
          loadComponent: () =>
            import('./gifs/pages/search/search-page'),
        },
        {
          path: 'trending',
          loadComponent: () =>
            import('./gifs/pages/trending/trending-page'),
        },
        {
          path: 'history/:qwery',
          loadComponent: () =>
            import('./gifs/pages/gif-history/gif-history'),
        },
        {
          path: '**',
          redirectTo: 'trending'
        }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
