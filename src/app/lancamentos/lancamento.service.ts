import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
  HttpEvent,
  HttpResponse } from '@angular/common/http';

import * as moment from 'moment';
import { Lancamento } from './../core/model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from './../../environments/environment';

export class LancamentoFiltro {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  // retorno: any;
  lancamentosUrl: string;

  constructor(
    private httpClient: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  urlUploadAnexo(): string {
    return `${this.lancamentosUrl}/anexo`;
  }

  upload(data) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'multipart/form-data');
    const uploadURL = `${this.lancamentosUrl}/anexo`;
    // console.log('>>> uploadURL', uploadURL, data);
    // return this.httpClient.post(uploadURL, data, {
    //     headers,
    //     reportProgress: true,
    //     observe: 'events'
    //   }).pipe(map( event => {
    //     console.log('>>> pipe', event.type);
    //     switch (event.type) {
    //       case HttpEventType.UploadProgress:
    //         const progress = Math.round(100 * event.loaded / event.total);
    //         return { status: 'progress', message: progress };

    //       case HttpEventType.Response:
    //         return event.body;

    //       default:
    //         return `Unhandled event: ${event.type}`;
    //     }
    //   })
    // );

    return this.httpClient.post(uploadURL, data, { headers })
      .toPromise()
      .then(response => {
        return response;
      });
  }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {

    let params = new HttpParams()
      .set('page', filtro.pagina.toString())
      .set('size', filtro.itensPorPagina.toString());

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe',
        moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }

    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte',
        moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }

    // this.retorno = this.http.get(`${this.lancamentosUrl}?resumo`, { params })
    // .subscribe(
    //   data => console.log('OK', data),
    //   err => console.log('Houve erro', err)
    // );

    return this.httpClient.get(`${this.lancamentosUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        return response;
      }
    );

  }

  getAllGet(filtro: LancamentoFiltro): Observable<any> {

    let params = new HttpParams()
      .set('page', filtro.pagina.toString())
      .set('size', filtro.itensPorPagina.toString());

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe',
        moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }

    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte',
        moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }

    return this.httpClient.get<any> (`${this.lancamentosUrl}?resumo`, { params })
      .pipe(
        map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                console.log('> Evento:', event);
                console.log('URL', event.url);
            }
            return event;
          }
        ),
        catchError(this.handlerError)
      );
  }

  handlerError(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
  }

  excluir(codigo: number): Promise<void> {
      return this.httpClient.delete(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(lancamento: Lancamento): Promise<any> {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    return this.httpClient.post(this.lancamentosUrl, lancamento, { headers })
      .toPromise()
      .then(response => response);
  }

  atualizar(lancamento: Lancamento): Promise<any> {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    return this.httpClient.put(`${this.lancamentosUrl}/${lancamento.codigo}`, lancamento, { headers })
      .toPromise()
      .then(response => {
        const lancamentoAlterado = response;

        this.converterStringsParaDatas(lancamentoAlterado);

        return lancamentoAlterado;
      });
  }

  buscarPorCodigo(codigo: number): Promise<any> {
    return this.httpClient.get(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const lancamento = response;
        this.converterStringsParaDatas(lancamento);
        return response;
      });
  }

  private converterStringsParaDatas(lancamento: any) {
    // for (const lancamento of lancamentos) {
      lancamento.dataVencimento = moment(lancamento.dataVencimento,
        'YYYY-MM-DD').toDate();

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(lancamento.dataPagamento,
          'YYYY-MM-DD').toDate();
      }
    // }
  }
}
