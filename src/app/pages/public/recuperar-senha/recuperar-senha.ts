import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

declare var feather: any;

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-senha.html',
  styleUrl: './recuperar-senha.css'
})
export class RecuperarSenha implements AfterViewInit {

  // Controle único para o e-mail
  emailControl = new FormControl('', [Validators.required, Validators.email]);

  // Estados da Interface
  isLoading = false;
  isSuccess = false; // Controla se mostra o formulário ou a mensagem de sucesso
  errorMessage = '';

  // Banco de dados simulado (Mesmos do login/cadastro)
  private validEmails = [
    'dr.silva@email.com',
    'ana.souza@email.com',
    'carlos.f@email.com',
    'maria.oli@email.com'
  ];

  constructor() {}

  ngAfterViewInit() {
    this.atualizarIcones();
  }

  atualizarIcones() {
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  onSubmit() {
    if (this.emailControl.invalid) {
      this.emailControl.markAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const emailDigitado = this.emailControl.value?.toLowerCase() || '';

    // Simulação de chamada ao servidor
    setTimeout(() => {
      this.isLoading = false;

      // Verifica se o e-mail existe no "banco"
      if (this.validEmails.includes(emailDigitado)) {
        this.isSuccess = true; // Mostra tela de sucesso
        setTimeout(() => this.atualizarIcones(), 50); // Atualiza ícones da nova view
      } else {
        this.errorMessage = 'E-mail não encontrado em nosso sistema.';
        setTimeout(() => this.atualizarIcones(), 50); // Atualiza ícone de alerta
      }
      
    }, 1500); // Delay de 1.5s para realismo
  }

  tentarNovamente() {
    this.isSuccess = false;
    this.emailControl.reset();
    this.errorMessage = '';
    setTimeout(() => this.atualizarIcones(), 50);
  }
}