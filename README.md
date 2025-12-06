# ClinicaPi - Sistema de Gestão de Clínicas

Este projeto é um front-end moderno e responsivo desenvolvido em Angular para gestão de clínicas médicas. O sistema foca em uma experiência de usuário fluida, alta performance e uma arquitetura limpa e organizada.

## Pré-requisitos

Antes de começar, é necessário garantir que você tenha as seguintes ferramentas instaladas em seu computador. Caso já tenha, pode pular para a próxima etapa.

### 1. Node.js e NPM

O Angular precisa do Node.js para rodar.

- **Download**: [Site Oficial do Node.js](https://nodejs.org) (Baixe a versão LTS)
- **Como verificar a instalação**: Abra seu terminal e execute:
  ```bash
  node -v
  npm -v


## Git

- **Necessário para clonar o repositório.**
- **Download**: [Site Oficial do Git](https://git-scm.com/)
- **Como verificar a instalação**: No terminal, execute:

  ```bash
  git --version


## Angular CLI (Global)

- **A ferramenta de linha de comando do Angular.**

### Instalação

Para instalar o Angular CLI globalmente, siga os seguintes passos:

1. Abra o terminal e execute o seguinte comando:

   ```bash
   npm install -g @angular/cli


## Instalação e Execução

Siga os passos abaixo para rodar o projeto na sua máquina.

### Passo 1: Clonar o Repositório

1. Abra o terminal na pasta onde deseja salvar o projeto.
2. Execute o comando abaixo para clonar o repositório:

   ```bash
   git clone https://github.com/gusty22/gerenciador-clinica-medica-angular.git

### Passo 2: Acessar a Pasta do Projeto

Após clonar o repositório, entre no diretório do projeto com o seguinte comando:

```bash
cd clinica-front
```

### Passo 3: Instalar Dependências

Este projeto utiliza bibliotecas específicas que podem apresentar problemas de compatibilidade com versões mais recentes do Angular. Para resolver, execute o seguinte comando:

```bash
npm install --legacy-peer-deps

Nota: O comando `npm install` padrão pode falhar devido a conflitos de versões de dependências, como no caso do **FullCalendar**. A flag `--legacy-peer-deps` resolve esses conflitos, ignorando dependências de pares.
```

### Passo 4: Rodar a Aplicação

Inicie o servidor de desenvolvimento local com o seguinte comando:

```bash
ng serve
```

### Passo 5: Acessar o Sistema

Após rodar o servidor, abra o navegador e acesse a aplicação no seguinte endereço:
```bash
http://localhost:4200/
```

---

## Tecnologias e Bibliotecas Utilizadas

Este projeto faz uso das seguintes tecnologias e bibliotecas. Ao rodar o `npm install`, todas elas serão baixadas automaticamente para a pasta `node_modules`:

- **Angular 17+**: Framework principal (Componentes Standalone).
- **Bootstrap 5**: Framework de CSS para layout e componentes (Grid, Modais, Cards).
- **Feather Icons**: Ícones SVG leves e modernos.
- **FullCalendar**: Biblioteca poderosa para gestão da agenda médica.
- **@fullcalendar/angular**: Integração com o Angular.
- **@fullcalendar/daygrid**: Visualização de agenda em formato de grade.
- **@fullcalendar/timegrid**: Visualização de agenda em formato de linha do tempo.
- **@fullcalendar/interaction**: Funcionalidades de interação, como arrastar e soltar eventos.
- **@fullcalendar/list**: Exibição de eventos em lista.


## Estrutura do Projeto

A arquitetura foi desenhada para ser escalável e fácil de manter. A estrutura de pastas está organizada da seguinte forma:

```plaintext
src/app
├── core/                  # Serviços globais (ClinicaService, AuthService, Guards)
├── layout/                # Layouts base (PublicLayout para login, PrivateLayout para o sistema)
├── pages/                 # Telas do sistema
│   ├── public/            # Telas públicas (Home, Login, Cadastro, Recuperação)
│   └── private/           # Telas do sistema logado (Protegidas)
│       ├── dashboard/     # Visão geral e estatísticas
│       ├── administrativo/ # Gestão de Funcionários, Convênios e Configurações
│       ├── atendimento/   # Lista de Prontuários e Dossiê do Paciente
│       └── agendamento/   # Agenda Médica com FullCalendar
```

## Descrição dos Diretórios

- **core/**: Contém serviços globais usados em várias partes do sistema, como `ClinicaService`, `AuthService` e `Guards` para controle de acesso.

- **layout/**: Contém layouts do sistema, como a tela de login (`PublicLayout`) e a tela privada para o sistema logado (`PrivateLayout`).

- **pages/**: Contém as páginas do sistema.

  - **public/**: Telas públicas, como **Home**, **Login**, **Cadastro** e **Recuperação**.

  - **private/**: Telas internas do sistema, protegidas por autenticação, como **Dashboard**, **Administrativo**, **Atendimento** e **Agendamento**.


