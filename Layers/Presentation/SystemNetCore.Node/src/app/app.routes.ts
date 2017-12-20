import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

export default RouterModule.forRoot(routes, { useHash: true });
