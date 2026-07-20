import { CustomerRepository } from "../repositories/CustomerRepository";
import { Customer, CustomerInput } from "../models/Customer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class CustomerService {
  constructor(private readonly repository: CustomerRepository = new CustomerRepository()) {}

  async create(input: CustomerInput): Promise<Customer> {
    const normalized = this.validate(input);
    await this.ensureEmailIsAvailable(normalized.email, null);
    return this.repository.create(normalized);
  }

  async list(): Promise<Customer[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Customer> {
    const customer = await this.repository.findById(id);
    if (!customer) {
      throw new Error("Cliente não encontrado.");
    }
    return customer;
  }

  async update(id: number, input: CustomerInput): Promise<Customer> {
    await this.findById(id);
    const normalized = this.validate(input);
    await this.ensureEmailIsAvailable(normalized.email, id);
    const updated = await this.repository.update(id, normalized);
    if (!updated) {
      throw new Error("Cliente não encontrado.");
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.findById(id);
    try {
      await this.repository.remove(id);
    } catch (error) {
      if ((error as { code?: string }).code === "23503") {
        throw new Error("Não é possível remover: o cliente possui empréstimos vinculados.");
      }
      throw error;
    }
  }

  private validate(input: CustomerInput): CustomerInput {
    const name = input.name.trim();
    if (name.length === 0) {
      throw new Error("O nome do cliente é obrigatório.");
    }
    const email = input.email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      throw new Error("E-mail inválido.");
    }
    return {
      name,
      email,
      phone: input.phone?.trim() || null,
    };
  }

  private async ensureEmailIsAvailable(email: string, currentId: number | null): Promise<void> {
    const existing = await this.repository.findByEmail(email);
    if (existing && existing.id !== currentId) {
      throw new Error("Já existe um cliente cadastrado com este e-mail.");
    }
  }
}
