import { ask } from "../utils/prompt";
import { AuthorService } from "../services/AuthorService";

export class AuthorController {
  private service = new AuthorService();

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
    console.log("\n----- AUTORES -----");
    console.log("1) Cadastrar autor");
    console.log("2) Listar autores");
    console.log("3) Consultar autor por ID");
    console.log("4) Atualizar autor");
    console.log("5) Remover autor");
    console.log("0) Voltar");
  }

  private async create(): Promise<void> {
    try {
      const name = await ask("Nome: ");
      const nationality = await ask("Nacionalidade (opcional): ");
      const birthDate = await ask("Data de nascimento (AAAA-MM-DD, opcional): ");
      const author = await this.service.create({ name, nationality, birthDate });
      console.log(`\nAutor cadastrado com sucesso! ID: ${author.id}`);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async list(): Promise<void> {
    try {
      const authors = await this.service.list();
      if (authors.length === 0) {
        console.log("\nNenhum autor cadastrado.");
        return;
      }
      console.table(authors);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async findById(): Promise<void> {
    try {
      const id = await this.askId();
      const author = await this.service.findById(id);
      console.table([author]);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async update(): Promise<void> {
    try {
      const id = await this.askId();
      const current = await this.service.findById(id);
      const name = await ask(`Nome (${current.name}): `);
      const nationality = await ask(`Nacionalidade (${current.nationality ?? ""}): `);
      const birthDate = await ask(`Data de nascimento (${current.birthDate ?? ""}): `);
      const author = await this.service.update(id, {
        name: name.trim() || current.name,
        nationality: nationality.trim() || current.nationality,
        birthDate: birthDate.trim() || current.birthDate,
      });
      console.log(`\nAutor atualizado com sucesso! ID: ${author.id}`);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async remove(): Promise<void> {
    try {
      const id = await this.askId();
      await this.service.remove(id);
      console.log("\nAutor removido com sucesso!");
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async askId(): Promise<number> {
    const value = await ask("ID do autor: ");
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID inválido.");
    }
    return id;
  }
}
