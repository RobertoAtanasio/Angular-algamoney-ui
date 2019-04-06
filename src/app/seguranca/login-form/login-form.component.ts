import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router) { }

  ngOnInit() {
  }

  login(usuario: string, senha: string) {
    this.apagarLocalStorage();
    this.auth.login(usuario, senha)
    .then((data) => {
      // console.log('>>>', data.access_token);   // só se o método retorno any
      this.router.navigate(['/lancamentos']);
    })
    .catch(erro => {
      // console.log('Houve erro', erro);
      this.errorHandler.handle(erro);
    });
  }

  apagarLocalStorage() {
    this.auth.apagarLocalStorage();
  }

}
