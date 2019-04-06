import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../seguranca/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

// a ? em {{ auth.jwtPayload?.nome }} significa que se o objeto ainda não tiver
// sido criado, não dará erro.
// Foi injetado o private auth: AuthService no construtor para que o html tenha
// acesso à variável auth.

  criarNovoAccessToken() {
    this.auth.obterNovoAccessToken();
  }

}
