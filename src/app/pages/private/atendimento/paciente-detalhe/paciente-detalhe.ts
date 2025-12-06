import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; 
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare var feather: any;
declare var bootstrap: any;

@Component({
  selector: 'app-paciente-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './paciente-detalhe.html',
  styleUrl: './paciente-detalhe.css'
})
export class PacienteDetalhe implements OnInit, AfterViewInit {
  
  pacienteId: string | null = null;
  abaAtual: string = 'resumo';
  
  pacienteEmEdicao: any = {
    id: 0,
    nome: '',
    endereco: { rua: '', bairro: '', cidade: '', estado: '', complemento: '' }
  };
  
  modalEdicaoRef: any;

  // --- DADOS DO PACIENTE ---
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
      convenio: 'Unimed',
      tipoSanguineo: 'O+',
      alergias: ['Penicilina', 'Dipirona'],
      comorbidades: ['Hipertensão Leve'],
      endereco: { rua: 'Rua das Flores, 123', bairro: 'Centro', cidade: 'Uberlândia', estado: 'MG', complemento: 'Apt 101' },
      dataCadastro: '15/01/2025'
    },
    // ... outros pacientes (mantidos iguais)
  ];

  paciente: any = null;

  // --- HISTÓRICO COM IDs (Para o link funcionar) ---
  historico = [
    {
      id: 101, // ID do Prontuário
      data: '02/05/2025', tipo: 'Consulta', medico: 'Dr. Silva', especialidade: 'Clínico Geral',
      descricao: 'Paciente relatou dores de cabeça frequentes. Prescrito analgésico e solicitado exames de sangue.', icon: 'activity'
    },
    {
      id: 102, // ID do Prontuário
      data: '20/04/2025', tipo: 'Exame', medico: 'Laboratório Central', especialidade: 'Análises Clínicas',
      descricao: 'Hemograma completo realizado. Resultados dentro da normalidade.', icon: 'file-text'
    }
  ];

  constructor(
    private route: ActivatedRoute, 
    private location: Location
  ) {}

  ngOnInit() {
    this.pacienteId = this.route.snapshot.paramMap.get('id');
    
    if (this.pacienteId) {
      const idNumerico = Number(this.pacienteId);
      // Busca mockada simples (pega o primeiro se não achar o ID exato para teste)
      this.paciente = this.pacientesDB.find(p => p.id === idNumerico) || this.pacientesDB[0];
    }
  }

  ngAfterViewInit() {
    this.atualizarIcones();
  }

  voltarPaginaAnterior() {
    this.location.back();
  }

  atualizarIcones() {
    if (typeof feather !== 'undefined') {
      setTimeout(() => feather.replace(), 50);
    }
  }

  setAba(aba: string) {
    this.abaAtual = aba;
    setTimeout(() => { this.atualizarIcones(); }, 50);
  }

  abrirModalEditar() {
    if (!this.paciente) return;

    this.pacienteEmEdicao = { 
      ...this.paciente,
      endereco: this.paciente.endereco ? { ...this.paciente.endereco } : { rua: '', bairro: '', cidade: '', estado: '', complemento: '' }
    };

    const modalEl = document.getElementById('editarDetalheModal');
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
    this.paciente = { ...this.pacienteEmEdicao };
    if (this.modalEdicaoRef) {
      this.modalEdicaoRef.hide();
    }
    alert('Dados atualizados com sucesso!');
  }
}