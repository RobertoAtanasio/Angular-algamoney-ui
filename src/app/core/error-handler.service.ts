import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from './../seguranca/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private messageService: MessageService,
    private auth: AuthService) {}

  handle(errorResponse: any) {

    let msg: string;

    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    } else if (errorResponse instanceof Object
        && errorResponse.status === 401) {
      // Usuário não permissão de acesso à requisição solicitada.
      return null;
    } else if (errorResponse instanceof Object
        && errorResponse.status >= 400 && errorResponse.status <= 499) {
      msg = 'Ocorreu um erro ao processar a sua solicitação.';

      if (errorResponse.status === 403) {
        msg = 'Você não tem permissão para executar esta ação.';
      }
      try {
        msg = errorResponse.error[0].mensagemUsuario;
      } catch (e) { }
    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
    }

    this.messageService.add({
      severity: 'error',
      detail: msg
    });

  }

}
