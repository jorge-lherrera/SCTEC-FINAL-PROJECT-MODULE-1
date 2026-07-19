import { pool } from "../database/connection";
import { Customer, CustomerInput } from "../models/Customer";

const SELECT_COLUMNS = `id, name, email, phone`;

export class CustomerRepository {
  async create(input: CustomerInput): Promise<Customer> {
    const result = await pool.query<Customer>(
      `INSERT INTO customers (name, email, phone)
       VALUES ($1, $2, $3)
       RETURNING ${SELECT_COLUMNS}`,
      [input.name, input.email, input.phone]
    );
    return result.rows[0];
  }

  async findAll(): Promise<Customer[]> {
    const result = await pool.query<Customer>(
      `SELECT ${SELECT_COLUMNS} FROM customers ORDER BY id`
    );
    return result.rows;
  }

  async findById(id: number): Promise<Customer | null> {
    const result = await pool.query<Customer>(
      `SELECT ${SELECT_COLUMNS} FROM customers WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const result = await pool.query<Customer>(
      `SELECT ${SELECT_COLUMNS} FROM customers WHERE email = $1`,
      [email]
    );
    return result.rows[0] ?? null;
  }

  async update(id: number, input: CustomerInput): Promise<Customer | null> {
    const result = await pool.query<Customer>(
      `UPDATE customers
       SET name = $1, email = $2, phone = $3
       WHERE id = $4
       RETURNING ${SELECT_COLUMNS}`,
      [input.name, input.email, input.phone, id]
    );
    return result.rows[0] ?? null;
  }

  async remove(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM customers WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
