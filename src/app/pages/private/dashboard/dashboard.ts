import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Declaração de variáveis globais das bibliotecas JS
declare var feather: any;
declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit, OnDestroy {
  
  // --- DADOS DO BANCO (SIMULADO) ---
  pacientesDB: any[] = [
    { 
      id: 1, 
      nome: 'Carlos Ferreira', 
      dataNascimento: '1985-05-15', 
      idade: 40, 
      sexo: 'Masculino', 
      cpf: '123.456.789-00', 
      contato: '(34) 99999-9999', 
      email: 'carlos@email.com',
      endereco: { rua: 'Rua das Flores, 123', complemento: 'Apt 101', bairro: 'Centro', cidade: 'Uberlândia', estado: 'MG' },
      convenio: 'Unimed',
      ultimaConsulta: '02/05/2025' 
    },
    { 
      id: 2, 
      nome: 'Ana Souza', 
      dataNascimento: '1990-10-20', 
      idade: 34, 
      sexo: 'Feminino', 
      cpf: '987.654.321-00', 
      contato: '(34) 98888-8888', 
      email: 'ana.souza@email.com',
      endereco: { rua: 'Av. Brasil, 500', complemento: '', bairro: 'Martins', cidade: 'Uberlândia', estado: 'MG' },
      convenio: 'Bradesco Saúde',
      ultimaConsulta: '30/04/2025' 
    },
    { 
      id: 3, 
      nome: 'João Santos', 
      dataNascimento: '1978-01-10', 
      idade: 47, 
      sexo: 'Masculino', 
      cpf: '111.222.333-44', 
      contato: '(11) 97777-7777', 
      email: 'joao.santos@email.com',
      endereco: { rua: 'Rua Paraná, 88', complemento: 'Casa', bairro: 'Umuarama', cidade: 'Uberlândia', estado: 'MG' },
      convenio: 'SulAmérica Saúde',
      ultimaConsulta: '28/04/2025' 
    },
    { 
      id: 4, 
      nome: 'Maria Oliveira', 
      dataNascimento: '1995-03-15', 
      idade: 30, 
      sexo: 'Feminino', 
      cpf: '444.555.666-77', 
      contato: '(21) 96666-6666', 
      email: 'maria.oli@email.com',
      endereco: { rua: 'Rua A, 10', complemento: '', bairro: 'Granada', cidade: 'Uberlândia', estado: 'MG' },
      convenio: 'Particular',
      ultimaConsulta: '25/04/2025' 
    }
  ];

  medicosDB = [
    { id: 1, nome: 'Dr. Silva', especialidade: 'Clínico Geral' },
    { id: 2, nome: 'Dra. Maria Oliveira', especialidade: 'Cardiologista' },
    { id: 3, nome: 'Dr. Roberto Almeida', especialidade: 'Ortopedista' },
    { id: 4, nome: 'Dr. Ricardo Borges', especialidade: 'Cardiologista' },
  ];

  // --- VARIÁVEIS ---
  pacienteBusca: string = '';
  sugestoesPacientes: any[] = [];
  pacienteSelecionado: any = null;
  listaEspecialidades: string[] = [];
  especialidadeSelecionada: string = 'todas';
  medicosFiltrados: any[] = [];
  medicoSelecionado: string = '';
  novaConsulta = { data: '', hora: '', tipo: 'Primeira vez', sintomas: '' };

  pacienteEmEdicao: any = { 
    id: 0, nome: '', dataNascimento: '', idade: 0, sexo: '', cpf: '', contato: '', email: '',
    endereco: { rua: '', complemento: '', bairro: '', cidade: '', estado: '' }, convenio: ''
  };
  
  modalEdicaoRef: any; 

  constructor() {
    this.listaEspecialidades = [...new Set(this.medicosDB.map(m => m.especialidade))];
    this.medicosFiltrados = this.medicosDB;
  }

  ngAfterViewInit() {
    this.atualizarIconesETooltips();
  }

  // A MÁGICA ACONTECE AQUI: Quando sair da página, limpa tudo!
  ngOnDestroy() {
    // 1. Remove qualquer modal backdrop que tenha travado
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());

    // 2. Remove classes do body que travam o scroll
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // 3. Remove TOOLTIPS FANTASMAS
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(t => t.remove());
  }

  atualizarIconesETooltips() {
    if (typeof feather !== 'undefined') feather.replace();
    
    if (typeof bootstrap !== 'undefined') {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        const instance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (instance) instance.dispose(); 
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }

  // --- MÉTODOS LÓGICOS ---
  filtrarPacientes() {
    const valor = this.pacienteBusca.toLowerCase();
    if (valor.length === 0) {
      this.sugestoesPacientes = [];
      return;
    }
    this.sugestoesPacientes = this.pacientesDB.filter(p => 
      p.nome.toLowerCase().includes(valor) || p.cpf.includes(valor)
    );
  }

  selecionarPaciente(paciente: any) {
    this.pacienteBusca = paciente.nome;
    this.pacienteSelecionado = paciente;
    this.sugestoesPacientes = [];
  }

  filtrarMedicos() {
    if (this.especialidadeSelecionada === 'todas') {
      this.medicosFiltrados = this.medicosDB;
    } else {
      this.medicosFiltrados = this.medicosDB.filter(m => m.especialidade === this.especialidadeSelecionada);
    }
    this.medicoSelecionado = '';
  }

  salvarConsulta() {
    alert('Consulta Salva com Sucesso!');
  }
  
  abrirModalEditar(paciente: any) {
    this.pacienteEmEdicao = { 
      ...paciente,
      endereco: { ...paciente.endereco }
    };

    // Remove tooltip do botão antes de abrir o modal
    const tooltipElement = document.querySelector('.tooltip.show');
    if (tooltipElement) tooltipElement.remove();

    const modalEl = document.getElementById('editarPacienteModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      this.modalEdicaoRef = new bootstrap.Modal(modalEl);
      this.modalEdicaoRef.show();
    }
  }

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

  salvarEdicao() {
    const index = this.pacientesDB.findIndex(p => p.id === this.pacienteEmEdicao.id);
    if (index !== -1) {
      this.pacientesDB[index] = this.pacienteEmEdicao;
      
      if (this.modalEdicaoRef) {
        this.modalEdicaoRef.hide();
      }
      
      // Pequeno delay para recriar ícones após o Angular atualizar a DOM
      setTimeout(() => {
        this.atualizarIconesETooltips();
      }, 100);

      alert('Dados do paciente atualizados com sucesso!');
    }
  }
}