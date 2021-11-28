import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { fxJson } from 'app/shared/funcs/funcs';

// tslint:disable-next-line:class-name
export interface cadMontalista {
  empresa: string;
  nome: string;
  email: string;
  senha: string;
  perfil: string;
  telefone: string;
  depto: string;
}

@Component({
  selector: 'app-Montalista',
  templateUrl: './Montalista.component.html',
  styleUrls: ['./Montalista.component.css']
})

export class MontalistaComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrFornecDados = JSON.parse(localStorage.getItem('fornecDados'))[0];
  arrMontalista: any = [];
  arrMontalistaTab: any = [];
  arrGrupoPrd: any = [];
  arrGrupoPrdTab: any = [];
  enableEditIndex = null;
  grupoSelec: string = '';
  grupoProd: string = '';
  itensSelec: any;

  ftuprecos: Observable<any>;
  displayedColumns: string[] = ['seq', 'grupo', 'produto', 'nomproduto', 'codfor', 'diaenv', 'horenv'];
  dataSource: MatTableDataSource<cadMontalista>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private funcJson: fxJson,
  ) { }

  ngOnInit(): void {
    this.buscaMontalistas();
    this.buscaGrupos();
  }

  buscaGrupos() {
    const obj = {
      '': ''
    };
    this.arrGrupoPrd = this.funcJson.buscaJsonPost('cadGrupoProdutos', obj);

    this.arrGrupoPrd.subscribe(cada => {
      cada.forEach(xy => {
        this.arrGrupoPrdTab.push({
          'grupo': xy.grupo,
          'descricao': xy.descricao,
          'qtde': xy.qtde,
          'lista': xy.lista,
        })
      });
    });
  }

  atuLista() {

    if (this.grupoSelec === '') {
      this.grupoSelec = this.grupoProd
    } else {

      if (this.grupoSelec.indexOf(this.grupoProd) < 0) {
        this.grupoSelec = this.grupoSelec + ' - ' + this.grupoProd
      } else {
        if (this.grupoSelec.indexOf(' - ' + this.grupoProd) > -1) {
          this.grupoSelec = this.grupoSelec.replace(' - ' + this.grupoProd, '')
        } else {
          this.grupoSelec = this.grupoSelec.replace(this.grupoProd, '')
        }
      }
    }
    if (this.grupoSelec.substring(0, 1) === ' ') {
      this.grupoSelec = this.grupoSelec.substring(3, 101)
    }

    this.arrMontalistaTab = [];
    this.buscaMontalistas();
  }

  buscaMontalistas() {
    let seq = 0;
    const obj = {
      'codFor': this.arrFornecDados.cod,
      'codLoja': this.arrFornecDados.loja,
      'codGrupo': this.grupoSelec,
    };
    this.arrMontalista = this.funcJson.buscaJsonPost('amarraFornecProduto', obj);

    this.arrMontalista.subscribe(cada => {
      cada.forEach(xy => {
        seq++
        this.arrMontalistaTab.push({
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
          'idcod': xy.idcod,
        })
      });
      this.dataSource = new MatTableDataSource(this.arrMontalistaTab)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.itensSelec = seq + ' Selecionados'
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
