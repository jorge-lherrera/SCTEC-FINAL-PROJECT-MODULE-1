import { BookRepository, BookWithAuthor } from "../repositories/BookRepository";
import { AuthorRepository } from "../repositories/AuthorRepository";
import { Book, BookInput } from "../models/Book";

export class BookService {
  constructor(
    private readonly repository: BookRepository = new BookRepository(),
    private readonly authorRepository: AuthorRepository = new AuthorRepository()
  ) {}

  async create(input: BookInput): Promise<Book> {
    const normalized = await this.validate(input);
    return this.repository.create(normalized);
  }

  async list(): Promise<BookWithAuthor[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Book> {
    const book = await this.repository.findById(id);
    if (!book) {
      throw new Error("Livro não encontrado.");
    }
    return book;
  }

  async update(id: number, input: BookInput): Promise<Book> {
    const current = await this.findById(id);
    const normalized = await this.validate(input);
    const borrowed = current.totalQuantity - current.availableQuantity;
    const availableQuantity = normalized.totalQuantity - borrowed;
    if (availableQuantity < 0) {
      throw new Error("Não é possível reduzir a quantidade: há exemplares emprestados.");
    }
    const updated = await this.repository.update(id, normalized, availableQuantity);
    if (!updated) {
      throw new Error("Livro não encontrado.");
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.findById(id);
    try {
      await this.repository.remove(id);
    } catch (error) {
      if ((error as { code?: string }).code === "23503") {
        throw new Error("Não é possível remover: o livro possui empréstimos vinculados.");
      }
      throw error;
    }
  }

  private async validate(input: BookInput): Promise<BookInput> {
    const title = input.title.trim();
    if (title.length === 0) {
      throw new Error("O título do livro é obrigatório.");
    }
    if (!Number.isInteger(input.totalQuantity) || input.totalQuantity < 1) {
      throw new Error("A quantidade total deve ser um número inteiro maior que zero.");
    }
    const author = await this.authorRepository.findById(input.authorId);
    if (!author) {
      throw new Error("Autor não encontrado. Cadastre o autor antes do livro.");
    }
    return {
      title,
      authorId: input.authorId,
      publicationYear: input.publicationYear,
      totalQuantity: input.totalQuantity,
    };
  }
}
