import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

declare var feather: any;

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro implements OnInit, AfterViewInit {

  cadastroForm: FormGroup;
  currentStep = 1;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  // Variáveis para o Medidor de Força da Senha
  passwordStrengthScore = 0; // 0 a 4
  passwordStrengthLabel = ''; // Fraca, Média, Forte
  passwordStrengthColor = ''; // danger, warning, success

  planos = [
    { id: 'basico', nome: 'Básico', preco: '99', periodo: '/mês', features: ['1 Usuário', 'Agenda Básica'], destaque: false },
    { id: 'profissional', nome: 'Profissional', preco: '199', periodo: '/mês', features: ['3 Usuários', 'Financeiro', 'NFS-e'], destaque: true },
    { id: 'enterprise', nome: 'Clínica', preco: '399', periodo: '/mês', features: ['Ilimitado', 'Multi-unidades', 'API'], destaque: false }
  ];

  selectedPlan: any = null;
  metodoPagamento: string = 'cartao';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      clinica: [''],
      email: ['', [Validators.required, Validators.email, this.disposableEmailValidator]],
      telefone: ['', [Validators.required, Validators.minLength(14)]],
      // ATUALIZADO: Validador de senha forte
      senha: ['', [Validators.required, Validators.minLength(8), this.strongPasswordValidator]],
      confirmaSenha: ['', [Validators.required]],
      termos: [false, [Validators.requiredTrue]],
      plano: ['', [Validators.required]],
      nomeCartao: [''],
      numeroCartao: [''],
      validadeCartao: [''],
      cvvCartao: ['']
    });

    // Monitora mudanças na senha para atualizar a barra de força em tempo real
    this.cadastroForm.get('senha')?.valueChanges.subscribe(value => {
      this.updatePasswordStrength(value);
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const planoUrl = params['plano'];
      if (planoUrl) {
        const planoEncontrado = this.planos.find(p => p.id === planoUrl.toLowerCase());
        if (planoEncontrado) {
          this.selectPlan(planoEncontrado, false);
        }
      }
    });
  }

  ngAfterViewInit() {
    this.atualizarIcones();
  }

  atualizarIcones() {
    if (typeof feather !== 'undefined') setTimeout(() => feather.replace(), 50);
  }

  // --- VALIDADORES PERSONALIZADOS ---

  disposableEmailValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const email = control.value.toLowerCase();
    const disposableDomains = [
      'tempmail.com', '10minutemail.com', 'guerrillamail.com', 
      'mailinator.com', 'yopmail.com', 'throwawaymail.com'
    ];
    const domain = email.split('@')[1];
    if (domain && disposableDomains.includes(domain)) {
      return { disposableEmail: true };
    }
    return null;
  }

  // Validador de Senha Forte
  strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    // Regras: Pelo menos 1 letra, 1 número e 8 caracteres (O minLength já cuida do tamanho)
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    
    const valid = hasLetter && hasNumber;
    
    if (!valid) {
      return { weakPassword: true };
    }
    return null;
  }

  // Calculadora de Força Visual (Apenas visual, não bloqueia o form além do validator acima)
  updatePasswordStrength(password: string) {
    if (!password) {
      this.passwordStrengthScore = 0;
      this.passwordStrengthLabel = '';
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++; // Tem Maiúscula
    if (/[a-z]/.test(password)) score++; // Tem Minúscula
    if (/[0-9]/.test(password)) score++; // Tem Número
    if (/[^A-Za-z0-9]/.test(password)) score++; // Tem Especial (@, #, etc)

    this.passwordStrengthScore = score;

    if (score < 3) {
      this.passwordStrengthLabel = 'Fraca';
      this.passwordStrengthColor = 'danger'; // Vermelho
    } else if (score === 3 || score === 4) {
      this.passwordStrengthLabel = 'Média';
      this.passwordStrengthColor = 'warning'; // Amarelo
    } else {
      this.passwordStrengthLabel = 'Forte';
      this.passwordStrengthColor = 'success'; // Verde
    }
  }

  formatarTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.substring(0, 11);
    if (valor.length > 10) valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    else if (valor.length > 6) valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    else if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    else if (valor.length > 0) valor = valor.replace(/^(\d*)/, '($1');
    this.cadastroForm.get('telefone')?.setValue(valor, { emitEvent: false });
  }

  voltar() {
    this.location.back();
  }

  nextStep() {
    if (this.currentStep === 1) {
      const controls = ['nome', 'email', 'telefone', 'senha', 'confirmaSenha', 'termos'];
      controls.forEach(c => this.cadastroForm.get(c)?.markAsTouched());

      const isValid = controls.every(c => {
         const control = this.cadastroForm.get(c);
         return control && control.valid;
      });
      
      if (!isValid) {
        alert('Por favor, verifique os campos em vermelho.');
        return;
      }
      
      if (this.cadastroForm.get('senha')?.value !== this.cadastroForm.get('confirmaSenha')?.value) {
        alert('As senhas não conferem.');
        return;
      }
    }

    if (this.currentStep === 2) {
      if (!this.selectedPlan) {
        alert('Por favor, selecione um plano.');
        return;
      }
    }

    this.currentStep++;
    window.scrollTo(0, 0);
    this.atualizarIcones();
  }

  prevStep() {
    this.currentStep--;
    window.scrollTo(0, 0);
    this.atualizarIcones();
  }

  selectPlan(plano: any, autoAdvance = true) {
    this.selectedPlan = plano;
    this.cadastroForm.patchValue({ plano: plano.id });
    if (autoAdvance) this.nextStep();
  }

  setPagamento(metodo: string) {
    this.metodoPagamento = metodo;
    this.atualizarIcones();
  }

  togglePassword(field: 'senha' | 'confirma') {
    if (field === 'senha') this.showPassword = !this.showPassword;
    if (field === 'confirma') this.showConfirmPassword = !this.showConfirmPassword;
    this.atualizarIcones();
  }

  onSubmit() {
    if (this.cadastroForm.invalid && this.currentStep !== 3) return;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.currentStep = 4;
      this.atualizarIcones();
    }, 2000);
  }
}