import { Directive } from '@angular/core';

@Directive({
  selector: '[appCampoValor]',
  exportAs: 'campoValor'
})
export class CampoValorDirective {

  campoValor(campo: any) {
    if (campo === 'valor') {
      return true;
    } else {
      return false;
    }
  }

}
