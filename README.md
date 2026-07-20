# BookStore Manager CLI

Aplicação de linha de comando (CLI) para o gerenciamento de uma livraria, desenvolvida em Node.js e TypeScript, utilizando PostgreSQL como mecanismo de persistência. O sistema permite administrar autores, livros, clientes e empréstimos, além de gerar relatórios gerenciais a partir de consultas relacionais ao banco de dados.

## Objetivo

Consolidar os conceitos de back-end com Node.js e TypeScript: programação orientada a objetos, programação assíncrona, arquitetura em camadas, modelagem de banco de dados relacional e consultas SQL. A aplicação reproduz um sistema corporativo de pequeno porte, priorizando organização, separação de responsabilidades e integridade dos dados.

## Tecnologias utilizadas

- Node.js
- TypeScript
- PostgreSQL
- Biblioteca `pg` (cliente PostgreSQL)
- Biblioteca `dotenv` (variáveis de ambiente)
- `tsx` (execução em desenvolvimento) e `tsc` (compilação)

## Requisitos para execução

- Node.js 18 ou superior
- PostgreSQL 13 ou superior (instalação nativa, Docker ou serviço em nuvem)
- npm

## Instalação

```bash
git clone https://github.com/jorge-lherrera/SCTEC-FINAL-PROJECT-MODULE-1.git
cd SCTEC-FINAL-PROJECT-MODULE-1
npm install
```

## Configuração do banco de dados

### 1. Variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores conforme o seu ambiente:

```bash
cp .env.example .env
```

Conteúdo do `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=bookstore_db
```

### 2. Criação do banco

Crie a base de dados vazia (o nome deve coincidir com `DB_NAME`):

```sql
CREATE DATABASE bookstore_db;
```

### 3. Criação das tabelas

Execute o script `src/database/schema.sql`, que cria as tabelas, chaves e restrições.

PostgreSQL nativo:

```bash
psql -U seu_usuario -d bookstore_db -f src/database/schema.sql
```

PostgreSQL em Docker (substitua `nome_do_container`):

```bash
docker exec -i nome_do_container psql -U seu_usuario -d bookstore_db < src/database/schema.sql
```

O banco não é entregue populado: toda a estrutura é recriada a partir do `schema.sql`.

## Execução

Ambiente de desenvolvimento (sem compilar):

```bash
npm run dev
```

Compilar e executar em produção:

```bash
npm run build
npm start
```

Verificação de tipos (sem gerar arquivos):

```bash
npm run typecheck
```

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Executa a aplicação em desenvolvimento com `tsx`, sem compilar. |
| `npm run build` | Compila o TypeScript para JavaScript na pasta `dist/`. |
| `npm start` | Executa a versão já compilada (`dist/main.js`). |
| `npm run typecheck` | Verifica os tipos sem gerar arquivos. |

## Arquitetura do projeto

A aplicação segue uma arquitetura em camadas, com responsabilidades bem definidas. O fluxo de uma operação é:

```
Usuário -> Menu -> Controller -> Service -> Repository -> PostgreSQL
```

| Camada | Responsabilidade |
|---|---|
| Main | Inicia a aplicação, valida a conexão e inicia o menu principal. |
| Menus | Exibe o menu principal e direciona para cada módulo. |
| Controllers | Interação com o usuário via terminal (entradas, mensagens, submenus). |
| Services | Regras de negócio e validações. |
| Repositories | Acesso ao PostgreSQL por meio de comandos SQL. |
| Models | Interfaces e tipos que representam as entidades. |
| Database | Configuração da conexão (pool) e script de criação do banco. |
| Utils | Funções auxiliares reutilizáveis (leitura de entrada e validações). |

O acesso ao banco utiliza sempre programação assíncrona (`async`/`await`) e tratamento de erros com `try/catch`. As operações de empréstimo e devolução são executadas em transações (`BEGIN`/`COMMIT`/`ROLLBACK`) para manter a consistência do estoque.

## Modelo de dados

- `authors` (1) --- (N) `books`: cada livro pertence a um autor.
- `books` (1) --- (N) `loans`: um livro pode ter vários empréstimos.
- `customers` (1) --- (N) `loans`: um cliente pode ter vários empréstimos.

O controle de disponibilidade é feito pelas colunas `total_quantity` e `available_quantity` da tabela `books`, atualizadas a cada empréstimo e devolução.

## Funcionalidades implementadas

- Autores: cadastrar, listar, consultar por ID, atualizar e remover.
- Livros: cadastrar, listar, consultar, atualizar e remover, com vínculo obrigatório a um autor existente e controle de estoque.
- Clientes: cadastrar, listar, consultar, atualizar e remover, com e-mail único.
- Empréstimos: registrar empréstimo (valida existência de livro e cliente e disponibilidade), registrar devolução (atualiza o estoque) e listar empréstimos com dados do livro e do cliente.
- Relatórios:
  - Livros disponíveis.
  - Livros emprestados.
  - Livros cadastrados por autor.
  - Livros mais emprestados.
  - Clientes com empréstimos ativos.
- Validações que impedem operações inválidas (registros inexistentes, duplicados ou sem disponibilidade), sempre com mensagens claras e sem interromper a execução.

## Estrutura de pastas

```
bookstore-manager-cli/
├── src/
│   ├── main.ts
│   ├── controllers/
│   │   ├── AuthorController.ts
│   │   ├── BookController.ts
│   │   ├── CustomerController.ts
│   │   ├── LoanController.ts
│   │   └── ReportController.ts
│   ├── services/
│   │   ├── AuthorService.ts
│   │   ├── BookService.ts
│   │   ├── CustomerService.ts
│   │   ├── LoanService.ts
│   │   └── ReportService.ts
│   ├── repositories/
│   │   ├── AuthorRepository.ts
│   │   ├── BookRepository.ts
│   │   ├── CustomerRepository.ts
│   │   ├── LoanRepository.ts
│   │   └── ReportRepository.ts
│   ├── models/
│   │   ├── Author.ts
│   │   ├── Book.ts
│   │   ├── Customer.ts
│   │   ├── Loan.ts
│   │   └── Report.ts
│   ├── menus/
│   │   └── mainMenu.ts
│   ├── database/
│   │   ├── connection.ts
│   │   └── schema.sql
│   └── utils/
│       ├── prompt.ts
│       └── validation.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Exemplo de utilização

Ao iniciar a aplicação é exibido o menu principal:

```
===== BOOKSTORE MANAGER =====
1) Autores
2) Livros
3) Clientes
4) Empréstimos
5) Relatórios
0) Sair
Escolha uma opção:
```

Fluxo típico para registrar um empréstimo:

1. Opção `1` (Autores) e cadastre um autor.
2. Opção `2` (Livros) e cadastre um livro informando o ID do autor.
3. Opção `3` (Clientes) e cadastre um cliente.
4. Opção `4` (Empréstimos) e registre o empréstimo informando o ID do livro e o ID do cliente.
5. Opção `5` (Relatórios) para consultar os livros emprestados e os clientes com empréstimos ativos.

## Integrantes da equipe

- Jorge Herrera


