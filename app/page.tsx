import { Metadata } from "next";

import { CounterClockwiseClockIcon, CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { PromptExamplesViewer } from "@/components/prompt-examples-viewer";
import { MaxLengthSelector } from "@/components/maxlength-selector";
import { ModelSelector } from "@/components/model-selector";
import { DatabaseSelector } from "@/components/database-selector";
import { TemperatureSelector } from "@/components/temperature-selector";
import { TopPSelector } from "@/components/top-p-selector";
import { models, types } from "@/data/models";
import { databases } from "@/data/databases";

export const metadata: Metadata = {
  title: "LLM Data Explorer",
  description: "The OpenAI Playground built using the components.",
};

export default function PlaygroundPage() {
  return (
    <div className="h-full flex-col md:flex">
      <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h2 className="text-lg font-semibold flex-shrink-0">
          LLM Data Explorer
        </h2>
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <DatabaseSelector databases={databases} />
          <div className="hidden space-x-2 md:flex">
            <PromptExamplesViewer />
          </div>
        </div>
      </div>
      <Separator />
      <div className="container h-full py-6 flex-1">
        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px] lg:grid-cols-[1fr_270px]">
          <div className="hidden flex-col space-y-4 sm:flex md:order-2">
            <ModelSelector types={types} models={models} />
            <TemperatureSelector defaultValue={[0.56]} />
            <MaxLengthSelector defaultValue={[256]} />
            <TopPSelector defaultValue={[0.9]} />
          </div>
          <div className="md:order-1">
            <div className="mt-0 border-0 p-0">
              <div className="flex flex-col space-y-4">
                <div className="grid h-full grid-rows-2 gap-6">
                  <Textarea
                    placeholder="How many movies has Robin Williams starred in by genre?"
                    className="h-full min-h-[100px]"
                  />
                  <div className="relative min-h-[200px] rounded-md border bg-muted">
                    <Button
                      type="submit"
                      size="sm"
                      className="absolute top-4 right-4"
                    >
                      <span className="sr-only">Copy</span>
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button>Submit</Button>
                  <Button variant="secondary">
                    <span className="sr-only">Show history</span>
                    <CounterClockwiseClockIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
