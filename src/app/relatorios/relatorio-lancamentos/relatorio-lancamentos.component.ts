import { Component, OnInit } from '@angular/core';
import { RelatoriosService } from '../relatorios.service';
import { ErrorHandlerService } from './../../core/error-handler.service';

@Component({
  selector: 'app-relatorio-lancamentos',
  templateUrl: './relatorio-lancamentos.component.html',
  styleUrls: ['./relatorio-lancamentos.component.css']
})
export class RelatorioLancamentosComponent implements OnInit {

  periodoInicio: Date;
  periodoFim: Date;

  constructor(
    private relatoriosService: RelatoriosService,
    private errorHandler: ErrorHandlerService) { }

  ngOnInit() {
  }

  gerar() {
    console.log(this.periodoInicio);
    console.log(this.periodoFim);
    this.relatoriosService.relatorioLancamentosPorPessoa(this.periodoInicio, this.periodoFim)
      .then(relatorio => {
        const url = window.URL.createObjectURL(relatorio);
        window.open(url);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }

}
