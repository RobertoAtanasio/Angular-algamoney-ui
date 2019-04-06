import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { JwtHelper } from 'angular2-jwt';
// import 'rxjs/add/operator/toPromise';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl = 'http://localhost:8080/oauth/token';
  jwtPayload: any;
  dateExpiration: any;
  token: string;
  tokenExpired: boolean;

  constructor(
    private http: HttpClient,
    private helper: JwtHelperService) {
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

  obterNovoAccessToken(): Promise<any> {

    const headers = new HttpHeaders()
    .set('Authorization', 'Basic YW5ndWxhcjphbmd1bGFyMA==')
    .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = 'grant_type=refresh_token';

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        const data = JSON.parse(JSON.stringify(response));
        this.token = data.access_token;
        this.armazenarToken(this.token);
        console.log('Novo access token criado!');
        return Promise.resolve(null);
      })
      .catch(response => {
        console.error('Erro ao renovar token.', response);
        return Promise.resolve(null);
      });

  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.helper.decodeToken(token);
    localStorage.setItem('token', token);

    console.log('jwtPayload', this.jwtPayload);

    this.tokenExpired = this.helper.isTokenExpired(token);
    this.dateExpiration = this.helper.getTokenExpirationDate(token);
    // console.log('dateExpiration', this.dateEsired);
  }

  apagarLocalStorage() {
    localStorage.removeItem('token');
  }

  private carregarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.armazenarToken(token);
    }
  }
}
