import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

declare var feather: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements AfterViewInit {

  // Modelo de dados do formulário
  credentials = {
    email: '',
    password: '',
    remember: false
  };

  // Estados da Interface
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(private router: Router) {}

  ngAfterViewInit() {
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  // Alternar visibilidade da senha
  togglePassword() {
    this.showPassword = !this.showPassword;
    // Atualiza o ícone
    setTimeout(() => {
      if (typeof feather !== 'undefined') feather.replace();
    }, 50);
  }

  // Ação de Login
  onSubmit() {
    // Validação básica
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulação de chamada ao Backend (Delay de 1.5s)
    setTimeout(() => {
      this.isLoading = false;
      
      // Simulação de sucesso
      // Em produção, aqui você salvaria o token JWT e redirecionaria
      console.log('Login realizado:', this.credentials);
      this.router.navigate(['/sistema/dashboard']);
      
    }, 1500);
  }
}