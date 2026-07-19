export interface Book {
  id: number;
  title: string;
  authorId: number;
  publicationYear: number | null;
  totalQuantity: number;
  availableQuantity: number;
}

export type BookInput = {
  title: string;
  authorId: number;
  publicationYear: number | null;
  totalQuantity: number;
};
