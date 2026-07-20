import { ask } from "../utils/prompt";
import { LoanService } from "../services/LoanService";
import { parseId } from "../utils/validation";

export class LoanController {
  constructor(private readonly service: LoanService = new LoanService()) {}

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
          await this.register();
          break;
        case "2":
          await this.registerReturn();
          break;
        case "3":
          await this.list();
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
    console.log("\n----- EMPRÉSTIMOS -----");
    console.log("1) Registrar empréstimo");
    console.log("2) Registrar devolução");
    console.log("3) Listar empréstimos");
    console.log("0) Voltar");
  }

  private async register(): Promise<void> {
    try {
      const bookId = parseId(await ask("ID do livro: "));
      const customerId = parseId(await ask("ID do cliente: "));
      const loan = await this.service.register(bookId, customerId);
      console.log(`\nEmpréstimo registrado com sucesso! ID: ${loan.id}`);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async registerReturn(): Promise<void> {
    try {
      const loanId = parseId(await ask("ID do empréstimo: "));
      const loan = await this.service.registerReturn(loanId);
      console.log(`\nDevolução registrada com sucesso! Empréstimo ID: ${loan.id}`);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async list(): Promise<void> {
    try {
      const loans = await this.service.list();
      if (loans.length === 0) {
        console.log("\nNenhum empréstimo registrado.");
        return;
      }
      console.table(loans);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }
}
