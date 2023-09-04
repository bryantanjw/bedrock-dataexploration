interface ExamplePrompt {
  value: string;
  title: string;
  badge: string;
  schema: string;
  description: string;
  prompts: string[];
}

export const examplePrompt: ExamplePrompt[] = [
  {
    value: "item-1",
    title: "IMDb Graph",
    badge: "Amazon Neptune",
    schema:
      "https://catalog.us-east-1.prod.workshops.aws/workshops/2ae99bf2-10df-444f-a21f-8ad0537a9bdd/en-US/workshop2/opencypher/model",
    description:
      "Try asking questions about movies, their genres, and the artists that worked on them - for example:",
    prompts: [
      "Who's Quentin Tarantino's favourite actor?",
      "How many movies has Robin Williams starred in by genre?",
      "アンジェリーナジョリーの最初の映画はいつか",
    ],
  },
  {
    value: "item-2",
    title: "Pagila DVD Rentals",
    badge: "Amazon RDS",
    schema: "https://dev.mysql.com/doc/sakila/en/sakila-structure.html",
    description:
      "Pagila is a Postgres port of the Sakila sample database, which is designed to represent a DVD rental store. Try asking questions like:",
    prompts: [
      "Show me the name of the 5 customers who rented the most dvds.",
      "Find the 5 actors whose movies have been rented the most.",
      "Welche Filme wurden am meisten ausgeliehen?",
    ],
  },
  {
    value: "item-3",
    title: "TPC-H supply chain",
    badge: "Amazon Athena",
    schema: "https://docs.snowflake.com/en/user-guide/sample-data-tpch",
    description:
      "TPC-H is a supply-chain oriented business decision benchmarking dataset, describing a business' suppliers and part orders. You can ask questions like:",
    prompts: [
      "Which 10 customers from ASEAN placed the most orders?",
      "Show me the top 10 suppliers from Jordan with highest sales.",
      "Montrez-moi le top 5 des produits les plus achetés.",
    ],
  },
  // ... add other items here
];
