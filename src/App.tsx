"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import EthiopianGregorianDateTimePicker from "./ethiopian-gregoran-date-picker";


// Define the form schema using zod
const FormSchema = z.object({
  datetime: z.date({
    required_error: "Date and time is required.",
  }),
});

export default function App() {
  // Set up react-hook-form with zod validation
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Form Submitted:", data); // Replace with your own logic
  };

  // Handle date change from DateTimePicker
  const handleDateTimeChange = (date: Date) => {
    form.setValue("datetime", date);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Date and Time Form</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* DateTimePicker field */}
          <FormField
            control={form.control}
            name="datetime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Select Date and Time</FormLabel>
                <FormControl>
                  {/* EthiopianGregorianDateTimePicker integration */}
                  <EthiopianGregorianDateTimePicker
                    onChange={handleDateTimeChange}
                    initialDate={field.value || new Date()}
                    showTimePicker={true}
                    enableEthiopian={true} // Set to true if you want Ethiopian calendar option
                  />
                </FormControl>
                <FormDescription>Select a date and time.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
