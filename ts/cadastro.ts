// A classe representa um livro e define os tipos de cada atributo.
class Livro {
    id: number;
    titulo: string;
    autor: string;
    ano: number | null;
    genero: string;
    resumo: string;

    constructor(
        id: number,
        titulo: string,
        autor: string,
        ano: number | null,
        genero: string,
        resumo: string
    ) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
        this.genero = genero;
        this.resumo = resumo;
    }
}

const form = document.querySelector<HTMLFormElement>("#form-livro")!;
const tituloInput = document.querySelector<HTMLInputElement>("#titulo")!;
const autorInput = document.querySelector<HTMLInputElement>("#autor")!;
const anoInput = document.querySelector<HTMLInputElement>("#ano")!;
const generoInput = document.querySelector<HTMLInputElement>("#genero")!;
const resumoInput = document.querySelector<HTMLTextAreaElement>("#resumo")!;
const listaLivros = document.querySelector<HTMLDivElement>("#div-lista-livros")!;
const contadorLivros = document.querySelector<HTMLParagraphElement>("#contador-livros")!;
const botaoAdicionar = document.querySelector<HTMLButtonElement>("#adicionar")!;
const modoFormulario = document.querySelector<HTMLSpanElement>("#modo-formulario")!;
const mensagem = document.querySelector<HTMLDivElement>("#mensagem")!;

// Os registros ficam em memória, conforme permitido pelo enunciado.
let livros: Livro[] = [];
let idEmEdicao: number | null = null;
let tempoMensagem: number;

function escaparHtml(texto: string): string {
    const elemento: HTMLDivElement = document.createElement("div");
    elemento.textContent = texto;
    return elemento.innerHTML;
}

function renderizarLivros(): void {
    const quantidade: number = livros.length;
    contadorLivros.textContent = `${quantidade} ${quantidade === 1 ? "livro" : "livros"}`;

    if (quantidade === 0) {
        listaLivros.innerHTML = `
            <div class="estado-vazio">
                <strong>Sua estante está vazia</strong>
                <p>Preencha o formulário para cadastrar seu primeiro livro.</p>
            </div>
        `;
        return;
    }

    listaLivros.innerHTML = "";

    // Estrutura de repetição utilizada para mostrar todos os livros.
    for (const livro of livros) {
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
        listaLivros.appendChild(cartao);
    }
}

function mostrarMensagem(texto: string): void {
    window.clearTimeout(tempoMensagem);
    mensagem.textContent = texto;
    mensagem.classList.add("visivel");
    tempoMensagem = window.setTimeout(() => mensagem.classList.remove("visivel"), 2600);
}

function limparModoEdicao(): void {
    idEmEdicao = null;
    botaoAdicionar.textContent = "Adicionar livro";
    modoFormulario.textContent = "Cadastro";
}

function cadastrarOuEditarLivro(evento: SubmitEvent): void {
    evento.preventDefault();

    //VALIDAÇÂO DE CAMPOS 
    const titulo: string = tituloInput.value.trim(); //REMOVENDO OS ESPAÇOS
    const autor: string = autorInput.value.trim();
    const genero: string = generoInput.value.trim();
    const resumo: string = resumoInput.value.trim();

    if (titulo === "" || autor === "" || genero === "" || resumo === ""){
        mostrarMensagem("Preencha corretamente todos os campos obrigatório.");
        return;
    }

      //VALIDAÇÃO DO ANO 
      const ano: number= Number(anoInput.value);

      if(!Number.isInteger(ano)|| ano < 1000 || ano > 2026){
        mostrarMensagem("Informe um ano válido");
        return;
      }

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
        livros.push(livroPreenchido);
        mostrarMensagem("Livro adicionado à estante.");
    } else {
        const indice: number = livros.findIndex((livro: Livro) => livro.id === idEmEdicao);

        if (indice !== -1) {
            livros[indice] = livroPreenchido;
        }

        mostrarMensagem("Livro atualizado com sucesso.");
    }

    form.reset();
    limparModoEdicao();
    renderizarLivros();
}

function editarLivro(id: number): void {
    const livro: Livro | undefined = livros.find((item: Livro) => item.id === id);

    if (livro === undefined) {
        return;
    }

    idEmEdicao = id;
    tituloInput.value = livro.titulo;
    autorInput.value = livro.autor;
    anoInput.value = livro.ano === null ? "" : String(livro.ano);
    generoInput.value = livro.genero;
    resumoInput.value = livro.resumo;
    botaoAdicionar.textContent = "Salvar alterações";
    modoFormulario.textContent = "Edição";
}

function excluirLivro(id: number): void {
    const livro: Livro | undefined = livros.find((item: Livro) => item.id === id);

    if (livro === undefined || !window.confirm(`Deseja excluir o livro "${livro.titulo}"?`)) {
        return;
    }

    livros = livros.filter((item: Livro) => item.id !== id);

    if (idEmEdicao === id) {
        form.reset();
        limparModoEdicao();
    }

    renderizarLivros();
    mostrarMensagem("Livro excluído da estante.");
}

form.addEventListener("submit", cadastrarOuEditarLivro);
form.addEventListener("reset", () => window.setTimeout(limparModoEdicao, 0));

listaLivros.addEventListener("click", (evento: MouseEvent) => {
    const botao: HTMLButtonElement | null = (evento.target as HTMLElement).closest("button[data-acao]");

    if (botao === null) {
        return;
    }

    const id: number = Number(botao.dataset.id);

    if (botao.dataset.acao === "editar") {
        editarLivro(id);
    } else if (botao.dataset.acao === "excluir") {
        excluirLivro(id);
    }
});

renderizarLivros();



