/**
 * Indexes rows by their id, to look them up while enriching another list
 * (e.g. standings with their teams, scorers with their players).
 * @param rows - The rows to index
 * @returns A map from each row's id to the row
 */
export const indexById = <T extends { id: number }>(
  rows: T[]
): Map<number, T> => new Map(rows.map((row) => [row.id, row]));
