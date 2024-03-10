import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'chat',
  },
  {
    path: 'chat',
    loadComponent: () => import('./components/chat/chat.component'),
    providers: [],
  },
  {
    path: 'text',
    loadComponent: () => import('./components/text/text.component'),
  },
  {
    path: 'vision',
    loadComponent: () => import('./components/vision/vision.component'),
  },
];
