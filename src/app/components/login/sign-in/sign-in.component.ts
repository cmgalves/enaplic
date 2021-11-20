import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fxJson } from 'app/shared/funcs/funcs';
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {
  xlAcessa: boolean = true;
  xlTroca: boolean = false;
  userName: string = '';
  userPassword: string = '';
  usuarioCodigo: string = '';
  userNameTroca: string = '';
  senhaAntiga: string = '';
  senhaNova: string = '';
  xcPerfil: string = '';
  arrUsuario: any = [];
  arrUsuarioTab: any = [];
  arrUsr: any = [];

  constructor(
    public router: Router,
    public authService: AuthService,
    private funcJson: fxJson,
  ) { }

  ngOnInit() {
    localStorage.removeItem('user');
    this.buscaUsuarios();
  }


  // Sign in with email/password
  SignIn() {
    let conta = 5;
    let xcPerfil = '';
    this.arrUsr = [];

    this.arrUsuarioTab.forEach(xy => {
      if (this.userName === xy.login && this.userPassword === xy.psw) {
        conta = 1
        this.arrUsr.push({
          'filial': xy.filial,
          'usrsis': xy.usrsis,
          'codusr': xy.codusr,
          'login': xy.login,
          'psw': xy.psw,
          'nome': xy.nome,
          'perfil': xy.perfil,
        })
      }
    });

    if (conta === 5) {
      alert('Senha ou Usuário Inválido')
    } else {
      if (conta === 1) {
        localStorage.setItem('user', JSON.stringify(this.arrUsr));
        xcPerfil = this.arrUsr[0].perfil
        if (xcPerfil === '1') {
          this.router.navigate(['dashboard']);
        } else {
          this.router.navigate(['dashboard']);
        }
      }
    }
  }

  buscaUsuarios() {
    this.arrUsuario = this.funcJson.buscaJsonPost('cadUsuarios', {});
    this.arrUsuario.subscribe(cada => {
      cada.forEach(xy => {
        this.arrUsuarioTab.push({
          'filial': xy.filial,
          'usrsis': xy.usrsis,
          'codusr': xy.codusr,
          'login': xy.login,
          'psw': xy.psw,
          'nome': xy.nome,
          'perfil': xy.perfil,
        });
      });
    });
  }
}