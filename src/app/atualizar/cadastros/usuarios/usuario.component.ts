import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { fxJson } from 'app/shared/funcs/funcs';

// tslint:disable-next-line:class-name
export interface cadUsuario {
  empresa: string;
  nome: string;
  email: string;
  senha: string;
  perfil: string;
  telefone: string;
  depto: string;
}

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})

export class UsuarioComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrUsuario: any = [];
  arrUsuarioTab: any = [];
  arrEmpresa: any = [];
  arrEmpresaTab: any = [];
  valEmpresa: string = '';
  valPerfil: string = '';
  usuarioCodigo: string = '';
  usuarioEmpresas: string = '';
  usuarioNome: string = '';
  usuarioEmail: string = '';
  usuarioSenha: string = '';
  usuarioFone: string = '';
  usuarioDepto: string = '';
  altIncuser: string = '';
  optPerfil: string[] = ['Apontador', 'Conferente', 'Conferente-Apontador', 'Administrador'];
  arrFilial: any = ['101', '107', '117', '402', '108', '206']
  usuarios: Observable<any>;
  displayedColumns: string[] = ['nome', 'email', 'empresa', 'perfil', 'telefone', 'depto', 'edicao'];
  dataSource: MatTableDataSource<cadUsuario>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;




  constructor(
    public router: Router,
    private funcJson: fxJson,
  ) { }

  ngOnInit(): void {
    if (this.arrUserLogado.login === 'FOR') {
      alert('Sem Acesso')
      this.router.navigate(['sign-in']);
    }
    this.buscaUsuarios();
  }


  buscaUsuarios() {
    const obj = {};
    this.arrUsuario = this.funcJson.buscaJsonPost('cadUsuarios', obj);

    this.arrUsuario.subscribe(cada => {
      cada.forEach(xy => {
        this.arrUsuarioTab.push({
          'codUser': xy.codigo,
          'empresa': xy.empresa,
          'nome': xy.nome,
          'email': xy.email,
          'senha': xy.senha,
          'perfil': xy.perfil,
          'depto': xy.depto,
          'telefone': xy.telefone,
        })

      });
      this.dataSource = new MatTableDataSource(this.arrUsuarioTab)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
