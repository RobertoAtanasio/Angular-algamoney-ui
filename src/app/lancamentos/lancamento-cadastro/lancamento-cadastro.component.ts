import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { CategoriaService } from './../../categorias/categoria.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { Lancamento } from './../../core/model';
import { FormControl } from '@angular/forms';
import { LancamentoService } from '../lancamento.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent  implements OnInit {

  vencimento: Date;
  recebimento: Date;

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  categorias = [];
  pessoas = [];
  lancamento = new Lancamento();

  types: SelectItem[];
  selecionado: string;

  constructor(
    private categoriaService: CategoriaService,
    private lancamentoService: LancamentoService,
    private pessoaService: PessoaService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title) {
    this.types = [
      {label: 'Paypal', value: 'PayPal', icon: 'fa fa-fw fa-cc-paypal'},
      {label: 'Visa', value: 'Visa', icon: 'fa fa-fw fa-cc-visa'},
      {label: 'MasterCard', value: 'MasterCard', icon: 'fa fa-fw fa-cc-mastercard'}
    ];
  }

  ngOnInit() {
    // console.log(this.route.snapshot.params);
    // console.log(this.route.snapshot.params['codigo']);
    this.title.setTitle('Novo Lançamento');
    this.carregarCategorias();
    this.carregarPessoas();
    const codigoLancamento  = this.route.snapshot.params['codigo']
    if (codigoLancamento) {
      this.title.setTitle('Edição de Lançamento');
      this.carregarLancamento(codigoLancamento);
    }
    // if (typeof codigoLancamento === 'string') {
    //   setTimeout(function() {
    //     this.router.navigate(['/pagina-nao-encontrada']);
    //   }.bind(this), 1);
    // }
  }

  carregarLancamento(codigo: number) {
    return this.lancamentoService.buscarPorCodigo(codigo)
      .then((data) => {
        this.lancamento = data;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.lancamento.codigo);
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.lancamentoService.adicionar(this.lancamento)
      .then((data) => {
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento adicionado com sucesso!'
        });
        // form.reset();
        // this.lancamento = new Lancamento();
        console.log('>', data);
        this.lancamento.codigo = data.codigo;
        this.title.setTitle('Edição de Lançamento');
        // this.router.navigate(['/lancamentos', data.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizar(form: FormControl) {
    this.lancamentoService.atualizar(this.lancamento)
      .then((data) => {
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento atualizado com sucesso!'
        });
        this.lancamento = data;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {
        this.categorias = categorias.map(c => ({ label: c.nome, value: c.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    return this.pessoaService.listarTodas()
      .then((data) => {
        const lista = data.content;
        this.pessoas = lista.map(p => ({ label: p.nome, value: p.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();
    // o setTimeout é para corrigir um BUG, pois se executar imediatamente o código new abaixo
    // a construção tipo = 'RECEITA' do objeto não funciona!!!!  Atentar para colocar o bind.
    setTimeout(function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1);
    this.router.navigate(['/lancamentos/novo']);
  }
}
