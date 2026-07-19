import { pool } from "../database/connection";
import {
  AvailableBookReport,
  LoanedBookReport,
  BooksByAuthorReport,
  LoansByBookReport,
  ActiveCustomerReport,
} from "../models/Report";

export class ReportRepository {
  async availableBooks(): Promise<AvailableBookReport[]> {
    const result = await pool.query<AvailableBookReport>(
      `SELECT b.id, b.title, a.name AS "authorName", b.available_quantity AS "availableQuantity"
       FROM books b
       INNER JOIN authors a ON a.id = b.author_id
       WHERE b.available_quantity > 0
       ORDER BY b.title`
    );
    return result.rows;
  }

  async loanedBooks(): Promise<LoanedBookReport[]> {
    const result = await pool.query<LoanedBookReport>(
      `SELECT b.title AS "bookTitle", c.name AS "customerName", l.loan_date::text AS "loanDate"
       FROM loans l
       INNER JOIN books b ON b.id = l.book_id
       INNER JOIN customers c ON c.id = l.customer_id
       WHERE l.status = 'ACTIVE'
       ORDER BY l.loan_date`
    );
    return result.rows;
  }

  async booksByAuthor(): Promise<BooksByAuthorReport[]> {
    const result = await pool.query<BooksByAuthorReport>(
      `SELECT a.name AS "authorName", COUNT(b.id)::int AS "totalBooks"
       FROM authors a
       LEFT JOIN books b ON b.author_id = a.id
       GROUP BY a.id, a.name
       ORDER BY "totalBooks" DESC, a.name`
    );
    return result.rows;
  }

  async loansByBook(): Promise<LoansByBookReport[]> {
    const result = await pool.query<LoansByBookReport>(
      `SELECT b.title AS "bookTitle", COUNT(l.id)::int AS "totalLoans"
       FROM books b
       INNER JOIN loans l ON l.book_id = b.id
       GROUP BY b.id, b.title
       ORDER BY "totalLoans" DESC
       LIMIT 10`
    );
    return result.rows;
  }

  async customersWithActiveLoans(): Promise<ActiveCustomerReport[]> {
    const result = await pool.query<ActiveCustomerReport>(
      `SELECT c.name AS "customerName", COUNT(l.id)::int AS "activeLoans"
       FROM customers c
       INNER JOIN loans l ON l.customer_id = c.id
       WHERE l.status = 'ACTIVE'
       GROUP BY c.id, c.name
       ORDER BY "activeLoans" DESC, c.name`
    );
    return result.rows;
  }
}
