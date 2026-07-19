export interface AvailableBookReport {
  id: number;
  title: string;
  authorName: string;
  availableQuantity: number;
}

export interface LoanedBookReport {
  bookTitle: string;
  customerName: string;
  loanDate: string;
}

export interface BooksByAuthorReport {
  authorName: string;
  totalBooks: number;
}

export interface LoansByBookReport {
  bookTitle: string;
  totalLoans: number;
}

export interface ActiveCustomerReport {
  customerName: string;
  activeLoans: number;
}
