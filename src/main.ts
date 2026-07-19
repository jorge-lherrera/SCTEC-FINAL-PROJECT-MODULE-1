import { testConnection, closePool } from "./database/connection";

async function main(): Promise<void> {
  try {
    await testConnection();
    console.log("✅ Conexão com o PostgreSQL estabelecida com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao PostgreSQL:", (error as Error).message);
  } finally {
    await closePool();
  }
}

main();
