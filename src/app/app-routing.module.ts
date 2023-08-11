import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
    { path: '',redirectTo:'estadisticas',pathMatch:'full'},
    { path: 'estadisticas',component:AppComponent},
    { path: 'estadisticas/:region', component: AppComponent },
    { path: '**',redirectTo:'estadisticas',pathMatch:'full'},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
