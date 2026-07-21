// A classe funciona como um modelo para criar objetos do tipo Livro.
// Cada atributo possui um tipo definido pelo TypeScript.
class Livro {
    id: number;
    titulo: string;
    autor: string;
    ano: number | null;
    genero: string;
    resumo: string;

    // O construtor recebe os dados e cria uma nova instância de Livro.
    constructor(
        id: number,
        titulo: string,
        autor: string,
        ano: number | null,
        genero: string,
        resumo: string
    ) {
        // "this" representa o objeto que está sendo criado.
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
        this.genero = genero;
        this.resumo = resumo;
    }
}

// Seleciona os elementos do HTML que serão manipulados pelo TypeScript.
// O tipo entre < > informa qual elemento HTML esperamos encontrar.
// O sinal ! informa que temos certeza de que o elemento existe na página.
const form = document.querySelector<HTMLFormElement>("#form-livro")!;
const tituloInput = document.querySelector<HTMLInputElement>("#titulo")!;
const autorInput = document.querySelector<HTMLInputElement>("#autor")!;
const anoInput = document.querySelector<HTMLInputElement>("#ano")!;
const generoInput = document.querySelector<HTMLInputElement>("#genero")!;
const resumoInput = document.querySelector<HTMLTextAreaElement>("#resumo")!;
// Seleciona o campo usado para pesquisar os livros pelo título.
const pesquisaInput = document.querySelector<HTMLInputElement>("#pesquisa")!;
// Seleciona a lista de opções que define como os livros serão ordenados.
const ordenacaoSelect = document.querySelector<HTMLSelectElement>("#ordenacao")!;
const listaLivros = document.querySelector<HTMLDivElement>("#div-lista-livros")!;
const contadorLivros = document.querySelector<HTMLParagraphElement>("#contador-livros")!;
const botaoAdicionar = document.querySelector<HTMLButtonElement>("#adicionar")!;
const modoFormulario = document.querySelector<HTMLSpanElement>("#modo-formulario")!;
const mensagem = document.querySelector<HTMLDivElement>("#mensagem")!;

// Array que armazena os livros enquanto a página estiver aberta.
let livros: Livro[] = [];

// Guarda o id do livro que está sendo editado. O valor null indica um novo cadastro.
let idEmEdicao: number | null = null;

// Guarda o identificador do temporizador usado para esconder as mensagens.
let tempoMensagem: number;

// Converte textos digitados pelo usuário em conteúdo seguro para inserir no HTML.
// Isso impede que uma entrada seja interpretada como uma tag HTML.
function escaparHtml(texto: string): string {
    const elemento: HTMLDivElement = document.createElement("div");
    elemento.textContent = texto;
    return elemento.innerHTML;
}

// Padroniza um texto removendo acentos e convertendo as letras para minúsculas.
// Assim, uma pesquisa por "principE" também encontra "O Pequeno Príncipe".
function normalizarTexto(texto: string): string {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// Recebe os livros filtrados e devolve uma nova lista na ordem escolhida.
// O operador [...] cria uma cópia para que o array principal não seja alterado pelo sort.
function ordenarLivros(livrosParaOrdenar: Livro[]): Livro[] {
    const livrosOrdenados: Livro[] = [...livrosParaOrdenar];

    // switch executa uma comparação diferente de acordo com a opção selecionada.
    switch (ordenacaoSelect.value) {
        case "titulo-az":
            livrosOrdenados.sort((a: Livro, b: Livro) => a.titulo.localeCompare(b.titulo, "pt-BR"));
            break;
        case "titulo-za":
            livrosOrdenados.sort((a: Livro, b: Livro) => b.titulo.localeCompare(a.titulo, "pt-BR"));
            break;
        case "autor-az":
            livrosOrdenados.sort((a: Livro, b: Livro) => a.autor.localeCompare(b.autor, "pt-BR"));
            break;
        case "ano-recente":
            livrosOrdenados.sort((a: Livro, b: Livro) => (b.ano ?? 0) - (a.ano ?? 0));
            break;
        case "ano-antigo":
            livrosOrdenados.sort((a: Livro, b: Livro) => (a.ano ?? 0) - (b.ano ?? 0));
            break;
        default:
            // Na opção padrão, a cópia mantém a mesma ordem em que os livros foram cadastrados.
            break;
    }

    return livrosOrdenados;
}

// Atualiza a lista exibida na tela usando os dados do array "livros".
function renderizarLivros(): void {
    // Lê o que foi digitado e deixa o texto pronto para a comparação.
    const termoPesquisado: string = normalizarTexto(pesquisaInput.value.trim());

    // filter cria um novo array somente com os livros cujo título contém o termo pesquisado.
    // Quando o campo está vazio, includes("") é verdadeiro e todos os livros são exibidos.
    const livrosFiltrados: Livro[] = livros.filter((livro: Livro) => {
        const tituloNormalizado: string = normalizarTexto(livro.titulo);
        return tituloNormalizado.includes(termoPesquisado);
    });

    // Aplica a ordenação somente depois da pesquisa, trabalhando com os resultados visíveis.
    const livrosOrdenados: Livro[] = ordenarLivros(livrosFiltrados);

    // Atualiza o contador e escolhe singular ou plural com um operador ternário.
    const quantidade: number = livrosOrdenados.length;
    contadorLivros.textContent = `${quantidade} ${quantidade === 1 ? "livro" : "livros"}`;

    // Se não houver resultados, apresenta uma mensagem adequada para cada situação.
    if (quantidade === 0) {
        const pesquisaAtiva: boolean = termoPesquisado !== "";

        listaLivros.innerHTML = `
            <div class="estado-vazio">
                <strong>${pesquisaAtiva ? "Nenhum livro encontrado" : "Sua estante está vazia"}</strong>
                <p>${pesquisaAtiva ? "Tente pesquisar usando outro título." : "Preencha o formulário para cadastrar seu primeiro livro."}</p>
            </div>
        `;
        return;
    }

    // Limpa a lista antes de criar novamente os cartões.
    listaLivros.innerHTML = "";

    // Estrutura de repetição utilizada para mostrar todos os livros.
    for (const livro of livrosOrdenados) {
        // Cria um elemento <article> para representar o livro atual.
        const cartao: HTMLElement = document.createElement("article");
        cartao.className = "cartao-livro";
        cartao.innerHTML = `
            <div class="cartao-topo">
                <div>
                    <h3>${escaparHtml(livro.titulo)}</h3>
                    <p class="autor">por ${escaparHtml(livro.autor)}</p>
                </div>
            </div>
            <p class="resumo">${escaparHtml(livro.resumo)}</p>
            <div class="metadados">
                ${livro.genero ? `<span>${escaparHtml(livro.genero)}</span>` : ""}
                ${livro.ano !== null ? `<span>${livro.ano}</span>` : ""}
            </div>
            <div class="acoes-cartao">
                <button class="acao-cartao" type="button" data-acao="editar" data-id="${livro.id}">Editar</button>
                <button class="acao-cartao acao-excluir" type="button" data-acao="excluir" data-id="${livro.id}">Excluir</button>
            </div>
        `;
        // Insere o cartão pronto dentro da lista da página.
        listaLivros.appendChild(cartao);
    }
}

// Exibe uma mensagem temporária de sucesso ou de validação.
function mostrarMensagem(texto: string): void {
    // Cancela o temporizador anterior para evitar mensagens sobrepostas.
    window.clearTimeout(tempoMensagem);
    mensagem.textContent = texto;
    mensagem.classList.add("visivel");
    // Depois de 2,6 segundos, remove a classe que deixa a mensagem visível.
    tempoMensagem = window.setTimeout(() => mensagem.classList.remove("visivel"), 2600);
}

// Encerra o modo de edição e devolve o formulário ao modo de cadastro.
function limparModoEdicao(): void {
    idEmEdicao = null;
    botaoAdicionar.textContent = "Adicionar livro";
    modoFormulario.textContent = "Cadastro";
}

// Trata o envio do formulário, cadastrando um livro ou salvando uma edição.
function cadastrarOuEditarLivro(evento: SubmitEvent): void {
    // Impede o comportamento padrão do formulário, que recarregaria a página.
    evento.preventDefault();

    // Lê os campos e remove espaços existentes no início e no final dos textos.
    const titulo: string = tituloInput.value.trim();
    const autor: string = autorInput.value.trim();
    const genero: string = generoInput.value.trim();
    const resumo: string = resumoInput.value.trim();

    // Interrompe a função caso algum campo textual contenha apenas espaços.
    if (titulo === "" || autor === "" || genero === "" || resumo === "") {
        mostrarMensagem("Preencha corretamente todos os campos obrigatórios.");
        return;
    }

    // Converte o valor do campo ano, que chega como texto, para number.
    const ano: number = Number(anoInput.value);

    // Aceita somente anos inteiros dentro do intervalo definido no formulário.
    if (!Number.isInteger(ano) || ano < 1 || ano > 2026) {
        mostrarMensagem("Informe um ano válido entre 1 e 2026.");
        return;
    }

    // Cria um objeto Livro com os valores validados.
    // Em uma edição, mantém o id atual; em um cadastro, Date.now() gera um novo id.
    const livroPreenchido: Livro = new Livro(
        idEmEdicao ?? Date.now(),
        titulo,
        autor,
        ano,
        genero,
        resumo
    );

    // Estrutura de decisão: cadastra um novo livro ou atualiza o existente.
    if (idEmEdicao === null) {
        // push adiciona o novo objeto ao final do array.
        livros.push(livroPreenchido);
        mostrarMensagem("Livro adicionado à estante.");
    } else {
        // findIndex procura a posição do livro que possui o id em edição.
        const indice: number = livros.findIndex((livro: Livro) => livro.id === idEmEdicao);

        if (indice !== -1) {
            livros[indice] = livroPreenchido;
        }

        mostrarMensagem("Livro atualizado com sucesso.");
    }

    // Limpa o formulário, encerra a edição e atualiza a lista na tela.
    form.reset();
    limparModoEdicao();
    renderizarLivros();
}

// Localiza um livro pelo id e coloca seus dados nos campos do formulário.
function editarLivro(id: number): void {
    // find retorna o primeiro livro correspondente ou undefined se não encontrar.
    const livro: Livro | undefined = livros.find((item: Livro) => item.id === id);

    if (livro === undefined) {
        return;
    }

    // Ativa o modo de edição e preenche os campos com os dados encontrados.
    idEmEdicao = id;
    tituloInput.value = livro.titulo;
    autorInput.value = livro.autor;
    anoInput.value = livro.ano === null ? "" : String(livro.ano);
    generoInput.value = livro.genero;
    resumoInput.value = livro.resumo;
    botaoAdicionar.textContent = "Salvar alterações";
    modoFormulario.textContent = "Edição";
}

// Exclui do array o livro que possui o id recebido.
function excluirLivro(id: number): void {
    const livro: Livro | undefined = livros.find((item: Livro) => item.id === id);

    // Interrompe se o livro não existir ou se o usuário cancelar a confirmação.
    if (livro === undefined || !window.confirm(`Deseja excluir o livro "${livro.titulo}"?`)) {
        return;
    }

    // filter cria um novo array contendo todos os livros, exceto o excluído.
    livros = livros.filter((item: Livro) => item.id !== id);

    if (idEmEdicao === id) {
        form.reset();
        limparModoEdicao();
    }

    renderizarLivros();
    mostrarMensagem("Livro excluído da estante.");
}

// Registra os eventos do formulário.
form.addEventListener("submit", cadastrarOuEditarLivro);
form.addEventListener("reset", () => window.setTimeout(limparModoEdicao, 0));

// O evento input executa a pesquisa novamente a cada letra digitada.
pesquisaInput.addEventListener("input", renderizarLivros);

// O evento change reorganiza a lista quando uma nova opção é selecionada.
ordenacaoSelect.addEventListener("change", renderizarLivros);

// Usa delegação de eventos: um único evento trata todos os botões da lista.
listaLivros.addEventListener("click", (evento: MouseEvent) => {
    // closest procura o botão Editar ou Excluir que recebeu o clique.
    const botao: HTMLButtonElement | null = (evento.target as HTMLElement).closest("button[data-acao]");

    if (botao === null) {
        return;
    }

    // Recupera o id salvo no atributo data-id do botão e converte para number.
    const id: number = Number(botao.dataset.id);

    if (botao.dataset.acao === "editar") {
        editarLivro(id);
    } else if (botao.dataset.acao === "excluir") {
        excluirLivro(id);
    }
});

// Faz a primeira renderização assim que o script é carregado.
renderizarLivros();



