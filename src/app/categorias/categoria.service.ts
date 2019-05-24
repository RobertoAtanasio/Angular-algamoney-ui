import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

export class CategoriaFiltro {
  codigo: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  categoriasUrl: string;

  constructor(private http: HttpClient) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`;
  }

  listarTodas(): Promise<any> {
    return this.acessarApi('');
  }

  acessarApi(filtro: string): Promise<any> {
      return this.http.get(this.categoriasUrl)
      .toPromise()
      .then(response => {
        return response;
      });
  }
}
