import { LoanRepository } from "../repositories/LoanRepository";
import { BookRepository } from "../repositories/BookRepository";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { Loan, LoanView } from "../models/Loan";

export class LoanService {
  private repository = new LoanRepository();
  private bookRepository = new BookRepository();
  private customerRepository = new CustomerRepository();

  async register(bookId: number, customerId: number): Promise<Loan> {
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new Error("Livro não encontrado.");
    }
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new Error("Cliente não encontrado.");
    }
    if (book.availableQuantity <= 0) {
      throw new Error("Livro indisponível para empréstimo.");
    }
    return this.repository.register(bookId, customerId);
  }

  async registerReturn(loanId: number): Promise<Loan> {
    const loan = await this.repository.findById(loanId);
    if (!loan) {
      throw new Error("Empréstimo não encontrado.");
    }
    if (loan.status === "RETURNED") {
      throw new Error("Este empréstimo já foi devolvido.");
    }
    return this.repository.registerReturn(loanId);
  }

  async list(): Promise<LoanView[]> {
    return this.repository.findAll();
  }
}
