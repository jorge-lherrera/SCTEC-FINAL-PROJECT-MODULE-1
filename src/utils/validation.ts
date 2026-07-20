export function parseId(value: string, message = "ID inválido."): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(message);
  }
  return id;
}
