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

  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private router: Router,
    private messageService: MessageService) {
      this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
      this.tokensRevokeUrl = `${environment.apiUrl}/tokens/revoke`;
      this.carregarToken();
    }

  login(usuario: string, senha: string): Promise<any> {

    const headers = new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', 'Basic YW5ndWxhcjphbmd1bGFyMA==');

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

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');
    this.jwtPayload = this.helper.decodeToken(token);
    // console.log('jwtPayload', this.jwtPayload);
    return !token || this.helper.isTokenExpired(token);
  }

  isTokenExpirou(): boolean {
    const tokenExpirou = this.getControleTokenExpirou();
    if (!tokenExpirou || tokenExpirou === 'SIM') {
      return true;
    }
    return false;
  }
  isSessaoExpirou(): boolean {
    const tokenExpirou = this.getControleTokenExpirou();
    if (tokenExpirou === 'sessao_expirou') {
      return true;
    }
    return false;
  }

  obterNovoAccessToken(): Promise<any> {

    if (!this.isExisteToken()) {
      return Promise.resolve(null);
    }

    if (this.isSessaoExpirou) {
      this.logout();
    }

    const headers = new HttpHeaders()
    .set('Authorization', 'Basic YW5ndWxhcjphbmd1bGFyMA==')
    .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = 'grant_type=refresh_token';

    this.setTokenExpirou();

    console.log('obtendo novo token...');

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        console.log('obteve novo token.');
        const data = JSON.parse(JSON.stringify(response));
        this.token = data.access_token;
        this.armazenarToken(this.token);
        return Promise.resolve(null);
      })
      .catch(response => {
        console.log('erro ao obter novo token.');
        this.setSessaoExpirou();
        this.messageService.add({
          severity: 'error',
          detail: 'Sua sessão expirou!'
        });
        return Promise.resolve(response);
      });
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
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
    .set('Authorization', 'Basic YW5ndWxhcjphbmd1bGFyMA==');

    return this.http.delete(this.tokensRevokeUrl, { headers, withCredentials: true })
    .toPromise()
    .then(() => {
      this.apagarLocalStorage();
      this.router.navigate(['/login']);
    })
    .catch( erro => {
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
    localStorage.removeItem('access_token_expirou');
  }

  private carregarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.armazenarToken(token);
    }
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.helper.decodeToken(token);
    localStorage.setItem('token', token);
    this.tokenExpired = this.helper.isTokenExpired(token);
    this.dateExpiration = this.helper.getTokenExpirationDate(token);
  }

  private setTokenExpirou() {
    localStorage.setItem('access_token_expirou', 'SIM');
  }

  private setSessaoExpirou() {
    localStorage.setItem('access_token_expirou', 'sessao_expirou');
  }

  private getControleTokenExpirou(): string {
   return localStorage.getItem('access_token_expirou');
  }

}
