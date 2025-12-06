import { Component, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core'; // Removi DateSelectArg que estava dando conflito
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

declare var feather: any;
declare var bootstrap: any;

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css'
})
export class Agenda implements AfterViewInit, OnDestroy {

  // --- DADOS (MOCKS) ---
  medicos = [
    { nome: 'Dr. Silva', especialidade: 'Clínico Geral' },
    { nome: 'Dra. Maria Oliveira', especialidade: 'Cardiologista' },
    { nome: 'Dr. Roberto Almeida', especialidade: 'Ortopedista' },
    { nome: 'Dr. Ricardo Borges', especialidade: 'Cardiologista' },
    { nome: 'Dra. Roberta Nunes', especialidade: 'Clínico Geral' }
  ];

  pacientes = [
    { nome: 'Carlos Ferreira', cpf: '123.456.789-00', contato: '(34) 99999-9999' },
    { nome: 'Ana Souza', cpf: '987.654.321-00', contato: '(34) 98888-8888' },
    { nome: 'João Santos', cpf: '111.222.333-44', contato: '(11) 97777-7777' }
  ];

  // --- VARIÁVEIS DE CONTROLE ---
  modalRef: any;
  medicoFiltro: string = 'todos';
  
  eventoEmEdicao: any = {
    id: '',
    paciente: '',
    contato: '',
    especialidade: 'todas',
    medico: '',
    data: '',
    hora: '',
    tipo: 'Primeira vez',
    status: 'Ativa',
    sintomas: '',
    observacoes: ''
  };

  listaEspecialidades: string[] = [];
  medicosFiltradosNoForm: any[] = [];
  sugestoesPacientes: any[] = [];

  // --- CONFIGURAÇÃO DO FULLCALENDAR ---
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: ptBrLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia', list: 'Lista'
    },
    slotMinTime: '07:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: false,
    contentHeight: 'auto',
    nowIndicator: true,
    selectable: true,
    editable: true,
    
    businessHours: [
      { daysOfWeek: [1, 2, 3, 4, 5], startTime: '08:00', endTime: '12:00' },
      { daysOfWeek: [1, 2, 3, 4, 5], startTime: '14:00', endTime: '18:00' }
    ],

    events: [
      {
        id: 'evt1', title: 'João S. - Retorno',
        start: '2025-11-05T08:30:00', end: '2025-11-05T09:00:00',
        color: 'var(--bs-primary)',
        extendedProps: { paciente: 'João Santos', medico: 'Dra. Maria Oliveira', status: 'Ativa', tipo: 'Retorno', especialidade: 'Cardiologista' }
      },
      {
        id: 'evt2', title: 'Maria O. - Primeira',
        start: '2025-11-06T10:15:00', end: '2025-11-06T11:00:00',
        color: 'var(--bs-warning)',
        extendedProps: { paciente: 'Maria Oliveira', medico: 'Dr. Silva', status: 'Ativa', tipo: 'Primeira vez', especialidade: 'Clínico Geral' }
      }
    ],

    // Handlers
    dateClick: (arg) => this.handleDateClick(arg), // O erro estava aqui antes
    eventClick: (arg) => this.handleEventClick(arg),
    eventClassNames: (arg) => {
      if (arg.event.extendedProps['status'] === 'Cancelada') {
        return ['fc-event-canceled'];
      }
      return [];
    }
  };

  @ViewChild('calendar') calendarComponent: any;

  constructor() {
    this.listaEspecialidades = [...new Set(this.medicos.map(m => m.especialidade))];
  }

  ngAfterViewInit() {
    if (typeof feather !== 'undefined') feather.replace();
  }

  ngOnDestroy() {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(b => b.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  // --- AÇÕES DO CALENDÁRIO ---

  // CORREÇÃO: Usando 'any' para aceitar tanto o evento do calendário quanto 'null' do botão
  handleDateClick(arg: any) {
    this.limparFormulario();
    
    if (arg && arg.dateStr) {
      // Veio do Calendário (clique na grade)
      // dateClick usa 'dateStr', não 'startStr'
      this.eventoEmEdicao.data = arg.dateStr.split('T')[0];
      
      if (arg.dateStr.includes('T')) {
        this.eventoEmEdicao.hora = arg.dateStr.split('T')[1].substring(0, 5);
      } else {
        this.eventoEmEdicao.hora = '08:00'; // Default se clicar no dia inteiro
      }
    } else {
      // Veio do Botão "Nova Consulta" (sem data definida)
      const agora = new Date();
      // Ajuste de fuso horário simples para pegar data local
      const offset = agora.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(agora.getTime() - offset)).toISOString().slice(0, -1);
      
      this.eventoEmEdicao.data = localISOTime.split('T')[0];
      this.eventoEmEdicao.hora = '08:00';
    }

    this.abrirModal('Nova Consulta');
  }

  handleEventClick(arg: EventClickArg) {
    const evt = arg.event;
    const props = evt.extendedProps;

    this.eventoEmEdicao = {
      id: evt.id,
      paciente: props['paciente'],
      contato: props['contato'] || '',
      medico: props['medico'],
      especialidade: props['especialidade'],
      tipo: props['tipo'],
      status: props['status'],
      sintomas: props['sintomas'] || '',
      observacoes: props['observacoes'] || '',
      data: evt.start ? evt.start.toISOString().split('T')[0] : '',
      hora: evt.start ? evt.start.toTimeString().substring(0, 5) : ''
    };

    this.filtrarMedicosPorEspecialidade();
    this.abrirModal('Editar Consulta');
  }

  // --- LÓGICA DO MODAL ---

  abrirModal(titulo: string) {
    const modalEl = document.getElementById('consultaModal');
    const modalTitle = document.getElementById('consultaModalLabel');
    if (modalTitle) modalTitle.innerText = titulo;

    if (modalEl && typeof bootstrap !== 'undefined') {
      this.modalRef = new bootstrap.Modal(modalEl);
      this.modalRef.show();
    }
  }

  limparFormulario() {
    this.eventoEmEdicao = {
      id: '',
      paciente: '',
      contato: '',
      especialidade: 'todas',
      medico: '',
      data: '',
      hora: '',
      tipo: 'Primeira vez',
      status: 'Ativa',
      sintomas: '',
      observacoes: ''
    };
    this.medicosFiltradosNoForm = [];
  }

  salvarConsulta() {
    const calendarApi = this.calendarComponent.getApi();
    
    const startIso = `${this.eventoEmEdicao.data}T${this.eventoEmEdicao.hora}:00`;
    const endDate = new Date(new Date(startIso).getTime() + 30 * 60000);
    const endIso = endDate.toISOString();

    let cor = 'var(--bs-primary)';
    if (this.eventoEmEdicao.status === 'Cancelada') cor = 'var(--bs-danger)';
    else if (this.eventoEmEdicao.status === 'Concluída') cor = 'var(--bs-secondary)';
    else if (this.eventoEmEdicao.tipo === 'Primeira vez') cor = 'var(--bs-warning)';

    const eventData = {
      title: `${this.eventoEmEdicao.paciente} - ${this.eventoEmEdicao.medico}`,
      start: startIso,
      end: endIso,
      color: cor,
      extendedProps: { ...this.eventoEmEdicao }
    };

    if (this.eventoEmEdicao.id) {
      const eventoExistente = calendarApi.getEventById(this.eventoEmEdicao.id);
      if (eventoExistente) {
        eventoExistente.setProp('title', eventData.title);
        eventoExistente.setProp('color', eventData.color);
        eventoExistente.setStart(eventData.start);
        eventoExistente.setEnd(eventData.end);
        eventoExistente.setExtendedProps(eventData.extendedProps);
      }
    } else {
      calendarApi.addEvent({
        id: String(new Date().getTime()),
        ...eventData
      });
    }

    this.modalRef.hide();
    alert('Consulta salva!');
  }

  excluirConsulta() {
    if (!this.eventoEmEdicao.id) return;
    
    if (confirm('Tem certeza que deseja excluir?')) {
      const calendarApi = this.calendarComponent.getApi();
      const evento = calendarApi.getEventById(this.eventoEmEdicao.id);
      if (evento) evento.remove();
      
      this.modalRef.hide();
    }
  }

  // --- LÓGICA DE FILTROS E AUTOCOMPLETE ---

  filtrarMedicosPorEspecialidade() {
    const esp = this.eventoEmEdicao.especialidade;
    if (esp === 'todas') {
      this.medicosFiltradosNoForm = this.medicos;
    } else {
      this.medicosFiltradosNoForm = this.medicos.filter(m => m.especialidade === esp);
    }
    const medicoValido = this.medicosFiltradosNoForm.find(m => m.nome === this.eventoEmEdicao.medico);
    if (!medicoValido) {
      this.eventoEmEdicao.medico = '';
    }
  }

  filtrarPacientes(event: any) {
    const valor = event.target.value.toLowerCase();
    if (valor.length === 0) {
      this.sugestoesPacientes = [];
      return;
    }
    this.sugestoesPacientes = this.pacientes.filter(p => 
      p.nome.toLowerCase().includes(valor) || p.cpf.includes(valor)
    );
  }

  selecionarPaciente(p: any) {
    this.eventoEmEdicao.paciente = p.nome;
    this.eventoEmEdicao.contato = p.contato;
    this.sugestoesPacientes = []; 
  }

  aplicarFiltroMedico() {
    const calendarApi = this.calendarComponent.getApi();
    const todosEventos = calendarApi.getEvents();

    todosEventos.forEach((evento: any) => {
      if (this.medicoFiltro === 'todos') {
        evento.setProp('display', 'auto');
      } else {
        if (evento.extendedProps['medico'] !== this.medicoFiltro) {
          evento.setProp('display', 'none');
        } else {
          evento.setProp('display', 'auto');
        }
      }
    });
  }
}