import { Routes } from '@angular/router';

import { SignInComponent } from '../../components/login/sign-in/sign-in.component';
import { UsuarioComponent } from '../../atualizar/cadastros/usuarios/usuario.component';
import { AuthGuard } from '../../components/login/shared/guard/auth.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { EstruturaComponent } from 'app/atualizar/cadastros/estrutura/estrutura.component';
import { ProdutoComponent } from 'app/atualizar/cadastros/produto/produto.component';
import { ForneceComponent } from 'app/atualizar/cadastros/fornece/fornece.component';
import { AtuprecoComponent } from 'app/atualizar/compras/atupreco/atupreco.component';
import { MontalistaComponent } from 'app/atualizar/compras/montalista/montalista.component';

export const AdminLayoutRoutes: Routes = [

    { path: 'sign-in', component: SignInComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]  },
    { path: 'fornecedor', component: ForneceComponent, canActivate: [AuthGuard] },
    { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard] },
    { path: 'produto', component: ProdutoComponent, canActivate: [AuthGuard] },
    { path: 'montalista', component: MontalistaComponent, canActivate: [AuthGuard] },
    { path: 'atupreco', component: AtuprecoComponent, canActivate: [AuthGuard] },
    { path: 'estrutura', component: EstruturaComponent, canActivate: [AuthGuard] },
    
];


