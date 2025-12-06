import { Routes } from '@angular/router';

// Layouts
import { PublicLayout } from './layout/public-layout/public-layout';
import { PrivateLayout } from './layout/private-layout/private-layout';

// Páginas Públicas
import { Home } from './pages/public/home/home';
import { Login } from './pages/public/login/login';
import { Cadastro } from './pages/public/cadastro/cadastro';
import { RecuperarSenha } from './pages/public/recuperar-senha/recuperar-senha';

// Páginas Privadas
import { Dashboard } from './pages/private/dashboard/dashboard';
import { Funcionarios } from './pages/private/administrativo/funcionarios/funcionarios';
import { Convenios } from './pages/private/administrativo/convenios/convenios';
import { Configuracoes } from './pages/private/administrativo/configuracoes/configuracoes';
import { Pacientes } from './pages/private/atendimento/pacientes/pacientes';
import { PacienteDetalhe } from './pages/private/atendimento/paciente-detalhe/paciente-detalhe';
import { Prontuarios } from './pages/private/atendimento/prontuarios/prontuarios';
import { Agenda } from './pages/private/agendamento/agenda/agenda';
import { MeuPerfil } from './pages/private/meu-perfil/meu-perfil';
import { ProntuarioDetalhe } from './pages/private/atendimento/prontuario-detalhe/prontuario-detalhe';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // ÁREA PÚBLICA
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: 'home', component: Home },
      { path: 'login', component: Login },
      { path: 'cadastro', component: Cadastro },
      { path: 'recuperar-senha', component: RecuperarSenha }
    ]
  },

  // ÁREA PRIVADA
  {
    path: 'sistema',
    component: PrivateLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      
      // Administrativo
      { path: 'administrativo/funcionarios', component: Funcionarios },
      { path: 'administrativo/convenios', component: Convenios },
      { path: 'administrativo/configuracoes', component: Configuracoes },
      { path: 'meu-perfil', component: MeuPerfil },

      // Atendimento
      { path: 'atendimento/pacientes', component: Pacientes },
      { path: 'atendimento/pacientes/:id', component: PacienteDetalhe },
      { path: 'atendimento/prontuarios', component: Prontuarios },
      { path: 'atendimento/prontuarios/:id', component: ProntuarioDetalhe },

      // Agendamento
      { path: 'agendamento/agenda', component: Agenda }
    ]
  },

  { path: '**', redirectTo: 'home' }
];