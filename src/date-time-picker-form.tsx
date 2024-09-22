// DateTimeForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateTimePicker } from "./date-time-picker";

const FormSchema = z.object({
  datetime: z.date({
    required_error: "Date & time is required!",
  }),
});

export function DateTimeForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleDateTimeChange = (date: Date) => {
    form.setValue("datetime", date);
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Form Submitted:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="datetime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date & Time</FormLabel>
              <FormControl>
                <DateTimePicker
                  onChange={handleDateTimeChange}
                  initialDate={field.value}
                  showTimePicker={true}
                />
              </FormControl>
              <FormDescription>
                Select your desired date and time.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
