# tecnologias_dev_web - ATP2 Firebase App

Este é um aplicativo React que fornece cadastro e autenticação de usuários usando Firebase. A aplicação é composta por três páginas principais: Cadastro, Login e Principal.

## Estrutura do Projeto

```
atp2-firebase-app
├── public
│   ├── index.html          # Arquivo HTML principal
│   └── favicon.ico         # Favicon para a aplicação
├── src
│   ├── components          # Componentes reutilizáveis
│   │   ├── Button.jsx      # Componente de botão
│   │   ├── Input.jsx       # Componente de input
│   │   └── Navbar.jsx      # Componente de barra de navegação
│   ├── config              # Configuração do Firebase
│   │   └── firebase.js     # Inicialização do Firebase
│   ├── contexts            # Context API para autenticação
│   │   └── AuthContext.jsx # Provider de contexto de autenticação
│   ├── hooks               # Hooks personalizados
│   │   └── useAuth.js      # Hook para autenticação
│   ├── pages               # Páginas da aplicação
│   │   ├── Cadastro        # Página de cadastro
│   │   │   └── index.jsx   # Componente de Cadastro
│   │   ├── Login           # Página de login
│   │   │   └── index.jsx   # Componente de Login
│   │   └── Principal       # Página principal do usuário
│   │       └── index.jsx   # Componente Principal
│   ├── routes              # Roteamento da aplicação
│   │   └── AppRoutes.jsx   # Configuração de rotas
│   ├── services            # Serviços para autenticação e Firestore
│   │   ├── auth.js         # Funções de autenticação
│   │   └── firestore.js    # Funções do Firestore
│   ├── styles              # Estilos CSS
│   │   ├── global.css      # Estilos globais
│   │   └── components.css  # Estilos específicos de componentes
│   ├── utils               # Funções utilitárias
│   │   └── validators.js   # Funções de validação de inputs
│   ├── App.jsx             # Componente principal da aplicação
│   ├── index.jsx           # Ponto de entrada para a aplicação React
│   └── main.jsx            # Renderização do root do React 18
├── .env                    # Variáveis de ambiente
├── .env.example            # Exemplo de variáveis de ambiente
├── .firebaserc             # Configuração do projeto Firebase
├── .gitignore              # Arquivos para ignorar no controle de versão
├── firebase.json           # Configuração de hospedagem do Firebase
├── package.json            # Configuração npm
├── vite.config.js          # Configuração de build do Vite
└── README.md               # Documentação do projeto
```

## Funcionalidades

- **Página de Cadastro**: Permite aos usuários se registrarem com e-mail, senha, nome, sobrenome e data de nascimento. Os dados do usuário são armazenados no Firebase Authentication e Firestore.
- **Página de Login**: Os usuários podem fazer login com seu e-mail e senha. O login bem-sucedido redireciona para a página Principal.
- **Página Principal**: Exibe o nome, sobrenome e data de nascimento do usuário logado.

## Como Iniciar

1. Clone o repositório:
   ```
   git clone https://github.com/padilhajuliaa/tecnologias_dev_web.git
   ```

2. Navegue até o diretório do projeto:
   ```
   cd tecnologias_dev_web
   ```

3. Instale as dependências:
   ```
   npm install
   ```

4. Configure o Firebase:
   - Crie um projeto no Firebase e configure a autenticação e o Firestore.
   - Atualize o arquivo `.env` com sua configuração do Firebase.

5. Inicie o servidor de desenvolvimento:
   ```
   npm start
   ```

6. Compile a aplicação para produção:
   ```
   npm run build
   ```

7. Faça o deploy para o Netlify:
   - Siga as instruções no arquivo netlify-deploy.md

## Licença

Este projeto está licenciado sob a Licença MIT.
