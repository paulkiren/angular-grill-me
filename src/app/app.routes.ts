import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'interview',
    loadComponent: () => import('./components/interview').then(m => m.InterviewComponent)
  },
  {
    path: 'topic-matrix',
    loadComponent: () => import('./components/topic-matrix').then(m => m.TopicMatrixComponent)
  },
  {
    path: 'playground',
    loadComponent: () => import('./components/playground').then(m => m.PlaygroundComponent)
  },
  {
    path: 'performance',
    loadComponent: () => import('./components/performance').then(m => m.PerformanceComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
