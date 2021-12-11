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
  arrAtulista: any = [];
  arrGrupoPrd: any = [];
  arrGrupoPrdTab: any = [];
  enableEditIndex = null;
  grupoSelec: string = '';
  grupoProd: string = '';
  itemSelec: string = '';
  mailFornec: string = JSON.parse(localStorage.getItem('fornecDados'))[0].email;
  contatoFornec: string = JSON.parse(localStorage.getItem('fornecDados'))[0].contato;
  itensSelec: any;

  ftuprecos: Observable<any>;
  displayedColumns: string[] = ['seq', 'grupo', 'edicao', 'produto', 'nomproduto', 'idcod', 'itSel'];
  dataSource: MatTableDataSource<cadMontalista>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private funcJson: fxJson,
  ) { }

  ngOnInit(): void {
    if (this.arrUserLogado.login === 'FOR') {
      alert('Sem Acesso')
      this.router.navigate(['sign-in']);
    }
    this.buscaMontalistas();
    this.buscaGrupos();
  }

  envLista() {
    const xcContato = this.contatoFornec
    const xcEmail = this.mailFornec
    const obj = {
      'codFor': this.arrFornecDados.cod,
      'codLoja': this.arrFornecDados.loja,
      'codGrupo': this.grupoSelec,
      'xcEmail': xcEmail,
      'xcContato': xcContato,
    };
    if (this.grupoSelec !== '') {
      this.funcJson.execJsonPost('geraListaFornecProd', obj);
      alert('envio ok')
      window.location.reload();
    } else {
      alert('Nenhum Grupo Selecionado!')
    }

  }

  // marcação e limpeza dos itens na lista para os fornecedores
  itensMarca(xnTipo) {
    if (xnTipo === 0) {
      this.itemSelec = ''

    }
    if (xnTipo === 1) {
      this.arrMontalistaTab.forEach(xx => {
        this.itemSelec = this.itemSelec + '|' + xx.produto
      });
    }

    this.arrMontalistaTab = [];
    this.buscaMontalistas();
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
        this.grupoSelec = this.grupoSelec + '|' + this.grupoProd
      } else {
        if (this.grupoSelec.indexOf('|' + this.grupoProd) > -1) {
          this.grupoSelec = this.grupoSelec.replace('|' + this.grupoProd, '')
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
    let itSel = '';
    const obj = {
      'codFor': this.arrFornecDados.cod,
      'codLoja': this.arrFornecDados.loja,
      'codGrupo': this.grupoSelec,
    };
    this.arrMontalista = this.funcJson.buscaJsonPost('amarraFornecProduto', obj);

    this.arrMontalista.subscribe(cada => {
      cada.forEach(xy => {
        if (this.itemSelec.indexOf(xy.produto) < 0) {
          itSel = 'Sim'
        } else {
          itSel = 'Não'
        }
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
          'itSel': itSel,
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
  setItem(xaRow) {
    if (this.itemSelec === '') {
      this.itemSelec = xaRow.produto
    } else {

      if (this.itemSelec.indexOf(xaRow.produto) < 0) {
        this.itemSelec = this.itemSelec + '|' + xaRow.produto
      } else {
        if (this.itemSelec.indexOf('|' + xaRow.produto) > -1) {
          this.itemSelec = this.itemSelec.replace('|' + xaRow.produto, '')
        } else {
          this.itemSelec = this.itemSelec.replace(xaRow.produto, '')
        }
      }
    }
    if (this.itemSelec.substring(0, 1) === ' ') {
      this.itemSelec = this.itemSelec.substring(3, 101)
    }

    this.arrMontalistaTab = [];
    this.buscaMontalistas();

  }

  // tecla para retorno de tela
  voltaFornec() {
    this.router.navigate(['fornecedor']);
  }


}
