import { Injectable } from '@angular/core';
import { Cliente} from './cliente';
import { Observable, throwError} from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent} from '@angular/common/http';
import { map, catchError, tap} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router} from '@angular/router'
import { formatDate, DatePipe} from '@angular/common'
import localeES from '@angular/common/locales/es'

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8888/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});
  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<Cliente[]>{
    //return of(CLIENTES);

    //return this.http.get<Cliente[]>(this.urlEndPoint);

    return this.http.get(this.urlEndPoint+"/page/" + page).pipe(
      tap(
        //tap no modifica el resultado
        (response:any) => {
          (response.content as Cliente[]).forEach(
            cliente =>{
              console.log("tap 1:" + cliente.nombre);
            }
          )
        }
      ),

      map( (response:any) => {

        (response.content as Cliente []).map(
          (cliente: Cliente) => {
            cliente.nombre = cliente.nombre?.toUpperCase();
            if(cliente.createAt){
              //cliente.createAt = formatDate(cliente.createAt, "dd-MM-yyyy",'en-US');
              //let datePipe = new DatePipe('es');
              //cliente.createAt = datePipe.transform(cliente.createAt, "EEEE dd, MMMM yyyy")?.toString();

            }
            return cliente;
          }
        );
        return response;

      }
    ),
    tap(
      //Como map SI que modifica el resultado ahora ya tenemos un [] de clientes
      (response:any) => {
        (response.content as Cliente []).forEach(
          cliente =>{
            console.log("tap 2: " + cliente.nombre);
          }
        )
      }
    ),
  );
  }

  create (cliente: Cliente): Observable<any>{

    return this.http.post<any>(this.urlEndPoint, cliente, {headers:this.httpHeaders}).pipe(
      catchError( e => {

        if(e.status == 400){
          return throwError(e);
        }

        console.log(e.error);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );

  }

  getCliente(id: String): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError( e => {
        this.router.navigate(['/clientes']);
        console.log(e.error);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );

  }

  update (cliente: Cliente): Observable<Cliente>{

    return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers:this.httpHeaders}).pipe(
      map(
        (response: any )=> response.cliente as Cliente
      ),
      catchError( e => {

        if(e.status == 400){
          return throwError(e);
        }

        console.log(e.error);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );

  }

  delete (id: any): Observable<Cliente>{

    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers:this.httpHeaders}).pipe(
      catchError( e => {
        console.log(e.error);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );

  }

  subirFoto(archivo: File, id: any): Observable<HttpEvent<FormData>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

     const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`, formData,{
      reportProgress: true
    });

    return this.http.request(req);
  }
}
