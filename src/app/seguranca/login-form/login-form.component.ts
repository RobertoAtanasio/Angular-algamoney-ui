import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  // exibirAlerta = false;

  constructor(
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private messageService: MessageService) {}

  ngOnInit() {
  }

  login(usuario: string, senha: string) {

    this.auth.apagarLocalStorage();

    this.auth.login(usuario, senha)
    .then((data) => {
      this.router.navigate(['/dashboard']);
    })
    .catch(erro => {
      this.messageService.add({
        severity: 'error',
        detail: erro
      });
    });
  }

}
