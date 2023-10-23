export const types = ["Amazon", "Anthropic"] as const;

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
    id: "anthropic.claude-v2",
    name: "claude-v2",
    description:
      "Anthropic's most powerful model, which excels at a wide range of tasks from sophisticated dialogue and creative content generation to detailed instruction following.",
    type: "Anthropic",
    strengths:
      "Question answering, information extraction, removing PII, content generation, multiple choice classification, Roleplay, comparing text, summarization, document Q&A with citation",
  },
  {
    id: "amazon.titan-text-express-v1",
    name: "titan-text-express-v1",
    description:
      "Generative large language model (LLM) for tasks such as summarization, text generation (for example, creating a blog post), classification, open-ended Q&A, and information extraction.",
    type: "Amazon",
    strengths:
      "Open ended text generation, brainstorming, summarization, code generation, table creation, data formatting, paraphrasing, chain of though, rewrite, extraction, Q&A, chat",
  },
];
