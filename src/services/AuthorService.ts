import { AuthorRepository } from "../repositories/AuthorRepository";
import { Author, AuthorInput } from "../models/Author";

export class AuthorService {
  private repository = new AuthorRepository();

  async create(input: AuthorInput): Promise<Author> {
    this.validateName(input.name);
    return this.repository.create(this.normalize(input));
  }

  async list(): Promise<Author[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Author> {
    const author = await this.repository.findById(id);
    if (!author) {
      throw new Error("Autor não encontrado.");
    }
    return author;
  }

  async update(id: number, input: AuthorInput): Promise<Author> {
    this.validateName(input.name);
    const updated = await this.repository.update(id, this.normalize(input));
    if (!updated) {
      throw new Error("Autor não encontrado.");
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.findById(id);
    try {
      await this.repository.remove(id);
    } catch (error) {
      if ((error as { code?: string }).code === "23503") {
        throw new Error("Não é possível remover: o autor possui livros vinculados.");
      }
      throw error;
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("O nome do autor é obrigatório.");
    }
  }

  private normalize(input: AuthorInput): AuthorInput {
    return {
      name: input.name.trim(),
      nationality: input.nationality?.trim() || null,
      birthDate: input.birthDate?.trim() || null,
    };
  }
}
