import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

// imports menu
import { UsuarioComponent } from '../../atualizar/cadastros/usuarios/usuario.component';
import { SignInComponent } from '../../components/login/sign-in/sign-in.component';
import { ForgotPasswordComponent } from '../../components/login/forgot-password/forgot-password.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProdutoComponent } from 'app/atualizar/cadastros/produto/produto.component';
import { EstruturaComponent } from 'app/atualizar/cadastros/estrutura/estrutura.component';
import { ForneceComponent } from 'app/atualizar/cadastros/fornece/fornece.component';
import { AtuprecoComponent } from 'app/atualizar/compras/atupreco/atupreco.component';
import { MontalistaComponent } from 'app/atualizar/compras/montalista/montalista.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  declarations: [
    DashboardComponent,
    ForneceComponent,
    SignInComponent,
    ForgotPasswordComponent,
    UsuarioComponent,
    ProdutoComponent,
    AtuprecoComponent,
    MontalistaComponent,
    EstruturaComponent,
  ]
})

export class AdminLayoutModule { }
