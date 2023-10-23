import { Metadata } from "next";
import Playground from "@/components/playground";

export const metadata: Metadata = {
  title: "Bedrock Data Explorer",
  description:
    "Explore structured data with natural language using Amazon Bedrock.",
};

export default function PlaygroundPage() {
  return (
    <div className="h-full flex-col md:flex">
      <Playground />
    </div>
  );
}
