export const types = ["Amazon", "Anthropic", "OpenAI"] as const;

export type ModelType = (typeof types)[number];

export interface Model<Type = string> {
  id: string;
  name: string;
  description: string;
  strengths?: string;
  type: Type;
}

export const models: Model<ModelType>[] = [
  {
    id: "464a47c3-7ab5-44d7-b669-f9cb5a9e8465",
    name: "anthropic.claude-v1",
    description: "Very capable, but faster and lower cost than Davinci.",
    type: "Anthropic",
    strengths:
      "Language translation, complex classification, sentiment, summarization",
  },
  {
    id: "ac0797b0-7e31-43b6-a494-da7e2ab43445",
    name: "amazon.titan-tg1-large",
    description: "Capable of straightforward tasks, very fast, and lower cost.",
    type: "Amazon",
    strengths: "Moderate classification, semantic search",
  },
  {
    id: "b43c0ea9-5ad4-456a-ae29-26cd77b6d0fb",
    name: "code-davinci-002",
    description:
      "Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code.",
    type: "OpenAI",
  },
  {
    id: "c305f976-8e38-42b1-9fb7-d21b2e34f0da",
    name: "text-davinci-003",
    description:
      "Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.",
    type: "OpenAI",
    strengths:
      "Complex intent, cause and effect, creative generation, search, summarization for audience",
  },
];
