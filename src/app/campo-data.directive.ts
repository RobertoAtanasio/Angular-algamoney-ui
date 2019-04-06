import { Directive } from '@angular/core';

@Directive({
  selector: '[appCampoData]',
  exportAs: 'campoData'
})
export class CampoDataDirective {

  campoData(campo: any) {
    if (campo === 'dataVencimento' || campo === 'dataPagamento') {
      return true;
    } else {
      return false;
    }
  }

}
