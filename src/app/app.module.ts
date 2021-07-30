import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form/form.component';
import { PaginatorComponent } from './paginator/paginator.component'
import { DetalleComponent } from './clientes/detalle/detalle.component';

import { ClienteService } from './clientes/cliente.service';

import { HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes} from '@angular/router'
import { FormsModule} from '@angular/forms';
import { MatMomentDateModule} from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { registerLocaleData} from '@angular/common'
import localeES from '@angular/common/locales/es';

registerLocaleData(localeES, 'es');


const routes:Routes =[
  {path:'', redirectTo:'/clientes', pathMatch: 'full'},
  {path:'directivas', component: DirectivaComponent},
  {path:'clientes', component: ClientesComponent},
  {path:'clientes/page/:page', component: ClientesComponent},
  {path:'clientes/form', component: FormComponent},
  {path:'clientes/form/:id', component: FormComponent},

]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule,

  ],
  providers: [
    ClienteService,
    {provide: LOCALE_ID, useValue: 'es'},
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
