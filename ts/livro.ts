// export disponibiliza a classe Livro para os outros módulos do projeto.
// A classe funciona como um modelo para criar objetos do tipo Livro.
export class Livro {
    id: number;
    titulo: string;
    autor: string;
    ano: number | null;
    genero: string;
    resumo: string;
    avaliacao: number;

    // O construtor recebe os dados e cria uma nova instância de Livro.
    constructor(
        id: number,
        titulo: string,
        autor: string,
        ano: number | null,
        genero: string,
        resumo: string,
        avaliacao: number
    ) {
        // "this" representa o objeto que está sendo criado.
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
        this.genero = genero;
        this.resumo = resumo;
        this.avaliacao = avaliacao;
    }
}
