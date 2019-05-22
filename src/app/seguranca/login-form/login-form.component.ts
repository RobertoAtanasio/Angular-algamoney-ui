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
    private router: Router) {}

  ngOnInit() {
  }

  login(usuario: string, senha: string) {

    this.auth.apagarLocalStorage();

    this.auth.login(usuario, senha)
    .then((data) => {
      this.router.navigate(['/dashboard']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }

}
