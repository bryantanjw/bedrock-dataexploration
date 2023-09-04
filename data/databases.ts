export interface Database {
  id: string;
  name: string;
  service: string;
}

export const databases: Database[] = [
  {
    id: "9cb0e66a-9937-465d-a188-2c4c4ae2401f",
    name: "Pagila DVD Rentals",
    service: "RDS",
  },
  {
    id: "61eb0e32-2391-4cd3-adc3-66efe09bc0b7",
    name: "IMDb Graph",
    service: "Neptune",
  },
  {
    id: "a4e1fa51-f4ce-4e45-892c-224030a00bdd",
    name: "TPC-H",
    service: "Athena",
  },
];
