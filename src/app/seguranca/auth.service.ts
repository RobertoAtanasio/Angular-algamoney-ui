import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl: string;
  tokensRevokeUrl: string;

  jwtPayload: any;
  dateExpiration: any;
  token: string;
  tokenExpired: boolean;
  authorization: string;
  contentType: string;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private messageService: MessageService) {
      this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
      this.tokensRevokeUrl = `${environment.apiUrl}/tokens/revoke`;
      this.authorization = 'Basic YW5ndWxhcjphbmd1bGFyMA==';
      this.contentType = 'application/x-www-form-urlencoded';
      this.carregarToken();
    }

  // ATENÇÃO PARA INFORMAR AS CREDENCIAIS DO APLICATIVO: o Username e Password das credenciais estão
  //         definidas na API:
  //
  // Para obter o campo this.authorization, ir no Postman, acessar o Authorization, escolher a opção
  // TYPE = Basic Auth, inserir o Username e Password, clicar no botão Preview request e clicar no link
  // code situado à direita da tela (está ao lado do link Cookies).
  //
  // Ou acessar o site https://www.base64encode.org/ e informar o Username e Password; em seguida clicar
  // no botão > Encode <

  login(usuario: string, senha: string): Promise<any> {

    this.apagarLocalStorage();

    const headers = new HttpHeaders()
      .set('Content-Type', this.contentType)
      .set('Authorization', this.authorization);

    // Setar os parâmetros do corpo da requisição.
    const body = `client=angular&username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        const data = JSON.parse(JSON.stringify(response));
        this.token = data.access_token;
        this.armazenarToken(this.token);
        return response;  // se incluir o return, o método deve retornar any, senão void
      })
      .catch(response => {
        if (response.status === 400) {
          const data = JSON.parse(JSON.stringify(response));
          if (data.error.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválida!');
          }
        }
        return Promise.reject(response);
      });
  }

  isExisteToken(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    return false;
  }

  isSessaoExpirou(): boolean {
    const sessaoExpirou = localStorage.getItem('sessao_expirada');
    const expirou = !!sessaoExpirou;
    localStorage.removeItem('sessao_expirada');
    return expirou;
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  obterNovoAccessToken(): Promise<any> {

    if (!this.isExisteToken()) {
      return Promise.resolve(null);
    }

    const headers = new HttpHeaders()
      .set('Authorization', this.authorization)
      .set('Content-Type', this.contentType);

    const body = 'grant_type=refresh_token';

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        console.log('Novo token obtido.');
        const data = JSON.parse(JSON.stringify(response));
        this.token = data.access_token;
        this.armazenarToken(this.token);
        return Promise.resolve(null);
      })
      .catch(response => {
        this.apagarLocalStorage();
        localStorage.setItem('sessao_expirada', '*');
        this.messageService.add({
          severity: 'error',
          detail: 'Sua sessão expirou!'
        });
        return Promise.resolve(response);
      });
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
    /* Exemplo do PAYLOAD:
      {
        "user_name": "admin@algamoney.com",
        "scope": [
          "read",
          "write"
        ],
        "nome": "Administrador",
        "exp": 1576907623,
        "authorities": [
          "ROLE_CADASTRAR_CATEGORIA",
          "ROLE_PESQUISAR_PESSOA",
          "ROLE_REMOVER_PESSOA",
          "ROLE_CADASTRAR_LANCAMENTO",
          "ROLE_PESQUISAR_LANCAMENTO",
          "ROLE_REMOVER_LANCAMENTO",
          "ROLE_CADASTRAR_PESSOA",
          "ROLE_PESQUISAR_CATEGORIA"
        ],
        "jti": "ea00ade6-edb2-40f4-8baf-697888ec69a1",
        "client_id": "angular"
      }
    */
  }

  obterToken() {
    return localStorage.getItem('token');
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }
    return false;
  }

  logout(): Promise<any> {

    console.log('Logout...');
    const headers = new HttpHeaders()
      .set('Authorization', this.authorization);

    return this.http.delete(this.tokensRevokeUrl, { headers, withCredentials: true })
      .toPromise()
      .then(() => {
        alert('Delete OK');
        this.apagarLocalStorage();
        this.router.navigate(['/login']);
      })
      .catch( erro => {
        alert('Delete Erro');
        console.log('Houve erro no delete token...');
        this.messageService.add({
          severity: 'error',
          detail: erro
        });
        this.apagarLocalStorage();
        this.router.navigate(['/login']);
      });
  }

  apagarLocalStorage() {
    this.token = null;
    this.jwtPayload = null;
    localStorage.removeItem('token');
    localStorage.removeItem('sessao_expirada');
  }

  private carregarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.armazenarToken(token);
    }
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
    this.tokenExpired = this.jwtHelper.isTokenExpired(token);
    this.dateExpiration = this.jwtHelper.getTokenExpirationDate(token);
  }
}
