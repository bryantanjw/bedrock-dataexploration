import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { examplePrompt } from "@/data/example-prompts";

export function PromptExamplesViewer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">What can I ask?</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>What can I ask?</DialogTitle>
          <DialogDescription>
            This app is connected to a range of sample databases which you can
            select from, as follows:
          </DialogDescription>
        </DialogHeader>
        <Accordion type="single" collapsible className="w-full">
          {examplePrompt.map((item) => (
            <AccordionItem value={item.value}>
              <AccordionTrigger>
                <div className="flex gap-4">
                  <span>{item.title}</span>
                  <Badge>{item.badge}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4">
                  <span>
                    <Link
                      href={item.schema}
                      className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
                      target="_blank"
                    >
                      Schema.
                    </Link>
                    {"  "}
                    {item.description}
                  </span>
                  <div className="rounded-md bg-muted p-6">
                    <code className="grid gap-2 text-sm text-slate-800 [&_span]:h-4">
                      {item.prompts.map((example) => (
                        <span>{example}</span>
                      ))}
                    </code>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
