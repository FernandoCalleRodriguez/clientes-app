import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service'
import Swal from 'sweetalert2';
import { tap} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalService} from './detalle/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  private clienteService: ClienteService;
  paginador: any;
  clienteSeleccionado: Cliente = new Cliente;

  constructor(clienteService: ClienteService,
  private activateRoute: ActivatedRoute,
  private modalService: ModalService) {
    this.clienteService = clienteService
  }

  ngOnInit(): void {
    let page = 0;
    this.cargarPagina();

    //this.clienteService.getClientes().subscribe(function (clientes)  {this.clientes = clientes} );//
  }

  cargarPagina(): void {
    this.activateRoute.paramMap.subscribe(
      params => {
        let page:number = Number(params.get('page'));
        if(!page){
          page = 0;
        }
          this.clienteService.getClientes(page).pipe(
            tap( (response:any) => {
              console.log('Clientes Component:tap3');
              (response.content as Cliente[]).forEach( cliente => {
                console.log(cliente.nombre)
              })
            })
          ).subscribe(
            (response:any) => {
             this.clientes = response.content as Cliente[];
             this.paginador = response;
           });

      }
    )
  }

  delete(cliente: Cliente): void {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            if(this.clientes){
              this.clientes = this.clientes.filter(cli => cli !== cliente);
            }
            Swal.fire(
              'Eliminado !',
              'El cliente ha sido eliminado con exito.',
              'success'
            )
          }

        )

      }
    })
  }
  abrirModal(cliente: Cliente){
    this.modalService.abrirModal();
    this.clienteSeleccionado = cliente;
  }
}
