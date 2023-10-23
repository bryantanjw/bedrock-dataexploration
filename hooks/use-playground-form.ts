import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/form-schema";

export function usePlaygroundForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      database: "",
      model: "anthropic.claude-v2",
      userQuestion: "",
      temperature: 0.9,
      top_p: 1,
      top_k: 250,
      maxlength: 512,
    },
  });

  return form;
}
