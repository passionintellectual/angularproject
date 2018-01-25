import { HomeComponent } from './../home/home.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
