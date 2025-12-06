import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timer, Subscription, Subject } from 'rxjs';
import { finalize, debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';

declare var feather: any;
declare var bootstrap: any;

@Component({
  selector: 'app-prontuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './prontuarios.html',
  styleUrl: './prontuarios.css'
})
export class Prontuarios implements OnInit, AfterViewInit, OnDestroy {

  // Controle de Busca Reativo
  searchControl = new FormControl<string>('', { nonNullable: true });
  
  // Paginação
  readonly PAGE_SIZE = 10;
  currentPage = 1;
  totalItems = 0;
  totalPages = 0;

  // Estados da Interface
  isLoading = false;
  errorMessage = '';
  
  // Dados da Tabela
  pacientesListados: any[] = [];
  
  // Gerenciamento de Memória
  private destroy$ = new Subject<void>();
  private buscaSubscription: Subscription | null = null;

  // --- MOCK DATABASE (Simulando Backend) ---
  private mockDatabase = [
    { id: 1, nome: 'Carlos Ferreira', cpf: '123.456.789-00', idade: 40, sexo: 'M', convenio: 'Unimed', ultimaVisita: '02/05/2025', alertas: ['Hipertensão'] },
    { id: 2, nome: 'Ana Souza', cpf: '987.654.321-00', idade: 34, sexo: 'F', convenio: 'Bradesco', ultimaVisita: '30/04/2025', alertas: [] },
    { id: 3, nome: 'João Santos', cpf: '111.222.333-44', idade: 47, sexo: 'M', convenio: 'SulAmérica', ultimaVisita: '28/04/2025', alertas: ['Diabetes'] },
    { id: 4, nome: 'Maria Oliveira', cpf: '444.555.666-77', idade: 30, sexo: 'F', convenio: 'Particular', ultimaVisita: '25/04/2025', alertas: [] },
    { id: 5, nome: 'Carla Dias', cpf: '555.666.777-88', idade: 28, sexo: 'F', convenio: 'Unimed', ultimaVisita: '10/04/2025', alertas: ['Alergia a Penicilina'] },
    { id: 6, nome: 'José Silva', cpf: '999.888.777-66', idade: 62, sexo: 'M', convenio: 'Particular', ultimaVisita: '05/04/2025', alertas: ['Cardíaco'] },
    { id: 7, nome: 'Mariana Costa', cpf: '111.333.555-77', idade: 22, sexo: 'F', convenio: 'Bradesco', ultimaVisita: '01/05/2025', alertas: [] },
    { id: 8, nome: 'Pedro Rocha', cpf: '222.444.666-88', idade: 35, sexo: 'M', convenio: 'Unimed', ultimaVisita: '20/04/2025', alertas: [] },
    { id: 9, nome: 'Antonio Carlos', cpf: '333.555.777-99', idade: 55, sexo: 'M', convenio: 'SulAmérica', ultimaVisita: '15/03/2025', alertas: ['Asma'] },
    { id: 10, nome: 'Beatriz Lima', cpf: '444.555.888-11', idade: 29, sexo: 'F', convenio: 'Unimed', ultimaVisita: '12/02/2025', alertas: [] },
    { id: 11, nome: 'Fernando Gomes', cpf: '555.666.999-22', idade: 41, sexo: 'M', convenio: 'Bradesco', ultimaVisita: '10/01/2025', alertas: [] },
    { id: 12, nome: 'Luciana Martins', cpf: '666.777.000-33', idade: 38, sexo: 'F', convenio: 'Particular', ultimaVisita: '05/05/2025', alertas: ['Gestante'] }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // 1. Configura a busca automática (digitação)
    this.setupAutoSearch();
    
    // 2. FORÇA O CARREGAMENTO INICIAL (Lista completa)
    this.buscarDados(); 
  }

  ngAfterViewInit() {
    this.atualizarIcones();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.buscaSubscription) {
      this.buscaSubscription.unsubscribe();
    }
  }

  atualizarIcones() {
    if (typeof feather !== 'undefined') {
      // Timeout para garantir que o Angular terminou de renderizar o HTML
      setTimeout(() => feather.replace(), 50);
    }
  }

  // --- CONFIGURAÇÃO DA BUSCA AUTOMÁTICA ---
  private setupAutoSearch() {
    this.searchControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      map(term => term.trim()),
      // REGRA: Só busca automático se tiver 5+ caracteres OU se apagou tudo (reset)
      filter(term => term.length >= 5 || term.length === 0),
      debounceTime(500), // Espera 500ms para não sobrecarregar
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.buscarDados();
    });
  }

  // --- AÇÕES MANUAIS (Sobrescrevem a regra dos 5 caracteres) ---
  
  // Chamado pelo ENTER ou CLIQUE NA LUPA
  filtrarManual() {
    this.currentPage = 1;
    this.buscarDados(); // Busca imediatamente, independente do tamanho
  }

  limparBusca() {
    this.searchControl.setValue(''); 
    // O pipeline automático vai pegar o valor vazio e resetar a lista
  }

  // --- PAGINAÇÃO ---
  proximaPagina() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.buscarDados();
    }
  }

  paginaAnterior() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.buscarDados();
    }
  }

  // --- CORE DA BUSCA (SIMULAÇÃO BACKEND) ---
  private buscarDados() {
    this.isLoading = true;

    // Cancela requisição anterior se houver (evita conflito de busca auto vs manual)
    if (this.buscaSubscription) {
      this.buscaSubscription.unsubscribe();
    }

    // Simula delay de rede
    this.buscaSubscription = timer(300).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges(); // Força atualização da view
        this.atualizarIcones();   // Recria ícones
      })
    ).subscribe(() => {
      let filtered = this.mockDatabase;
      const term = this.searchControl.value.trim();

      // Filtra se houver termo (Normaliza texto para remover acentos e case)
      if (term) {
        const termNorm = this.normalizarTexto(term);
        filtered = this.mockDatabase.filter(p => {
          const nomeNorm = this.normalizarTexto(p.nome);
          const cpfLimpo = p.cpf.replace(/\D/g, '');
          return nomeNorm.includes(termNorm) || cpfLimpo.includes(termNorm);
        });
      }

      // Calcula Paginação
      this.totalItems = filtered.length;
      this.totalPages = Math.ceil(this.totalItems / this.PAGE_SIZE);

      const startIndex = (this.currentPage - 1) * this.PAGE_SIZE;
      const endIndex = startIndex + this.PAGE_SIZE;
      
      this.pacientesListados = filtered.slice(startIndex, endIndex);
    });
  }

  // Helper para remover acentos e deixar minúsculo (José -> jose)
  private normalizarTexto(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
}