import { ask } from "../utils/prompt";
import { CustomerService } from "../services/CustomerService";

export class CustomerController {
  private service = new CustomerService();

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
    console.log("\n----- CLIENTES -----");
    console.log("1) Cadastrar cliente");
    console.log("2) Listar clientes");
    console.log("3) Consultar cliente por ID");
    console.log("4) Atualizar cliente");
    console.log("5) Remover cliente");
    console.log("0) Voltar");
  }

  private async create(): Promise<void> {
    try {
      const name = await ask("Nome: ");
      const email = await ask("E-mail: ");
      const phone = await ask("Telefone (opcional): ");
      const customer = await this.service.create({ name, email, phone });
      console.log(`\nCliente cadastrado com sucesso! ID: ${customer.id}`);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async list(): Promise<void> {
    try {
      const customers = await this.service.list();
      if (customers.length === 0) {
        console.log("\nNenhum cliente cadastrado.");
        return;
      }
      console.table(customers);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async findById(): Promise<void> {
    try {
      const id = this.parseId(await ask("ID do cliente: "));
      const customer = await this.service.findById(id);
      console.table([customer]);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async update(): Promise<void> {
    try {
      const id = this.parseId(await ask("ID do cliente: "));
      const current = await this.service.findById(id);
      const name = await ask(`Nome (${current.name}): `);
      const email = await ask(`E-mail (${current.email}): `);
      const phone = await ask(`Telefone (${current.phone ?? ""}): `);
      const customer = await this.service.update(id, {
        name: name.trim() || current.name,
        email: email.trim() || current.email,
        phone: phone.trim() || current.phone,
      });
      console.log(`\nCliente atualizado com sucesso! ID: ${customer.id}`);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private async remove(): Promise<void> {
    try {
      const id = this.parseId(await ask("ID do cliente: "));
      await this.service.remove(id);
      console.log("\nCliente removido com sucesso!");
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
  }

  private parseId(value: string): number {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID inválido.");
    }
    return id;
  }
}
