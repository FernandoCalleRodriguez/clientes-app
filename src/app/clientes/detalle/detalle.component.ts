import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType} from '@angular/common/http';
import { ModalService} from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() public cliente: Cliente = new Cliente;
  public imagenSeleccionada: File = new File(["foo"], "foo.txt", {
  type: "text/plain",});
  public progreso: number =0;

  constructor(private clienteService: ClienteService,
    public modalService: ModalService
    ) {
}

  ngOnInit(): void {
  }

  seleccionarFoto(event: any): void{
    this.imagenSeleccionada = event.target.files[0];
    this.progreso = 0;
    //console.log.(this.imagenSeleccionada);
    if(this.imagenSeleccionada.type.indexOf('image') < 0){
      Swal.fire("Error: ", "Debe seleccionar un archivo de tipo imagen!", 'error')

    }
  }

  subirFoto(){
    console.log(this.imagenSeleccionada);
    if(!this.imagenSeleccionada || this.imagenSeleccionada.name == "foo.txt"){
      Swal.fire("Error: ", "Debe seleccionar una foto!", 'error')

    }else{
      this.clienteService.subirFoto(this.imagenSeleccionada,this.cliente.id).subscribe(
        (event: any) => {

          if(event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded/event.total)*100);
          }else if(event.type === HttpEventType.Response ){
            let response:any = event.body;
            this.cliente = response.cliente as Cliente;
            Swal.fire("La foto se ha subido completamente!", `La foto se ha subido con éxito: ${this.cliente.foto}`, 'success')

          }
          //this.cliente = cliente
        }
      );
    }

  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.imagenSeleccionada = new File(["foo"], "foo.txt", {
    type: "text/plain",});
    this.progreso = 0;
  }
}
