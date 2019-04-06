import { Component, OnInit, ViewChild } from '@angular/core';
import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { LazyLoadEvent, MessageService } from 'primeng/components/common/api';
import { ConfirmationService } from 'primeng/api';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  colunas = [
    { field: 'pessoa', header: 'Pessoa' },
    { field: 'descricao', header: 'Descrição' },
    { field: 'dataVencimento', header: 'Vencimento' },
    { field: 'dataPagamento', header: 'Pagamento' },
    { field: 'valor', header: 'Valor' }
  ];

  filtro = new LancamentoFiltro();
  lancamentos = [];
  totalRegistros = 0;
  @ViewChild('tabela') grid;

  constructor(
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title) {}

  ngOnInit() {
    // o evento (onLazyLoad)="aoMudarPagina($event)" da página já é carregado, logo a função será executada
    // console.log('>> ngOnInit');
    // this.pesquisar(0);
    this.title.setTitle('Pesquisa de Lançamento');
  }

  pesquisar(pagina = 0) {

    this.filtro.pagina = pagina;

    this.lancamentoService.pesquisar(this.filtro)
      .then((data) => {
        this.lancamentos = data.content;
        this.totalRegistros = data.totalElements;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  excluir(codigo: number) {
    this.lancamentoService.excluir(codigo)
      .then(() => {
        this.grid.first = 0;
        this.messageService.add({
          severity: 'success',
          detail: 'Registro Excluído com Sucesso!'
        });
        this.pesquisar(0);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  confirmacao(codigo: number) {
    this.confirmationService.confirm({
        message: 'Você tem certeza que deseja efetuar essa ação?',
        header: 'Exclusão',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.excluir(codigo);
        }
    });
}
}
