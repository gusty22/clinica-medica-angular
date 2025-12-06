import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicaService } from '../../../../core/services/clinica.service';

declare var feather: any;
declare var bootstrap: any;

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css'
})
export class Configuracoes implements OnInit, AfterViewInit {

  abaAtual: string = 'clinica';
  clinica: any = {};

  usuarios = [
    { nome: 'Dr. Silva (você)', email: 'dr.silva@email.com', perfil: 'Administrador', status: 'Ativo', isCurrentUser: true },
    { nome: 'Ana (Atendente)', email: 'ana@email.com', perfil: 'Atendente', status: 'Ativo', isCurrentUser: false },
    { nome: 'Dra. Maria', email: 'dra.maria@email.com', perfil: 'Médico', status: 'Ativo', isCurrentUser: false }
  ];

  usuarioEmEdicao: any = {};
  modalUsuarioRef: any;
  perfis = ['Administrador', 'Médico', 'Atendente'];

  // --- MATRIZ DE PERMISSÕES (RBAC) ---
  permissoes = [
    {
      modulo: 'Dashboard',
      acoes: [
        { nome: 'Acesso ao Painel', admin: true, medico: true, atendente: true }
      ]
    },
    {
      modulo: 'Agenda / Consultas',
      acoes: [
        { nome: 'Visualizar Todas as Consultas', admin: true, medico: false, atendente: true },
        { nome: 'Visualizar Apenas Próprias', admin: true, medico: true, atendente: true },
        { nome: 'Cadastrar/Editar Consultas', admin: true, medico: false, atendente: true },
        { nome: 'Excluir Consultas', admin: true, medico: false, atendente: false } // Atendente não vê botão excluir
      ]
    },
    {
      modulo: 'Pacientes',
      acoes: [
        { nome: 'Listar/Buscar', admin: true, medico: true, atendente: true },
        { nome: 'Cadastrar Novo', admin: true, medico: true, atendente: true },
        { nome: 'Editar Dados', admin: true, medico: true, atendente: true },
        { nome: 'Excluir Paciente', admin: true, medico: false, atendente: false } // Ninguém exclui além do Admin
      ]
    },
    {
      modulo: 'Prontuários',
      acoes: [
        { nome: 'Visualizar Prontuário', admin: true, medico: true, atendente: false }, // Atendente não vê dados médicos
        { nome: 'Preencher/Editar Prontuário', admin: true, medico: true, atendente: false },
        { nome: 'Excluir Histórico', admin: true, medico: false, atendente: false }
      ]
    },
    {
      modulo: 'Administrativo (Funcionários)',
      acoes: [
        { nome: 'Acesso ao Módulo', admin: true, medico: false, atendente: false },
        { nome: 'Cadastrar Funcionário', admin: true, medico: false, atendente: false },
        { nome: 'Excluir Funcionário', admin: true, medico: false, atendente: false }
      ]
    },
    {
      modulo: 'Administrativo (Convênios)',
      acoes: [
        { nome: 'Acesso ao Módulo', admin: true, medico: false, atendente: true }, // Atendente pode precisar consultar
        { nome: 'Gerenciar Convênios', admin: true, medico: false, atendente: false }
      ]
    },
    {
      modulo: 'Configurações do Sistema',
      acoes: [
        { nome: 'Acesso Total', admin: true, medico: false, atendente: false }
      ]
    }
  ];

  constructor(private clinicaService: ClinicaService) {}

  ngOnInit() {
    this.clinicaService.dadosClinica$.subscribe(dados => {
      this.clinica = { ...dados };
    });
  }

  ngAfterViewInit() {
    this.atualizarIcones();
  }

  atualizarIcones() {
    if (typeof feather !== 'undefined') feather.replace();
  }

  setAba(aba: string) {
    this.abaAtual = aba;
    setTimeout(() => this.atualizarIcones(), 50);
  }

  // --- MÉTODOS DE DADOS DA CLÍNICA ---
  triggerFileInput() { document.getElementById('logoInput')?.click(); }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => { this.clinica.logo = e.target.result; };
      reader.readAsDataURL(file);
    }
  }

  salvarDadosClinica() {
    this.clinicaService.atualizarDados(this.clinica);
    alert('Dados da clínica atualizados e refletidos no cabeçalho!');
  }

  // --- MÉTODOS DE USUÁRIO ---
  abrirModalUsuario(usuario: any = null) {
    if (usuario) {
      this.usuarioEmEdicao = { ...usuario };
    } else {
      this.usuarioEmEdicao = { 
        nome: '', email: '', telefone: '', cargo: '', perfil: 'Atendente', status: 'Ativo',
        senha: Math.random().toString(36).slice(-8), observacoes: ''
      };
    }
    const el = document.getElementById('usuarioModal');
    if (el && typeof bootstrap !== 'undefined') {
      this.modalUsuarioRef = new bootstrap.Modal(el);
      this.modalUsuarioRef.show();
    }
  }

  salvarUsuario() {
    if (!this.usuarioEmEdicao.id) {
      this.usuarios.push({ ...this.usuarioEmEdicao, isCurrentUser: false });
    }
    if (this.modalUsuarioRef) this.modalUsuarioRef.hide();
    alert(`Usuário ${this.usuarioEmEdicao.nome} salvo com sucesso!`);
  }

  excluirUsuario(usuario: any) {
    if (confirm(`Remover ${usuario.nome}?`)) {
      this.usuarios = this.usuarios.filter(u => u !== usuario);
    }
  }

  salvarPermissoes() {
    // No futuro, isso vai para o backend para persistir as regras
    console.log('Regras de RBAC salvas:', this.permissoes);
    alert('Permissões de acesso atualizadas! As telas dos usuários serão ajustadas no próximo login.');
  }
}