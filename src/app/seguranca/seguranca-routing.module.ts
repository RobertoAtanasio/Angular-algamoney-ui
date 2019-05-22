import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginFormComponent } from './login-form/login-form.component';

// foi feito da forma abaixo porque em app-routing.module.ts foi incluído o loadChildren
const routes: Routes = [
  { path: '', component: LoginFormComponent }
];

// const routes: Routes = [
//   { path: 'login', component: LoginFormComponent }
// ];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class SegurancaRoutingModule { }
