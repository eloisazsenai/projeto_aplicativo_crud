"use strict";
// A classe representa um livro e define os tipos de cada atributo.
class Livro {
    constructor(id, titulo, autor, ano, genero, resumo) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
        this.genero = genero;
        this.resumo = resumo;
    }
}
const form = document.querySelector("#form-livro");
const tituloInput = document.querySelector("#titulo");
const autorInput = document.querySelector("#autor");
const anoInput = document.querySelector("#ano");
const generoInput = document.querySelector("#genero");
const resumoInput = document.querySelector("#resumo");
const listaLivros = document.querySelector("#div-lista-livros");
const contadorLivros = document.querySelector("#contador-livros");
const botaoAdicionar = document.querySelector("#adicionar");
const modoFormulario = document.querySelector("#modo-formulario");
const mensagem = document.querySelector("#mensagem");
// Os registros ficam em memória, conforme permitido pelo enunciado.
let livros = [];
let idEmEdicao = null;
let tempoMensagem;
function escaparHtml(texto) {
    const elemento = document.createElement("div");
    elemento.textContent = texto;
    return elemento.innerHTML;
}
function renderizarLivros() {
    const quantidade = livros.length;
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
        const cartao = document.createElement("article");
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
function mostrarMensagem(texto) {
    window.clearTimeout(tempoMensagem);
    mensagem.textContent = texto;
    mensagem.classList.add("visivel");
    tempoMensagem = window.setTimeout(() => mensagem.classList.remove("visivel"), 2600);
}
function limparModoEdicao() {
    idEmEdicao = null;
    botaoAdicionar.textContent = "Adicionar livro";
    modoFormulario.textContent = "Cadastro";
}
function cadastrarOuEditarLivro(evento) {
    evento.preventDefault();
    const anoDigitado = anoInput.value;
    const ano = anoDigitado === "" ? null : Number(anoDigitado);
    const livroPreenchido = new Livro(idEmEdicao ?? Date.now(), tituloInput.value, autorInput.value, ano, generoInput.value, resumoInput.value);
    // Estrutura de decisão: cadastra um novo livro ou atualiza o existente.
    if (idEmEdicao === null) {
        livros.push(livroPreenchido);
        mostrarMensagem("Livro adicionado à estante.");
    }
    else {
        const indice = livros.findIndex((livro) => livro.id === idEmEdicao);
        if (indice !== -1) {
            livros[indice] = livroPreenchido;
        }
        mostrarMensagem("Livro atualizado com sucesso.");
    }
    form.reset();
    limparModoEdicao();
    renderizarLivros();
}
function editarLivro(id) {
    const livro = livros.find((item) => item.id === id);
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
function excluirLivro(id) {
    const livro = livros.find((item) => item.id === id);
    if (livro === undefined || !window.confirm(`Deseja excluir o livro "${livro.titulo}"?`)) {
        return;
    }
    livros = livros.filter((item) => item.id !== id);
    if (idEmEdicao === id) {
        form.reset();
        limparModoEdicao();
    }
    renderizarLivros();
    mostrarMensagem("Livro excluído da estante.");
}
form.addEventListener("submit", cadastrarOuEditarLivro);
form.addEventListener("reset", () => window.setTimeout(limparModoEdicao, 0));
listaLivros.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-acao]");
    if (botao === null) {
        return;
    }
    const id = Number(botao.dataset.id);
    if (botao.dataset.acao === "editar") {
        editarLivro(id);
    }
    else if (botao.dataset.acao === "excluir") {
        excluirLivro(id);
    }
});
renderizarLivros();
