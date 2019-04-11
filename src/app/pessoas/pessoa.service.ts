import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Pessoa } from './../core/model';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 3;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  pessoaUrl = 'http://localhost:8080/pessoas';

  constructor(private http: HttpClient) { }

  pesquisar(filtro: PessoaFiltro): Promise<any> {

    let params = new HttpParams()
      .set('page', filtro.pagina.toString())
      .set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return this.http.get(this.pessoaUrl, { params })
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(response => {
        console.error('Erro ao pesquisar pessoas.', response);
        return response;
      });;
  }

  listarTodas(): Promise<any> {
    return this.http.get(this.pessoaUrl)
      .toPromise()
      .then(response => {
        return response;
      });
  }

  buscarPorCodigo(codigo: number): Promise<any> {
    return this.http.get(`${this.pessoaUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const pessoa = response;
        return response;
      });
  }

  excluir(codigo: number): Promise<void> {
      return this.http.delete(`${this.pessoaUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  mudarStatus(codigo: number, status: boolean): Promise<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.http.put(`${this.pessoaUrl}/${codigo}/ativo`, status, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<any> {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    return this.http.post(this.pessoaUrl, pessoa, { headers })
      .toPromise()
      .then(response => response);
  }

  atualizar(pessoa: Pessoa): Promise<any> {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    return this.http.put(`${this.pessoaUrl}/${pessoa.codigo}`, pessoa, { headers })
      .toPromise()
      .then(response => {
        return response;
      });
  }
}
