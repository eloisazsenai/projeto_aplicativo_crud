# Minha Estante - CRUD de livros

Aplicação web desenvolvida para a atividade prática de Codificação Front-end.

## Funcionalidades

- Cadastro, listagem, edição e exclusão de livros.
- Pesquisa por título.
- Ordenação por título, autor e ano.
- Validação dos campos.
- Persistência dos dados no Local Storage.
- Interface responsiva.
- Organização do TypeScript em módulos.
- Avaliação pessoal de 1 a 5 estrelas para cada livro.

## Como executar

1. Execute `npm.cmd install` para instalar o TypeScript.
2. Execute `npm.cmd run build` para compilar os arquivos.
3. Abra o `index.html` usando um servidor local, como a extensão Live Server do VS Code.

Os módulos não devem ser executados abrindo o HTML diretamente pelo Explorador de Arquivos.

## Organização

- `index.html`: estrutura da página.
- `css/style.css`: aparência e responsividade.
- `ts/livro.ts`: classe que representa um livro.
- `ts/armazenamento.ts`: leitura e gravação no Local Storage.
- `ts/cadastro.ts`: formulário, pesquisa, ordenação e eventos.
- `js/`: versões compiladas utilizadas pelo navegador.
- `tsconfig.json`: configuração que indica como transformar TypeScript em JavaScript.
