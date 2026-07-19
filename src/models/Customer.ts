export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export type CustomerInput = Omit<Customer, "id">;
