// import permite que este módulo use a classe definida em livro.ts.
import { Livro } from "./livro.js";
// Nome usado para identificar os dados desta aplicação dentro do Local Storage.
const CHAVE_LOCAL_STORAGE = "minha-estante-livros";
// export permite que cadastro.ts utilize esta função.
// A função busca no Local Storage o texto JSON que representa o array de livros.
export function carregarLivros() {
    const dadosSalvos = localStorage.getItem(CHAVE_LOCAL_STORAGE);
    // Se ainda não houver dados salvos, devolve um array vazio.
    if (dadosSalvos === null) {
        return [];
    }
    try {
        // JSON.parse transforma o texto salvo novamente em um array de objetos.
        const livrosSalvos = JSON.parse(dadosSalvos);
        // Recria cada objeto usando a classe Livro para manter o mesmo modelo do cadastro.
        return livrosSalvos.map((livro) => {
            // Livros salvos antes da criação deste campo recebem 0, que significa "sem avaliação".
            const avaliacaoValida = Number.isInteger(livro.avaliacao)
                && livro.avaliacao >= 1
                && livro.avaliacao <= 5
                ? livro.avaliacao
                : 0;
            return new Livro(livro.id, livro.titulo, livro.autor, livro.ano, livro.genero, livro.resumo, avaliacaoValida);
        });
    }
    catch {
        // Se os dados estiverem inválidos, evita que a aplicação pare de funcionar.
        return [];
    }
}
// export permite que cadastro.ts chame esta função depois de alterar o array.
// JSON.stringify converte os livros em texto antes de salvá-los no navegador.
export function salvarLivros(livros) {
    localStorage.setItem(CHAVE_LOCAL_STORAGE, JSON.stringify(livros));
}
