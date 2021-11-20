import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { fxJson } from 'app/shared/funcs/funcs';

// tslint:disable-next-line:class-name
export interface cadFornece {
  empresa: string;
  nome: string;
  email: string;
  senha: string;
  perfil: string;
  telefone: string;
  depto: string;
}

@Component({
  selector: 'app-Fornece',
  templateUrl: './Fornece.component.html',
  styleUrls: ['./Fornece.component.css']
})

export class ForneceComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrFornece: any = [];
  arrForneceTab: any = [];


  forneces: Observable<any>;
  displayedColumns: string[] = ['seq', 'cod', 'loja', 'nome', 'cnpj', 'edicao'];
  dataSource: MatTableDataSource<cadFornece>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private funcJson: fxJson,
  ) { }

  ngOnInit(): void {
    this.buscaForneces();
  }

  buscaForneces() {
    let seq = 0;
    const obj = {
      'Fornece': ''
    };
    this.arrFornece = this.funcJson.buscaJsonPost('cadFornecedores', obj);

    this.arrFornece.subscribe(cada => {
      cada.forEach(xy => {
        seq++
        this.arrForneceTab.push({
          'seq': seq,
          'cod': xy.cod,
          'loja': xy.loja,
          'nome': xy.nome,
          'nreduz': xy.nreduz,
          'cnpj': xy.cnpj,
          'cidade': xy.cidade,
          // ['filial', 'cod', 'loja', 'nome', 'nreduz', 'cnpj', 'cidade'];
        })

      });


      this.dataSource = new MatTableDataSource(this.arrForneceTab)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  exportExcel(fileName, sheetName) {
    const fn = fileName + '.xlsx';
    const sn = sheetName;
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data, { header: [] });
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, sn);
    XLSX.writeFile(workBook, fn);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}