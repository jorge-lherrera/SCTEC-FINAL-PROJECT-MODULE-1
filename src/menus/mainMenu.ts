import { ask } from "../utils/prompt";
import { AuthorController } from "../controllers/AuthorController";

const authorController = new AuthorController();

function showMainMenu(): void {
  console.log("\n===== BOOKSTORE MANAGER =====");
  console.log("1) Autores");
  console.log("2) Livros");
  console.log("3) Clientes");
  console.log("4) Empréstimos");
  console.log("5) Relatórios");
  console.log("0) Sair");
}

export async function runMainMenu(): Promise<void> {
  let running = true;
  while (running) {
    showMainMenu();
    let option: string;
    try {
      option = (await ask("Escolha uma opção: ")).trim();
    } catch {
      break;
    }
    switch (option) {
      case "1":
        await authorController.run();
        break;
      case "2":
      case "3":
      case "4":
      case "5":
        console.log("\nMódulo em construção.");
        break;
      case "0":
        console.log("\nEncerrando a aplicação. Até logo!");
        running = false;
        break;
      default:
        console.log("\nOpção inválida. Tente novamente.");
    }
  }
}
