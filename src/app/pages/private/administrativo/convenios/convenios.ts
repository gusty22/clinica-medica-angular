import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var feather: any;
declare var bootstrap: any;

@Component({
  selector: 'app-convenios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './convenios.html',
  styleUrl: './convenios.css'
})
export class Convenios implements AfterViewInit, OnDestroy {

  // --- DADOS (MOCK) ---
  convenios = [
    { id: 1, nome: 'SulAmérica Saúde', codigo: '1001', status: 'Ativo', contato: 'contato@sulamerica.com.br' },
    { id: 2, nome: 'Bradesco Saúde', codigo: '1002', status: 'Ativo', contato: 'convenios@bradesco.com.br' },
    { id: 3, nome: 'Unimed', codigo: '1003', status: 'Inativo', contato: '(34) 3232-0000' }
  ];

  // --- CONTROLES DE TELA ---
  listaFiltrada: any[] = [];
  filtroBusca: string = '';
  filtroStatus: string = 'todos';

  // --- MODAL ---
  convenioEmEdicao: any = {};
  modalRef: any;
  convenioParaExcluir: any = null;

  constructor() {
    this.aplicarFiltros();
  }

  ngAfterViewInit() {
    this.atualizarIcones();
  }

  ngOnDestroy() {
    document.querySelectorAll('.tooltip').forEach(t => t.remove());
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  atualizarIcones() {
    if (typeof feather !== 'undefined') feather.replace();
  }

  // --- FILTROS ---
  aplicarFiltros() {
    const termo = this.filtroBusca.toLowerCase();
    
    this.listaFiltrada = this.convenios.filter(c => {
      const matchTexto = c.nome.toLowerCase().includes(termo) || c.codigo.includes(termo);
      const matchStatus = this.filtroStatus === 'todos' || c.status === this.filtroStatus;
      return matchTexto && matchStatus;
    });

    setTimeout(() => this.atualizarIcones(), 50);
  }

  // --- MODAIS ---
  
  abrirModalCriar() {
    this.convenioEmEdicao = { id: 0, nome: '', codigo: '', status: 'Ativo', contato: '' };
    this.abrirModal('convenioModal');
  }

  abrirModalEditar(convenio: any) {
    this.convenioEmEdicao = { ...convenio };
    this.abrirModal('convenioModal');
  }

  abrirModalExcluir(convenio: any) {
    this.convenioParaExcluir = convenio;
    this.abrirModal('deleteModal');
  }

  abrirModal(idModal: string) {
    const el = document.getElementById(idModal);
    if (el && typeof bootstrap !== 'undefined') {
      this.modalRef = new bootstrap.Modal(el);
      this.modalRef.show();
    }
  }

  // --- AÇÕES ---

  salvarConvenio() {
    if (this.convenioEmEdicao.id === 0) {
      // Novo
      this.convenioEmEdicao.id = new Date().getTime();
      this.convenios.push(this.convenioEmEdicao);
    } else {
      // Editar
      const index = this.convenios.findIndex(c => c.id === this.convenioEmEdicao.id);
      if (index !== -1) {
        this.convenios[index] = this.convenioEmEdicao;
      }
    }

    this.modalRef.hide();
    this.aplicarFiltros();
    alert('Convênio salvo com sucesso!');
  }

  confirmarExclusao() {
    if (this.convenioParaExcluir) {
      this.convenios = this.convenios.filter(c => c.id !== this.convenioParaExcluir.id);
      this.modalRef.hide();
      this.aplicarFiltros();
      alert('Convênio excluído.');
    }
  }
}