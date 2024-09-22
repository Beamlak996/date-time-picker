"use client";

import { useState } from "react";
import { format, addYears } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  enableEthiopian?: boolean;
  showTimePicker?: boolean;
  onChange: (date: Date) => void;
  initialDate?: Date;
}

export function DateTimePicker({
  enableEthiopian = false,
  showTimePicker = true,
  onChange,
  initialDate = new Date(),
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(initialDate);
  const [time, setTime] = useState<string>("12:00");
  const [month, setMonth] = useState(date?.getMonth() ?? 0);
  const [year, setYear] = useState(
    date?.getFullYear() ?? new Date().getFullYear()
  );

  // Update the time when the time picker is changed
  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (date) {
      const [hours, minutes] = newTime.split(":");
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours));
      newDate.setMinutes(parseInt(minutes));
      setDate(newDate);
      onChange(newDate);
    }
  };

  // Update the date and time on date change
  const handleDateChange = (newDate: Date) => {
    const [hours, minutes] = time.split(":");
    newDate.setHours(parseInt(hours), parseInt(minutes));
    setDate(newDate);
    onChange(newDate);
  };

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="flex flex-col">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date ? (
              `${format(date, "PPP")}, ${time}`
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex items-start" align="start">
          <div className="p-2">
            {/* Month Selector */}
            <Select
              defaultValue={String(month)}
              onValueChange={(value) => setMonth(parseInt(value))}
            >
              <SelectTrigger className="font-normal focus:ring-0 w-[120px] my-4 mr-2">
                <SelectValue>{format(new Date(0, month), "MMMM")}</SelectValue>
              </SelectTrigger>
              <SelectContent className="border-none shadow-none mr-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {format(new Date(0, i), "MMMM")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Selector */}
            <Select
              defaultValue={String(year)}
              onValueChange={(value) => setYear(parseInt(value))}
            >
              <SelectTrigger className="font-normal focus:ring-0 w-[120px] my-4 mr-2">
                <SelectValue>{year}</SelectValue>
              </SelectTrigger>
              <SelectContent className="border-none shadow-none mr-2">
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendar */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            fromYear={2000}
            toYear={addYears(new Date(), 100)}
          />

          {/* Time Picker */}
          {showTimePicker && (
            <div className="p-2 flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <Input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
