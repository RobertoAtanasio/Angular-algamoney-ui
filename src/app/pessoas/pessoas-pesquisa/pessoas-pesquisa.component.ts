import { Component, OnInit, ViewChild } from '@angular/core';
import { PessoaService } from '../pessoa.service';
import { PessoaFiltro } from './../pessoa.service';
import { LazyLoadEvent, MessageService } from 'primeng/components/common/api';
import { ConfirmationService } from 'primeng/api';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  colunas = [
    { field: 'nome', header: 'Nome' },
    { field: 'cidade', header: 'Cidade' },
    { field: 'estado', header: 'Estado' },
    { field: 'ativo', header: 'Status' }
  ];s

  filtro = new PessoaFiltro();
  pessoas =[];
  totalRegistros = 0;
  @ViewChild('tabela') grid;

  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title) {}

  ngOnInit() {
    this.title.setTitle('Pesquisa de Pessoas');
  }

  pesquisar(pagina = 0) {

    if (pagina === -1) {
      this.grid.first = 0;
    }

    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro)
      .then((data) => {
        this.pessoas = data.content;
        this.totalRegistros = data.totalElements;
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  excluir(codigo: number) {
    this.pessoaService.excluir(codigo)
      .then(() => {
        this.grid.first = 0;
        this.messageService.add({
          severity: 'success',
          detail: 'Registro Excluído com Sucesso!'
        });
        this.pesquisar(0);
      })
      .catch(erro => {
        this.errorHandler.handle(erro)
      });
  }

  confirmaExclusao(codigo: number) {
    this.confirmationService.confirm({
        message: 'Você tem certeza que deseja efetuar essa ação?',
        header: 'Exclusão',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.excluir(codigo);
        }
    });
  }

  alternarStatus(pessoa: any) {

    const novoStatus = !pessoa.ativo;

    this.pessoaService.mudarStatus(pessoa.codigo, novoStatus)
      .then(() => {
        pessoa.ativo = novoStatus;
        const acao = novoStatus ? 'ativada' : 'desativada';
        this.messageService.add({
          severity: 'success',
          detail: `Pessoa ${acao} com sucesso!`
        });
      })
      .catch(erro => {
        this.errorHandler.handle(erro)
      });
  }
}
