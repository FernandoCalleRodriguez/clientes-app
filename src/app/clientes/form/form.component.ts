import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente;
  public titulo: string = "Crear cliente:";
  errores: string[] = [];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activateRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activateRoute.params.subscribe(
      params => {
        let id = params['id'];
        if(id){
          this.clienteService.getCliente(id).subscribe(
            result => this.cliente = result
          )
        }
      }
    )
  }

  public create(): void {
    console.log("clicked");
    console.log(this.cliente);

    this.clienteService.create(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes'])
        Swal.fire("Nuevo cliente", `${json.mensaje}: ${json.cliente.nombre}`, 'success')
      },
      err => {
        this.errores = err.error.error as string[];
        console.error(err.status)
        console.error(err.error.error)
      }
    );
  }

  public update(): void {
    console.log(this.cliente);

    this.clienteService.update(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire("Cliente modificado", `El cliente: ${cliente.nombre} ha sido modificado con exito`, 'success')
      },
      err => {
        this.errores = err.error.error as string[];
        console.error(err.status)
        console.error(err.error.error)
      }
    );
  }
}
