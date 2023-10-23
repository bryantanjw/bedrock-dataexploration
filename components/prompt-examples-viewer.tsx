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
import { Row } from "./ui/row";
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
            select from.
          </DialogDescription>
        </DialogHeader>
        <Accordion type="single" collapsible className="w-full">
          {examplePrompt.map((item, index) => (
            <>
              <AccordionItem key={index} value={item.value}>
                <AccordionTrigger>
                  <div className="flex gap-5">
                    <span>{item.title}</span>
                    <Badge>{item.badge}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-5">
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
                        {item.prompts.map((example, index) => (
                          <span key={index}>{example}</span>
                        ))}
                      </code>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              {index !== examplePrompt.length - 1 && (
                <Row className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
              )}
            </>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
