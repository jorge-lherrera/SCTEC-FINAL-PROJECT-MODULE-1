import { pool } from "../database/connection";
import { Author, AuthorInput } from "../models/Author";

const SELECT_COLUMNS = `id, name, nationality, birth_date::text AS "birthDate"`;

export class AuthorRepository {
  async create(input: AuthorInput): Promise<Author> {
    const result = await pool.query<Author>(
      `INSERT INTO authors (name, nationality, birth_date)
       VALUES ($1, $2, $3)
       RETURNING ${SELECT_COLUMNS}`,
      [input.name, input.nationality, input.birthDate]
    );
    return result.rows[0];
  }

  async findAll(): Promise<Author[]> {
    const result = await pool.query<Author>(
      `SELECT ${SELECT_COLUMNS} FROM authors ORDER BY id`
    );
    return result.rows;
  }

  async findById(id: number): Promise<Author | null> {
    const result = await pool.query<Author>(
      `SELECT ${SELECT_COLUMNS} FROM authors WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async update(id: number, input: AuthorInput): Promise<Author | null> {
    const result = await pool.query<Author>(
      `UPDATE authors
       SET name = $1, nationality = $2, birth_date = $3
       WHERE id = $4
       RETURNING ${SELECT_COLUMNS}`,
      [input.name, input.nationality, input.birthDate, id]
    );
    return result.rows[0] ?? null;
  }

  async remove(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM authors WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
