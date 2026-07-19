import { pool } from "../database/connection";
import { Book, BookInput } from "../models/Book";

export interface BookWithAuthor extends Book {
  authorName: string;
}

const SELECT_COLUMNS = `id, title, author_id AS "authorId", publication_year AS "publicationYear", total_quantity AS "totalQuantity", available_quantity AS "availableQuantity"`;

export class BookRepository {
  async create(input: BookInput): Promise<Book> {
    const result = await pool.query<Book>(
      `INSERT INTO books (title, author_id, publication_year, total_quantity, available_quantity)
       VALUES ($1, $2, $3, $4, $4)
       RETURNING ${SELECT_COLUMNS}`,
      [input.title, input.authorId, input.publicationYear, input.totalQuantity]
    );
    return result.rows[0];
  }

  async findAll(): Promise<BookWithAuthor[]> {
    const result = await pool.query<BookWithAuthor>(
      `SELECT b.id, b.title, b.author_id AS "authorId", a.name AS "authorName",
              b.publication_year AS "publicationYear",
              b.total_quantity AS "totalQuantity", b.available_quantity AS "availableQuantity"
       FROM books b
       INNER JOIN authors a ON a.id = b.author_id
       ORDER BY b.id`
    );
    return result.rows;
  }

  async findById(id: number): Promise<Book | null> {
    const result = await pool.query<Book>(
      `SELECT ${SELECT_COLUMNS} FROM books WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async update(id: number, input: BookInput, availableQuantity: number): Promise<Book | null> {
    const result = await pool.query<Book>(
      `UPDATE books
       SET title = $1, author_id = $2, publication_year = $3, total_quantity = $4, available_quantity = $5
       WHERE id = $6
       RETURNING ${SELECT_COLUMNS}`,
      [input.title, input.authorId, input.publicationYear, input.totalQuantity, availableQuantity, id]
    );
    return result.rows[0] ?? null;
  }

  async remove(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM books WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
