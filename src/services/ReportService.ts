import { ReportRepository } from "../repositories/ReportRepository";
import {
  AvailableBookReport,
  LoanedBookReport,
  BooksByAuthorReport,
  LoansByBookReport,
  ActiveCustomerReport,
} from "../models/Report";

export class ReportService {
  private repository = new ReportRepository();

  availableBooks(): Promise<AvailableBookReport[]> {
    return this.repository.availableBooks();
  }

  loanedBooks(): Promise<LoanedBookReport[]> {
    return this.repository.loanedBooks();
  }

  booksByAuthor(): Promise<BooksByAuthorReport[]> {
    return this.repository.booksByAuthor();
  }

  loansByBook(): Promise<LoansByBookReport[]> {
    return this.repository.loansByBook();
  }

  customersWithActiveLoans(): Promise<ActiveCustomerReport[]> {
    return this.repository.customersWithActiveLoans();
  }
}
