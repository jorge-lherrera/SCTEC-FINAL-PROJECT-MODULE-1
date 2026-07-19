export type LoanStatus = "ACTIVE" | "RETURNED";

export interface Loan {
  id: number;
  bookId: number;
  customerId: number;
  loanDate: string;
  returnDate: string | null;
  status: LoanStatus;
}

export interface LoanView {
  id: number;
  bookTitle: string;
  customerName: string;
  loanDate: string;
  returnDate: string | null;
  status: LoanStatus;
}
