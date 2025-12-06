import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

declare var feather: any;
declare var bootstrap: any;

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css'
})
export class Pacientes implements AfterViewInit, OnDestroy {

  // --- DADOS (MOCK) ---
  todosPacientes = [
    { 
      id: 1, nome: 'Carlos Ferreira', email: 'carlos@email.com', cpf: '123.456.789-00', 
      contato: '(34) 99999-9999', ultimaConsulta: '02/05/2025', status: 'Ativo', 
      dataNascimento: '1985-05-15', idade: 40, sexo: 'Masculino', convenio: 'Unimed',
      endereco: { rua: 'Rua das Flores, 123', bairro: 'Centro', cidade: 'Uberlândia', estado: 'MG', complemento: 'Apt 101' } 
    },
    { 
      id: 2, nome: 'Ana Souza', email: 'ana.souza@email.com', cpf: '987.654.321-00', 
      contato: '(34) 98888-8888', ultimaConsulta: '30/04/2025', status: 'Ativo', 
      dataNascimento: '1990-10-20', idade: 34, sexo: 'Feminino', convenio: 'Bradesco Saúde',
      endereco: { rua: 'Av. Brasil, 500', bairro: 'Martins', cidade: 'Uberlândia', estado: 'MG', complemento: '' } 
    },
    { 
      id: 3, nome: 'João Santos', email: 'joao.santos@email.com', cpf: '111.222.333-44', 
      contato: '(11) 97777-7777', ultimaConsulta: '28/04/2025', status: 'Inativo', 
      dataNascimento: '1978-01-10', idade: 47, sexo: 'Masculino', convenio: 'SulAmérica',
      endereco: { rua: 'Rua Paraná, 88', bairro: 'Umuarama', cidade: 'Uberlândia', estado: 'MG', complemento: 'Casa' } 
    },
    { 
      id: 4, nome: 'Maria Oliveira', email: 'maria.oli@email.com', cpf: '444.555.666-77', 
      contato: '(21) 96666-6666', ultimaConsulta: '25/04/2025', status: 'Ativo', 
      dataNascimento: '1995-03-15', idade: 30, sexo: 'Feminino', convenio: 'Particular',
      endereco: { rua: 'Rua A, 10', bairro: 'Granada', cidade: 'Uberlândia', estado: 'MG', complemento: '' } 
    }
  ];

  // --- CONTROLE DE TELA ---
  pacientesFiltrados: any[] = [];
  termoBusca: string = '';
  paginaAtual: number = 1;
  itensPorPagina: number = 5;
  totalPaginas: number = 1;

  // --- VARIÁVEIS PARA MODAIS ---
  // Inicializa com estrutura completa para evitar erros no HTML
  pacienteEmEdicao: any = { 
    id: 0, 
    endereco: { rua: '', bairro: '', cidade: '', estado: '', complemento: '' } 
  }; 
  
  pacienteParaExcluir: any = null;
  modalRef: any; 

  constructor() {
    this.filtrarPacientes(); 
  }

  ngAfterViewInit() {
    this.atualizarIconesETooltips();
  }

  ngOnDestroy() {
    document.querySelectorAll('.tooltip').forEach(t => t.remove());
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  // --- MÉTODOS VISUAIS ---
  atualizarIconesETooltips() {
    if (typeof feather !== 'undefined') feather.replace();
    
    if (typeof bootstrap !== 'undefined') {
      document.querySelectorAll('.tooltip').forEach(t => t.remove());
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }

  // --- LÓGICA DE BUSCA E PAGINAÇÃO ---
  filtrarPacientes() {
    const termo = this.termoBusca.toLowerCase();
    
    let resultado = this.todosPacientes.filter(p => 
      p.nome.toLowerCase().includes(termo) || 
      p.cpf.includes(termo)
    );

    this.totalPaginas = Math.ceil(resultado.length / this.itensPorPagina);
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.pacientesFiltrados = resultado.slice(inicio, fim);

    setTimeout(() => this.atualizarIconesETooltips(), 50);
  }

  mudarPagina(direcao: number) {
    const novaPagina = this.paginaAtual + direcao;
    if (novaPagina >= 1 && novaPagina <= this.totalPaginas) {
      this.paginaAtual = novaPagina;
      this.filtrarPacientes();
    }
  }

  // --- LÓGICA DE MODAIS ---
  
  abrirModalCriar() {
    // Reseta para um objeto limpo com a estrutura correta
    this.pacienteEmEdicao = { 
        id: 0, 
        nome: '',
        status: 'Ativo',
        endereco: { rua: '', bairro: '', cidade: '', estado: '', complemento: '' } 
    }; 
    this.abrirModal('pacienteModal');
  }

  abrirModalEditar(paciente: any) {
    // Deep copy para não editar a tabela em tempo real e garantir o objeto endereco
    this.pacienteEmEdicao = { 
        ...paciente, 
        endereco: paciente.endereco ? { ...paciente.endereco } : { rua: '', bairro: '', cidade: '', estado: '', complemento: '' } 
    }; 
    this.abrirModal('pacienteModal');
  }

  abrirModalExcluir(paciente: any) {
    this.pacienteParaExcluir = paciente;
    this.abrirModal('deleteModal');
  }

  abrirModal(idModal: string) {
    // Remove tooltip que possa estar travado
    const tooltipElement = document.querySelector('.tooltip.show');
    if (tooltipElement) tooltipElement.remove();

    const el = document.getElementById(idModal);
    if (el && typeof bootstrap !== 'undefined') {
      this.modalRef = new bootstrap.Modal(el);
      this.modalRef.show();
    }
  }

  // Função para calcular idade automaticamente (Igual ao Dashboard)
  calcularIdade() {
    if (this.pacienteEmEdicao.dataNascimento) {
      const hoje = new Date();
      const nascimento = new Date(this.pacienteEmEdicao.dataNascimento);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const m = hoje.getMonth() - nascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      this.pacienteEmEdicao.idade = idade;
    }
  }

  // --- AÇÕES DE SALVAR / EXCLUIR ---

  salvarPaciente() {
    if (this.pacienteEmEdicao.id === 0) {
      // CRIAR NOVO
      this.pacienteEmEdicao.id = new Date().getTime(); 
      this.pacienteEmEdicao.ultimaConsulta = '-';
      this.todosPacientes.unshift(this.pacienteEmEdicao);
    } else {
      // EDITAR EXISTENTE
      const index = this.todosPacientes.findIndex(p => p.id === this.pacienteEmEdicao.id);
      if (index !== -1) {
        this.todosPacientes[index] = this.pacienteEmEdicao;
      }
    }

    this.modalRef.hide();
    this.filtrarPacientes(); 
    
    // Recria os ícones após a tabela atualizar
    setTimeout(() => this.atualizarIconesETooltips(), 100);
    
    alert('Paciente salvo com sucesso!');
  }

  confirmarExclusao() {
    if (this.pacienteParaExcluir) {
      this.todosPacientes = this.todosPacientes.filter(p => p.id !== this.pacienteParaExcluir.id);
      this.modalRef.hide();
      this.filtrarPacientes();
      alert('Paciente excluído.');
    }
  }
}