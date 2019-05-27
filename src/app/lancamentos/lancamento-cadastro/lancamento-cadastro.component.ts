import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/components/common/messageservice';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { Lancamento } from './../../core/model';
import { LancamentoService } from '../lancamento.service';

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
  formulario: FormGroup;
  uploadEmAndamento = false;

  selecionado: string;

  uploadedFiles: any[] = [];

  fileData: File = null;

  constructor(
    private categoriaService: CategoriaService,
    private lancamentoService: LancamentoService,
    private pessoaService: PessoaService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.configurarFormulario();

    // console.log(this.route.snapshot.params);
    // console.log(this.route.snapshot.params['codigo']);
    const codigoLancamento  = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Lançamento');

    if (codigoLancamento) {
      this.title.setTitle('Edição de Lançamento');
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  fileProgress(fileInput: any) {
    console.log('<<< aqui >>>');
    this.fileData = <File>fileInput.target.files[0];
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.fileData = event.target.files[0];
    }
  }

  onSubmit() {
    console.log('>>> upload', this.fileData);
    // const formData = new FormData();
    // formData.append('file', this.fileData);
    return this.lancamentoService.upload(this.fileData);
  }

  onUpload(event) {
    for(const file of event.files) {
        this.uploadedFiles.push(file);
    }
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

  antesUploadAnexo(event) {

    console.log('>>>', event);

    // event.xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    // (<XMLHttpRequest>event.xhr).setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    // event.xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    // event.xhr.setRequestHeader('Content-Type', 'multipart/form-data');

    this.uploadEmAndamento = true;
  }

  aoTerminarUploadAnexo(event) {
    const anexo = JSON.parse(event.xhr.response);

    this.formulario.patchValue({
      anexo: anexo.nome,
      urlAnexo: anexo.url
    });

    this.uploadEmAndamento = false;
  }

  erroUpload() {
    console.log('>>> Houve Erro <<<');
    this.messageService.add({
      severity: 'danger',
      detail: 'Erro ao tentar enviar anexo!'
    });
    this.uploadEmAndamento = false;
  }

  removerAnexo() {
    this.formulario.patchValue({
      anexo: null,
      urlAnexo: null
    });
  }

  get nomeAnexo() {
    const nome = this.formulario.get('anexo').value;
    if (nome) {
      return nome.substring(nome.indexOf('_') + 1, nome.length);
    }
    return '';
  }

  // get urlAnexo() {
  //   return this.formulario.get('urlAnexo').value;
  // }

  get urlUploadAnexo() {
    return this.lancamentoService.urlUploadAnexo();
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [ ],
      tipo: [ 'RECEITA', Validators.required ],
      dataVencimento: [ null, Validators.required ],
      dataPagamento: [],
      descricao: [null, [ this.validarObrigatoriedade, this.validarTamanhoMinimo(5) ]],
      valor: [ null, Validators.required ],
      pessoa: this.formBuilder.group({
        codigo: [ null, Validators.required ]
      }),
      categoria: this.formBuilder.group({
        codigo: [ null, Validators.required ]
      }),
      observacao: [],
      anexo: [],
      urlAnexo: []
    });
  }

  validarObrigatoriedade(input: FormControl) {
    // obs.: caso fosse necessário, poderíamos obter as variáveis da tela e tratar de acordo
    //       comm as nossas necessidades de teste.
    // const dtVenc = input.root.get('dataVencimento').value;
    return (input.value ? null : { obrigatoriedade: true });
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
    };
  }

  carregarLancamento(codigo: number) {
    return this.lancamentoService.buscarPorCodigo(codigo)
      .then((lancamento) => {
        this.formulario.patchValue(lancamento);
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.formulario.get('codigo').value);
  }

  salvar() {
    if (this.editando) {
      this.atualizarLancamento();
    } else {
      this.adicionarLancamento();
    }
  }

  adicionarLancamento() {
    this.lancamentoService.adicionar(this.formulario.value)
      .then(lancamento => {
        this.formulario.get('codigo').setValue(lancamento.codigo);
        this.title.setTitle('Edição de Lançamento');
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento adicionado com sucesso!'
        });
        // form.reset();
        // this.lancamento = new Lancamento();
        // this.router.navigate(['/lancamentos', lancamento.codigo]);
      })
      .catch(erro => {
        console.log('>> Erro:', erro);
        this.errorHandler.handle(erro);
      });
  }

  atualizarLancamento() {
    this.lancamentoService.atualizar(this.formulario.value)
      .then(lancamento => {
        this.formulario.patchValue(lancamento);
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento atualizado com sucesso!'
        });
        this.atualizarTituloEdicao();
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
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

  novo() {
    this.formulario.reset();
    // o setTimeout é para corrigir um BUG, pois se executar imediatamente o código new abaixo
    // a construção tipo = 'RECEITA' do objeto não funciona!!!!  Atentar para colocar o bind.
    setTimeout(function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1);
    this.router.navigate(['/lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.formulario.get('descricao').value}`);
  }
}
