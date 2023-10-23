import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTable(columns: string[], values: any[]) {
  const mappedColumns = columns.map((columnName) => ({
    id: columnName,
    Header: columnName,
    accessorKey: columnName,
  }));

  const mappedValues = values.slice(1).map((valueArray) =>
    valueArray.reduce((row, value, index) => {
      row[mappedColumns[index].accessorKey] = value;
      return row;
    }, {})
  );

  return [mappedColumns, mappedValues];
}
