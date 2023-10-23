export interface Database {
  id: string;
  name: string;
  service: string;
}

export const databases: Database[] = [
  {
    id: "Pagila DVD Rentals (RDS)",
    name: "Pagila DVD Rentals",
    service: "RDS",
  },
  {
    id: "IMDb Graph (Neptune)",
    name: "IMDb Graph",
    service: "Neptune",
  },
  {
    id: "TPC-H (Athena)",
    name: "TPC-H",
    service: "Athena",
  },
];
