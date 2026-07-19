export interface Author {
  id: number;
  name: string;
  nationality: string | null;
  birthDate: string | null;
}

export type AuthorInput = Omit<Author, "id">;
