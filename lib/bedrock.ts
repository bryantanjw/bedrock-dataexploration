import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelResponse,
} from "@aws-sdk/client-bedrock-runtime";

interface BedrockInput {
  prompt: string;
  maxlength: number;
  top_k: number;
  top_p: number;
  model: string;
}

interface BedrockResult {
  explanation: string;
  query: string;
}

export async function callBedrock(input: BedrockInput): Promise<BedrockResult> {
  const bedrockBody = createBedrockBody(input);
  console.log("bedrockBody", bedrockBody);
  const client = new BedrockRuntimeClient();
  const commandInput = {
    body: JSON.stringify(bedrockBody),
    contentType: "application/json",
    accept: "*/*",
    modelId: input.model,
  };
  const command = new InvokeModelCommand(commandInput);
  const response = await client.send(command);

  const bedrockResult = extractBedrockResult(response);
  return bedrockResult;
}

function createBedrockBody(input: BedrockInput) {
  return {
    prompt: input.prompt,
    max_tokens_to_sample: input.maxlength,
    temperature: 0,
    top_k: input.top_k,
    top_p: input.top_p,
    stop_sequences: ["\\n\\nHuman:"],
  };
}

function extractBedrockResult(invokeModel: InvokeModelResponse): BedrockResult {
  const bedrockResponse = new TextDecoder().decode(invokeModel.body);
  const startSql = bedrockResponse.indexOf("<query>");
  const endSql = bedrockResponse.indexOf("</query>");
  const startExplanation = bedrockResponse.indexOf("<explanation>");
  const endExplanation = bedrockResponse.indexOf("</explanation>");
  const query = bedrockResponse
    .substring(startSql + "<query>".length, endSql)
    .replaceAll("\\\\n", " ")
    .replaceAll("\n", " ")
    .replaceAll('\\\\"', '"');
  const explanation = bedrockResponse
    .substring(startExplanation + "<explanation>".length, endExplanation)
    .replaceAll("\\\\n", " ")
    .replaceAll("\n", " ")
    .replaceAll('\\\\"', '"');
  return { explanation, query };
}
