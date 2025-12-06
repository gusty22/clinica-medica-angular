import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var feather: any;
declare var bootstrap: any;

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css'
})
export class Funcionarios implements AfterViewInit, OnDestroy {

  // --- DADOS MOCKADOS ---
  funcionarios = [
    { 
      id: 1, 
      nome: 'Dr. Silva', 
      email: 'dr.silva@email.com', 
      cargo: 'Administrador', // Usado para filtro
      perfil: 'Administrador', // Usado no sistema
      status: 'Ativo',
      usuario: 'admin',
      isCurrentUser: true,
      crm: '', especialidade: ''
    },
    { 
      id: 2, 
      nome: 'Ana Souza', 
      email: 'ana.souza@email.com', 
      cargo: 'Recepcionista', 
      perfil: 'Atendente', 
      status: 'Ativo',
      usuario: 'ana.recep',
      isCurrentUser: false,
      crm: '', especialidade: ''
    },
    { 
      id: 3, 
      nome: 'Dra. Maria Oliveira', 
      email: 'maria.o@email.com', 
      cargo: 'Médico', 
      perfil: 'Médico', 
      status: 'Ativo',
      usuario: 'maria.med',
      isCurrentUser: false,
      crm: '56789-SP', especialidade: 'Cardiologista'
    },
    { 
      id: 4, 
      nome: 'João Técnico', 
      email: 'joao.ti@email.com', 
      cargo: 'Suporte TI', 
      perfil: 'Administrador', 
      status: 'Inativo',
      usuario: 'joao.ti',
      isCurrentUser: false,
      crm: '', especialidade: ''
    }
  ];

  // --- CONTROLE DE FILTROS E PAGINAÇÃO ---
  listaFiltrada: any[] = [];
  filtroNome: string = '';
  filtroPerfil: string = 'todos'; // Filtrar pelo Perfil de Acesso
  
  // Variáveis do Modal
  funcionarioEmEdicao: any = {};
  modalRef: any;
  funcionarioParaExcluir: any = null;

  constructor() {
    this.aplicarFiltros();
  }

  ngAfterViewInit() {
    this.atualizarIcones();
  }

  ngOnDestroy() {
    // Limpeza padrão
    document.querySelectorAll('.tooltip').forEach(t => t.remove());
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  atualizarIcones() {
    if (typeof feather !== 'undefined') feather.replace();
  }

  // --- LÓGICA DE FILTRAGEM ---
  aplicarFiltros() {
    const termo = this.filtroNome.toLowerCase();
    
    this.listaFiltrada = this.funcionarios.filter(f => {
      const matchNome = f.nome.toLowerCase().includes(termo) || f.email.toLowerCase().includes(termo);
      const matchPerfil = this.filtroPerfil === 'todos' || f.perfil === this.filtroPerfil;
      return matchNome && matchPerfil;
    });

    // Atualiza ícones após renderizar a lista
    setTimeout(() => this.atualizarIcones(), 50);
  }

  // --- LÓGICA DE MODAL (CRIAR / EDITAR) ---
  
  abrirModalCriar() {
    this.funcionarioEmEdicao = { 
      id: 0, 
      nome: '', email: '', telefone: '', 
      usuario: '', senha: '',
      cargo: '', perfil: 'Atendente', status: 'Ativo',
      crm: '', especialidade: '',
      endereco: { rua: '', numero: '', bairro: '', cidade: '', estado: '' }
    };
    this.abrirModal('funcionarioModal');
  }

  abrirModalEditar(funcionario: any) {
    // Deep copy
    this.funcionarioEmEdicao = { ...funcionario };
    if(!this.funcionarioEmEdicao.endereco) {
        this.funcionarioEmEdicao.endereco = { rua: '', numero: '', bairro: '', cidade: '', estado: '' };
    }
    this.abrirModal('funcionarioModal');
  }

  abrirModalExcluir(funcionario: any) {
    this.funcionarioParaExcluir = funcionario;
    this.abrirModal('deleteModal');
  }

  abrirModal(idModal: string) {
    const el = document.getElementById(idModal);
    if (el && typeof bootstrap !== 'undefined') {
      this.modalRef = new bootstrap.Modal(el);
      this.modalRef.show();
    }
  }

  salvarFuncionario() {
    if (this.funcionarioEmEdicao.id === 0) {
      // Criar Novo
      this.funcionarioEmEdicao.id = new Date().getTime();
      this.funcionarioEmEdicao.isCurrentUser = false;
      this.funcionarios.push(this.funcionarioEmEdicao);
    } else {
      // Editar
      const index = this.funcionarios.findIndex(f => f.id === this.funcionarioEmEdicao.id);
      if (index !== -1) {
        this.funcionarios[index] = this.funcionarioEmEdicao;
      }
    }

    this.modalRef.hide();
    this.aplicarFiltros();
    alert('Funcionário salvo com sucesso!');
  }

  confirmarExclusao() {
    if (this.funcionarioParaExcluir) {
      this.funcionarios = this.funcionarios.filter(f => f.id !== this.funcionarioParaExcluir.id);
      this.modalRef.hide();
      this.aplicarFiltros();
      alert('Funcionário excluído.');
    }
  }
}