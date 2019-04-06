import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class CategoriaFiltro {
  codigo: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  categoriaUrl = 'http://localhost:8080/categorias';
  bearer = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbkBhbGdhbW9uZXkuY29tIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sIm5vbWUiOiJBZG1pbmlzdHJhZG9yIiwiZXhwIjoxNTU0NDk4NzYyLCJhdXRob3JpdGllcyI6WyJST0xFX0NBREFTVFJBUl9DQVRFR09SSUEiLCJST0xFX1BFU1FVSVNBUl9QRVNTT0EiLCJST0xFX1JFTU9WRVJfUEVTU09BIiwiUk9MRV9DQURBU1RSQVJfTEFOQ0FNRU5UTyIsIlJPTEVfUEVTUVVJU0FSX0xBTkNBTUVOVE8iLCJST0xFX1JFTU9WRVJfTEFOQ0FNRU5UTyIsIlJPTEVfQ0FEQVNUUkFSX1BFU1NPQSIsIlJPTEVfUEVTUVVJU0FSX0NBVEVHT1JJQSJdLCJqdGkiOiJjMTU3NmU5OC0xZTJjLTQxNjUtODVhOS1hNWU2NTI0MGJlYzIiLCJjbGllbnRfaWQiOiJhbmd1bGFyIn0.gfNv9q5m9pltpkjOOFmXv5aYJxYJjtWgA0QmvPQHEM8`;

  constructor(private http: HttpClient) { }

  listarTodas(): Promise<any> {
    return this.acessarApi('');
  }

  acessarApi(filtro: string): Promise<any> {
    const headers = new HttpHeaders()
      .set('Authorization', this.bearer);

      return this.http.get(this.categoriaUrl, { headers })
      .toPromise()
      .then(response => {
        return response;
      });
  }
}
