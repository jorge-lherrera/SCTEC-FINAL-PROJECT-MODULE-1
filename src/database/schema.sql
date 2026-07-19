DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  nationality VARCHAR(50),
  birth_date DATE
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  author_id INTEGER NOT NULL REFERENCES authors (id),
  publication_year INTEGER,
  total_quantity INTEGER NOT NULL DEFAULT 1 CHECK (total_quantity >= 0),
  available_quantity INTEGER NOT NULL DEFAULT 1 CHECK (available_quantity >= 0),
  CONSTRAINT chk_available_max CHECK (available_quantity <= total_quantity)
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20)
);

CREATE TABLE loans (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES books (id),
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  return_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RETURNED'))
);
