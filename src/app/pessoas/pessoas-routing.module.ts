import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { AuthGuard } from '../seguranca/auth.guard';

// foi feito da forma abaixo porque em app-routing.module.ts foi incluído o loadChildren
const routes: Routes = [
  {
    path: '',
    component: PessoasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_PESSOA'] }
  },
  {
    path: 'nova',
    component: PessoaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_PESSOA'] }
  },
  {
    path: ':codigo',
    component: PessoaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_PESSOA'] }
  }
];

// const routes: Routes = [
//   {
//     path: 'pessoas',
//     component: PessoasPesquisaComponent,
//     canActivate: [AuthGuard],
//     data: { roles: ['ROLE_PESQUISAR_PESSOA'] }
//   },
//   {
//     path: 'pessoas/nova',
//     component: PessoaCadastroComponent,
//     canActivate: [AuthGuard],
//     data: { roles: ['ROLE_CADASTRAR_PESSOA'] }
//   },
//   {
//     path: 'pessoas/:codigo',
//     component: PessoaCadastroComponent,
//     canActivate: [AuthGuard],
//     data: { roles: ['ROLE_CADASTRAR_PESSOA'] }
//   }
// ];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PessoasRoutingModule { }
