import { pool } from "../database/connection";
import { Loan, LoanView } from "../models/Loan";

const SELECT_COLUMNS = `id, book_id AS "bookId", customer_id AS "customerId", loan_date::text AS "loanDate", return_date::text AS "returnDate", status`;

export class LoanRepository {
  async register(bookId: number, customerId: number): Promise<Loan> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const stock = await client.query(
        `UPDATE books SET available_quantity = available_quantity - 1
         WHERE id = $1 AND available_quantity > 0`,
        [bookId]
      );
      if (stock.rowCount === 0) {
        throw new Error("Livro indisponível para empréstimo.");
      }
      const result = await client.query<Loan>(
        `INSERT INTO loans (book_id, customer_id)
         VALUES ($1, $2)
         RETURNING ${SELECT_COLUMNS}`,
        [bookId, customerId]
      );
      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async registerReturn(loanId: number): Promise<Loan> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query<Loan>(
        `UPDATE loans SET status = 'RETURNED', return_date = CURRENT_DATE
         WHERE id = $1 AND status = 'ACTIVE'
         RETURNING ${SELECT_COLUMNS}`,
        [loanId]
      );
      if (result.rowCount === 0) {
        throw new Error("Empréstimo ativo não encontrado.");
      }
      const loan = result.rows[0];
      await client.query(
        `UPDATE books SET available_quantity = available_quantity + 1 WHERE id = $1`,
        [loan.bookId]
      );
      await client.query("COMMIT");
      return loan;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(id: number): Promise<Loan | null> {
    const result = await pool.query<Loan>(
      `SELECT ${SELECT_COLUMNS} FROM loans WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<LoanView[]> {
    const result = await pool.query<LoanView>(
      `SELECT l.id, b.title AS "bookTitle", c.name AS "customerName",
              l.loan_date::text AS "loanDate", l.return_date::text AS "returnDate", l.status
       FROM loans l
       INNER JOIN books b ON b.id = l.book_id
       INNER JOIN customers c ON c.id = l.customer_id
       ORDER BY l.id`
    );
    return result.rows;
  }
}
