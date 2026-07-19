import { testConnection, closePool } from "./database/connection";
import { runMainMenu } from "./menus/mainMenu";
import { closePrompt } from "./utils/prompt";

async function main(): Promise<void> {
  try {
    await testConnection();
    console.log("Conexão com o PostgreSQL estabelecida com sucesso!");
    await runMainMenu();
  } catch (error) {
    console.error("Erro na aplicação:", (error as Error).message);
  } finally {
    closePrompt();
    await closePool();
  }
}

main();
