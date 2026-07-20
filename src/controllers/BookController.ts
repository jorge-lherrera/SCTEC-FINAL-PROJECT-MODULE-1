import { ask } from "../utils/prompt";
import { BookService } from "../services/BookService";
import { parseId } from "../utils/validation";

export class BookController {
  constructor(private readonly service: BookService = new BookService()) {}

  async run(): Promise<void> {
    let running = true;
    while (running) {
      this.showMenu();
      let option: string;
      try {
        option = (await ask("Escolha uma opção: ")).trim();
      } catch {
        break;
      }
      switch (option) {
        case "1":
          await this.create();
          break;
        case "2":
          await this.list();
          break;
        case "3":
          await this.findById();
          break;
        case "4":
          await this.update();
          break;
        case "5":
          await this.remove();
          break;
        case "0":
          running = false;
          break;
        default:
          console.log("\nOpção inválida. Tente novamente.");
      }
    }
  }

  private showMenu(): void {
    console.log("\n----- LIVROS -----");
    console.log("1) Cadastrar livro");
    console.log("2) Listar livros");
    console.log("3) Consultar livro por ID");
    console.log("4) Atualizar livro");
    console.log("5) Remover livro");
    console.log("0) Voltar");
  }

  private async create(): Promise<void> {
    try {
      const title = await ask("Título: ");
      const authorId = parseId(await ask("ID do autor: "), "ID do autor inválido.");
      const publicationYear = this.parseOptionalYear(await ask("Ano de publicação (opcional): "));
      const totalQuantity = this.parseQuantity(await ask("Quantidade total: "));
      const book = await this.service.create({ title, authorId, publicationYear, totalQuantity });
      console.log(`\nLivro cadastrado com sucesso! ID: ${book.id}`);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async list(): Promise<void> {
    try {
      const books = await this.service.list();
      if (books.length === 0) {
        console.log("\nNenhum livro cadastrado.");
        return;
      }
      console.table(books);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async findById(): Promise<void> {
    try {
      const id = parseId(await ask("ID do livro: "), "ID inválido.");
      const book = await this.service.findById(id);
      console.table([book]);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async update(): Promise<void> {
    try {
      const id = parseId(await ask("ID do livro: "), "ID inválido.");
      const current = await this.service.findById(id);
      const title = await ask(`Título (${current.title}): `);
      const authorIdInput = await ask(`ID do autor (${current.authorId}): `);
      const yearInput = await ask(`Ano de publicação (${current.publicationYear ?? ""}): `);
      const quantityInput = await ask(`Quantidade total (${current.totalQuantity}): `);
      const book = await this.service.update(id, {
        title: title.trim() || current.title,
        authorId: authorIdInput.trim() ? parseId(authorIdInput, "ID do autor inválido.") : current.authorId,
        publicationYear: yearInput.trim() ? this.parseOptionalYear(yearInput) : current.publicationYear,
        totalQuantity: quantityInput.trim() ? this.parseQuantity(quantityInput) : current.totalQuantity,
      });
      console.log(`\nLivro atualizado com sucesso! ID: ${book.id}`);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async remove(): Promise<void> {
    try {
      const id = parseId(await ask("ID do livro: "), "ID inválido.");
      await this.service.remove(id);
      console.log("\nLivro removido com sucesso!");
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private parseQuantity(value: string): number {
    const quantity = Number(value);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("A quantidade total deve ser um número inteiro maior que zero.");
    }
    return quantity;
  }

  private parseOptionalYear(value: string): number | null {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null;
    }
    const year = Number(trimmed);
    if (!Number.isInteger(year) || year < 0) {
      throw new Error("Ano de publicação inválido.");
    }
    return year;
  }
}
