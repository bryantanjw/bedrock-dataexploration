"use client";

import { useState } from "react";
import Image from "next/image";
import * as z from "zod";

import {
  CheckCircledIcon,
  CheckIcon,
  CopyIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { PromptExamplesViewer } from "@/components/prompt-examples-viewer";
import { MaxLengthSelector } from "@/components/selectors/maxlength-selector";
import { ModelSelector } from "@/components/selectors/model-selector";
import { DatabaseSelector } from "@/components/selectors/database-selector";
import { TemperatureSelector } from "@/components/selectors/temperature-selector";
import { TopPSelector } from "@/components/selectors/top-p-selector";
import { TopKSelector } from "@/components/selectors/top-k-selector";
import { useToast } from "./ui/use-toast";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { formSchema } from "@/lib/form-schema";
import { usePlaygroundForm } from "@/hooks/use-playground-form";
import { DataTable } from "./data-table";
import { formatTable } from "@/lib/utils";

export default function Playground() {
  // Form states
  const form = usePlaygroundForm();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [bedrockResult, setBedrockResult] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    if (!values.database) {
      toast({
        title: "Select a database.",
      });
      setSubmitting(false);
      return;
    }

    const endpoint = "/api/explore";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    };

    let data = null;

    try {
      const response = await fetch(endpoint, options);
      data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      setBedrockResult(data);
      if (data) {
        const [newColumns, newData] = formatTable(
          data.columnNames,
          data.values
        );
        setColumns(newColumns);
        setData(newData);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "An error occurred",
      });
      setSubmitting(false);
    }

    setSubmitting(false);

    // After 2 seconds of image generation success, restore button to default state
    setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
            <h2 className="text-lg font-semibold flex-shrink-0">
              Bedrock Data Explorer
            </h2>
            <div className="ml-auto flex w-full space-x-2 sm:justify-end">
              <DatabaseSelector form={form} />
              <div className="hidden space-x-2 md:flex">
                <PromptExamplesViewer />
              </div>
            </div>
          </div>
          <Separator />
          <div className="container h-full py-6 flex-1 max-w-5xl">
            <div className="grid h-full items-stretch gap-10 md:grid-cols-[1fr_200px] lg:grid-cols-[1fr_270px]">
              <div className="hidden flex-col space-y-4 sm:flex md:order-2">
                <ModelSelector form={form} />
                <TemperatureSelector form={form} />
                <MaxLengthSelector form={form} />
                <TopPSelector form={form} />
                <TopKSelector form={form} />
              </div>
              <div className="md:order-1">
                <div className="mt-0 border-0 p-0">
                  <div className="flex flex-col space-y-5">
                    <div className="grid h-full gap-5">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="input">Input</Label>
                        <FormField
                          control={form.control}
                          name="userQuestion"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative">
                                  <Textarea
                                    id="input"
                                    className="h-full min-h-[90px]"
                                    placeholder="How many movies has Robin Williams starred?"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="relative min-h-[200px] rounded-md border bg-muted px-3 py-2">
                        {bedrockResult && (
                          <code className="text-sm w-[90%] block">
                            {bedrockResult.query}
                          </code>
                        )}

                        <Button
                          size="sm"
                          className="absolute top-3 right-3"
                          onClick={async (event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            if (bedrockResult && bedrockResult.query) {
                              await navigator.clipboard.writeText(
                                bedrockResult.query
                              );
                              setIsCopied(true);
                              setTimeout(() => {
                                setIsCopied(false);
                              }, 2000);
                            }
                          }}
                        >
                          <span className="sr-only">Copy</span>
                          {isCopied ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : (
                            <CopyIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-row items-center space-x-2">
                      {isSuccess ? (
                        <Button
                          className="w-full lg:w-auto min-w-[110px] duration-150 bg-green-500 hover:bg-green-600 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 active:scale-100 active:bg-green-800 active:text-green-100"
                          style={{
                            boxShadow:
                              "0px 1px 4px rgba(27, 71, 13, 0.17), inset 0px 0px 0px 1px #5fc767, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <CheckCircledIcon className="h-5 w-5" />
                        </Button>
                      ) : (
                        <Button
                          disabled={isSubmitting}
                          onClick={async (event) => {
                            event.preventDefault();
                            onSubmit(form.getValues());
                          }}
                          className="w-full lg:w-auto min-w-[110px] duration-150 hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] active:scale-95 scale-100 duration-75 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <div className="flex items-center justify-center gap-x-2">
                              <Image
                                className="filter invert dark:filter-none lg:-ml-1"
                                width={18}
                                height={18}
                                src={"/sparkling-icon.png"}
                                alt={"Generate"}
                              />
                              <span>Generate</span>
                            </div>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>

      {columns.length > 0 && data.length > 0 && (
        <div className="container h-full py-6 flex-1 max-w-5xl mb-12">
          <Label>Records</Label>
          <DataTable columns={columns} data={data} />
        </div>
      )}
    </div>
  );
}
