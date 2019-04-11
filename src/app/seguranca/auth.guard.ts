import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      // if (state.url === '/lancamentos/novo') {
      //   return false;
      // }

      if (this.auth.isAccessTokenInvalido()) {
        return this.auth.obterNovoAccessToken()
          .then( () => {
            if (this.auth.isSessaoExpirou() || this.auth.isAccessTokenInvalido()) {
              this.router.navigate(['/login']);
              return false;
            }
            return true;
          });
      }

      if (next.data.roles && !this.auth.temQualquerPermissao(next.data.roles)) {
        this.router.navigate(['/nao-autorizado']);
        return false;
      }

    return true;
  }
}
