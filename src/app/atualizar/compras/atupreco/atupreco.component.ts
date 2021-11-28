import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { fxJson } from 'app/shared/funcs/funcs';

// tslint:disable-next-line:class-name
export interface cadAtupreco {
  empresa: string;
  nome: string;
  email: string;
  senha: string;
  perfil: string;
  telefone: string;
  depto: string;
}

@Component({
  selector: 'app-Atupreco',
  templateUrl: './Atupreco.component.html',
  styleUrls: ['./Atupreco.component.css']
})

export class AtuprecoComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrAtupreco: any = [];
  arrAtuprecoTab: any = [];
  enableEditIndex = null;


  ftuprecos: Observable<any>;
  displayedColumns: string[] = ['seq', 'grupo', 'produto', 'nomproduto', 'codfor', 'diaenv', 'horenv'];
  dataSource: MatTableDataSource<cadAtupreco>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private funcJson: fxJson,
  ) { }

  ngOnInit(): void {
    this.buscaAtuprecos();
  }

  buscaAtuprecos() {
    let seq = 0;
    const obj = {
      'codFor': '001992',
      'codLoja': '01',
      'codGrupo': '202',
    };
    this.arrAtupreco = this.funcJson.buscaJsonPost('amarraFornecProduto', obj);

    this.arrAtupreco.subscribe(cada => {
      cada.forEach(xy => {
        seq++
        this.arrAtuprecoTab.push({
          'seq': seq,
          'origem': xy.origem,
          'filial': xy.filial,
          'cod': xy.cod,
          'loja': xy.loja,
          'nome': xy.nome,
          'grupo': xy.grupo,
          'produto': xy.produto,
          'nomproduto': xy.nomproduto,
          'codfor': xy.codfor,
          'preco': xy.preco,
          'diaenv': xy.diaenv,
          'horenv': xy.horenv,
        })
      });
      this.dataSource = new MatTableDataSource(this.arrAtuprecoTab)
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
  enableEditUser(e, i) {
    this.enableEditIndex = i;
    // (<HTMLInputElement>(document.getElementById("editQtd"))).focus()
    console.log(i, e)
  }
  btnEditDisable(aRow) {
    return aRow.SITUACA === 'A'
  }
  // tecla para retorno de tela
  voltaFornec() {
    this.router.navigate(['fornecedor']);
  }


}
