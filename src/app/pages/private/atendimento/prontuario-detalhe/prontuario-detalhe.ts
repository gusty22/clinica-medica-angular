import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

declare var feather: any;

@Component({
  selector: 'app-prontuario-detalhe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prontuario-detalhe.html',
  styleUrl: './prontuario-detalhe.css'
})
export class ProntuarioDetalhe implements OnInit, AfterViewInit {

  pacienteId: string | null = null;
  
  // DADOS DO PACIENTE (CABEÇALHO)
  paciente = {
    id: 1,
    nome: 'Carlos Ferreira',
    cpf: '123.456.789-00',
    nascimento: '15/05/1985',
    idade: 40,
    sexo: 'Masculino',
    convenio: 'Unimed',
    contato: '(34) 99999-9999',
    alergias: ['Dipirona', 'Sulfa']
  };

  // TIMELINE (Lista de Sub-prontuários na esquerda)
  timeline = [
    { 
      id: 101, 
      data: '02/05/2025', 
      tipo: 'Consulta', 
      titulo: 'Retorno Cardiologia', 
      profissional: 'Dr. Silva', 
      status: 'Finalizado' 
    },
    { 
      id: 102, 
      data: '20/04/2025', 
      tipo: 'Exame', 
      titulo: 'Ecocardiograma', 
      profissional: 'Lab. Imagem', 
      status: 'Finalizado' 
    },
    { 
      id: 103, 
      data: '15/03/2025', 
      tipo: 'Consulta', 
      titulo: 'Primeira Consulta', 
      profissional: 'Dr. Silva', 
      status: 'Finalizado' 
    }
  ];

  // BANCO DE DADOS DE TEXTOS (Para cada ID da timeline)
  private detalhesMock: any = {
    101: {
      anamnese: 'Paciente retorna após 30 dias de uso de Losartana. Relata melhora significativa das dores de cabeça. Nega tonturas. Pressão arterial monitorada em casa com média de 120/80.',
      exameFisico: 'BEG (Bom Estado Geral), Corado, Hidratado. \nPA: 120/80 mmHg (Sentado). \nFC: 72 bpm. \nAuscuta Cardíaca: Ritmo regular, sem sopros.',
      diagnostico: 'I10 - Hipertensão essencial (primária) - Controlada',
      conduta: '1. Manter medicação atual (Losartana 50mg).\n2. Manter dieta hipossódica.\n3. Retorno em 6 meses.'
    },
    102: {
      anamnese: 'Paciente realizou exame de imagem solicitado na consulta anterior.',
      exameFisico: 'N/A (Exame Complementar)',
      diagnostico: 'Exame dentro dos padrões de normalidade.',
      conduta: 'Arquivar resultado no prontuário e comunicar paciente.'
    },
    103: {
      anamnese: 'Paciente comparece para primeira consulta queixando-se de cefaleia matinal frequente e cansaço aos esforços moderados. Histórico familiar de hipertensão.',
      exameFisico: 'PA elevada: 150/90 mmHg. \nSobrepeso (IMC 28). \nEdema leve em membros inferiores (+/4+).',
      diagnostico: 'R03.0 - Leitura elevada da pressão arterial',
      conduta: '1. Iniciar Losartana 50mg.\n2. Solicitar Ecocardiograma e Exames de Sangue.\n3. Retorno em 30 dias com resultados.'
    }
  };

  // REGISTRO SELECIONADO (O que aparece na direita)
  registroSelecionado: any = null;

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.pacienteId = this.route.snapshot.paramMap.get('id');
    
    // Seleciona o primeiro registro por padrão
    if (this.timeline.length > 0) {
      this.selecionarRegistro(this.timeline[0]);
    }
  }

  ngAfterViewInit() {
    this.atualizarIcones();
  }

  atualizarIcones() {
    if (typeof feather !== 'undefined') setTimeout(() => feather.replace(), 50);
  }

  voltar() {
    this.location.back();
  }

  selecionarRegistro(itemTimeline: any) {
    // Busca os textos específicos no nosso "banco" mockado
    const detalhes = this.detalhesMock[itemTimeline.id] || {
      anamnese: 'Dados não informados.',
      exameFisico: 'Sem registro.',
      diagnostico: 'A esclarecer.',
      conduta: 'Aguardando avaliação.'
    };

    // Monta o objeto completo para exibição
    this.registroSelecionado = {
      ...itemTimeline, // Copia dados básicos (data, titulo, médico)
      hora: '14:30',   // Hora fixa ou poderia vir do mock também
      dadosClinicos: detalhes,
      // Adiciona anexo apenas se for exame (lógica simples para variar a tela)
      anexos: itemTimeline.tipo === 'Exame' ? [{ nome: 'Resultado_Exame.pdf', tamanho: '1.2 MB' }] : []
    };
    
    this.atualizarIcones();
  }

  imprimir() {
    window.print();
  }
}