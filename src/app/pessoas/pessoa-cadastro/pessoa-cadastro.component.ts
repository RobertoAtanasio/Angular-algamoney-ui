import { Component, OnInit } from '@angular/core';
import { Pessoa, Contato } from './../../core/model';
import { PessoaService } from '../pessoa.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { MessageService } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  // exibindoFormularioContato = false;
  pessoa = new Pessoa();
  estados: any[];
  cidades: any[];
  estadoSelecionado: number;
  // contato: Contato;
  // contatoIndex: number;

  constructor(
    private pessoaService: PessoaService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Nova Pessoa');
    const codigoPessoa  = this.route.snapshot.params['codigo']
    this.carregarEstados();
    if (codigoPessoa) {
      // this.title.setTitle('Edição de Pessoa');
      this.atualizarTituloEdicao();
      this.carregarPessoa(codigoPessoa);
    }
    // if (typeof codigoPessoa === 'string') {
    //   setTimeout(function() {
    //     this.router.navigate(['/pagina-nao-encontrada']);
    //   }.bind(this), 1);
    // }
  }

  // prepararNovoContato() {
  //   this.exibindoFormularioContato = true;
  //   this.contato = new Contato();
  //   this.contatoIndex = this.pessoa.contatos.length;
  // }

  // prepararEdicaoContato(contato: Contato, index: number) {
  //   this.contato = this.clonarContato(contato);
  //   this.exibindoFormularioContato = true;
  //   this.contatoIndex = index;
  // }

  // removerContato(index: number) {
  //   this.pessoa.contatos.splice(index, 1);
  //   // delete this.pessoa.contatos[index];
  // }

  // confirmarContato(frm: FormControl) {
  //   // retirar a partir dos dados do contato do formulário e criar o objeto
  //   // que será passado para a classe pessoa que será utilizada na atualização da pessoa
  //   // this.pessoa.contatos.push(this.clonarContato(this.contato));
  //   this.pessoa.contatos[this.contatoIndex] = this.clonarContato(this.contato);
  //   this.exibindoFormularioContato = false;
  //   frm.reset();
  // }

  // clonarContato(contato: Contato): Contato {
  //   return new Contato(contato.codigo,
  //     contato.nome, contato.email, contato.telefone);
  // }

  carregarEstados() {
    this.pessoaService.listarEstados()
      .then(lista => {
        this.estados = lista.map( uf  => ({ label: uf.nome, value: uf.codigo }) )
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  alterouEstado() {
    this.pessoa.endereco.cidade.codigo = null;
    this.carregarCidades();
  }

  carregarCidades() {
    // console.log('Estado',this.estadoSelecionado);
    this.pessoaService.pesquisarCidades(this.estadoSelecionado).then(lista => {
      this.cidades = lista.map(c => ({ label: c.nome, value: c.codigo }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoa(codigo: number) {
    return this.pessoaService.buscarPorCodigo(codigo)
      .then((data) => {
        this.pessoa = data;
        this.estadoSelecionado = (this.pessoa.endereco.cidade) ?
              this.pessoa.endereco.cidade.estado.codigo : null;
        if (this.estadoSelecionado) {
          this.carregarCidades();
        }
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  salvar(form: FormControl) {
    // console.log('Nome', form.value.nomex);
    // console.log('Nome', this.pessoa.nome);
    if (this.editando) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.pessoaService.adicionar(this.pessoa)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa adicionada com sucesso!'
        });
        form.reset();
        this.pessoa = new Pessoa();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizar(form: FormControl) {
    this.pessoaService.atualizar(this.pessoa)
      .then((data) => {
        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa atualizada com sucesso!'
        });
        this.pessoa = data;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();
    // o setTimeout é para corrigir um BUG, pois se executar imediatamente o código new abaixo
    // a construção tipo = 'RECEITA' do objeto não funciona!!!!  Atentar para colocar o bind.
    setTimeout(function() {
      this.pessoa = new Pessoa();
    }.bind(this), 1);
    this.router.navigate(['/pessoas/nova']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`);
  }

}
