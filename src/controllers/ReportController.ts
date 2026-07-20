import { ask } from "../utils/prompt";
import { ReportService } from "../services/ReportService";

export class ReportController {
  constructor(private readonly service: ReportService = new ReportService()) {}

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
          await this.availableBooks();
          break;
        case "2":
          await this.loanedBooks();
          break;
        case "3":
          await this.booksByAuthor();
          break;
        case "4":
          await this.loansByBook();
          break;
        case "5":
          await this.customersWithActiveLoans();
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
    console.log("\n----- RELATÓRIOS -----");
    console.log("1) Livros disponíveis");
    console.log("2) Livros emprestados");
    console.log("3) Livros por autor");
    console.log("4) Livros mais emprestados");
    console.log("5) Clientes com empréstimos ativos");
    console.log("0) Voltar");
  }

  private async availableBooks(): Promise<void> {
    try {
      this.print(await this.service.availableBooks(), "Nenhum livro disponível.");
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async loanedBooks(): Promise<void> {
    try {
      this.print(await this.service.loanedBooks(), "Nenhum livro emprestado.");
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async booksByAuthor(): Promise<void> {
    try {
      this.print(await this.service.booksByAuthor(), "Nenhum autor cadastrado.");
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async loansByBook(): Promise<void> {
    try {
      this.print(await this.service.loansByBook(), "Nenhum empréstimo registrado.");
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async customersWithActiveLoans(): Promise<void> {
    try {
      this.print(await this.service.customersWithActiveLoans(), "Nenhum cliente com empréstimos ativos.");
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private print<T extends object>(rows: T[], emptyMessage: string): void {
    if (rows.length === 0) {
      console.log(`\n${emptyMessage}`);
      return;
    }
    console.table(rows);
  }
}
