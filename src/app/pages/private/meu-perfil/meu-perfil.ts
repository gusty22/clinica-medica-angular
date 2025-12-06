import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var feather: any;
declare var bootstrap: any;

@Component({
  selector: 'app-meu-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meu-perfil.html',
  styleUrl: './meu-perfil.css'
})
export class MeuPerfil implements OnInit, AfterViewInit {

  // Dados Atuais (vinculados aos inputs)
  usuario = {
    nome: 'Dr. Silva',
    email: 'dr.silva@email.com',
    cpf: '123.456.789-00',
    dataNascimento: '1980-01-01',
    contato: '(34) 99999-9999',
    avatar: 'https://ui-avatars.com/api/?name=Dr+Silva&background=00A896&color=fff&size=128',
    cargo: 'Médico (Administrador)',
    endereco: {
      rua: 'Rua das Flores',
      complemento: 'Apto 101',
      bairro: 'Centro',
      cidade: 'Uberlândia',
      estado: 'MG'
    }
  };

  // Cópia de Segurança (Dados "Verdadeiros" do Banco)
  // Serve para saber se o e-mail mudou e para onde mandar o código de segurança
  usuarioOriginal: any = {};

  // Senhas
  senhas = { atual: '', nova: '', confirma: '' };
  senhaConfirmacaoCritica: string = ''; // Usado no modal de confirmar email

  // Controles Visuais
  showSenhaAtual = false;
  showSenhaNova = false;
  showSenhaConfirma = false;

  // Segurança 2FA
  etapaSeguranca: number = 0;
  codigoVerificacao: string = '';
  codigoCorretoMock: string = '123456';

  modalConfirmacaoRef: any;

  constructor() {}

  ngOnInit() {
    // Cria uma cópia profunda dos dados originais ao carregar
    this.usuarioOriginal = JSON.parse(JSON.stringify(this.usuario));
  }

  ngAfterViewInit() {
    this.atualizarIcones();
  }

  atualizarIcones() {
    if (typeof feather !== 'undefined') feather.replace();
  }

  // --- LÓGICA DE DADOS PESSOAIS ---

  tentarSalvarPerfil() {
    // Verifica se o e-mail foi alterado
    if (this.usuario.email !== this.usuarioOriginal.email) {
      // Se mudou o e-mail, EXIGE confirmação de senha
      this.abrirModalConfirmacao();
    } else {
      // Se não mudou e-mail, salva direto
      this.salvarPerfilReal();
    }
  }

  abrirModalConfirmacao() {
    this.senhaConfirmacaoCritica = '';
    const el = document.getElementById('confirmacaoCriticaModal');
    if (el && typeof bootstrap !== 'undefined') {
      this.modalConfirmacaoRef = new bootstrap.Modal(el);
      this.modalConfirmacaoRef.show();
    }
  }

  confirmarAlteracaoCritica() {
    // Simulação: A senha correta seria "123"
    if (!this.senhaConfirmacaoCritica) {
      alert('Digite sua senha para confirmar.');
      return;
    }
    
    // Aqui validaria no backend se a senha está correta
    console.log('Validando senha para troca de e-mail...');
    
    this.modalConfirmacaoRef.hide();
    this.salvarPerfilReal();
    
    // Atualiza o "Original" para o novo e-mail
    this.usuarioOriginal.email = this.usuario.email;
  }

  salvarPerfilReal() {
    // Lógica final de salvamento
    alert('Dados atualizados com sucesso!');
  }

  salvarEndereco() {
    alert('Endereço atualizado com sucesso!');
  }

  // --- LÓGICA DE SEGURANÇA (SENHA) ---

  solicitarCodigo() {
    // SEGURANÇA: Manda o código para o email ORIGINAL, não o digitado no input
    const emailDestino = this.usuarioOriginal.email;
    
    this.etapaSeguranca = 1;
    alert(`Código de segurança enviado para o e-mail cadastrado: ${emailDestino}\n(Não enviamos para e-mails não salvos/verificados).\n\nCódigo: 123456`);
    setTimeout(() => this.atualizarIcones(), 50);
  }

  validarCodigo() {
    if (this.codigoVerificacao === this.codigoCorretoMock) {
      this.etapaSeguranca = 2;
      alert('Identidade confirmada! Pode alterar sua senha.');
      setTimeout(() => this.atualizarIcones(), 50);
    } else {
      alert('Código incorreto.');
    }
  }

  salvarSenha() {
    if (this.senhas.nova !== this.senhas.confirma) {
      alert('A nova senha e a confirmação não conferem.');
      return;
    }
    if (!this.senhas.atual) {
      alert('Informe a senha atual.');
      return;
    }
    
    alert('Senha alterada com sucesso!');
    this.senhas = { atual: '', nova: '', confirma: '' };
    this.etapaSeguranca = 0;
    this.codigoVerificacao = '';
  }

  toggleSenha(campo: string) {
    if (campo === 'atual') this.showSenhaAtual = !this.showSenhaAtual;
    if (campo === 'nova') this.showSenhaNova = !this.showSenhaNova;
    if (campo === 'confirma') this.showSenhaConfirma = !this.showSenhaConfirma;
    setTimeout(() => this.atualizarIcones(), 50);
  }
}