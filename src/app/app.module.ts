import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CampoDataDirective } from './campo-data.directive';
import { CampoValorDirective } from './campo-valor.directive';
import { CampoFormatacaoDirective } from './campo-formatacao.directive';

// import { LancamentosModule } from './lancamentos/lancamentos.module';
// import { PessoasModule } from './pessoas/pessoas.module';
import { CoreModule } from './core/core.module';

import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt, 'pt-BR');

import { AppRoutingModule } from './app-routing.module';
// import { SegurancaModule } from './seguranca/seguranca.module';
import { HttpConfigInterceptor } from './seguranca/httpconfig.interceptor';


// para o Carregamento tardio de módulos (Lazy loading) funcione, além da inclusão do loadChildren
// em AppRoutingModule, deve-se retirar o LancamentosModule e PessoasModule do imports abaixo
// obs.: foram feitos ajustes também em LancamentosRoutingModule, PessoasRoutingModule e
// SegurancaModule


@NgModule({
  declarations: [
    AppComponent,
    CampoDataDirective,
    CampoValorDirective,
    CampoFormatacaoDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,

    // SegurancaModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
