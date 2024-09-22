"use client";

import React, { useState, useEffect } from "react";
import { format, setHours, setMinutes, setSeconds } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { TimePickerDemo } from "./time-picker-demo";

type CalendarType = "gregorian" | "ethiopian";

interface EthiopianDate {
  year: number;
  month: number;
  day: number;
}

interface DateTimePickerProps {
  onChange: (date: Date) => void;
  initialDate?: Date;
  showTimePicker?: boolean;
  enableEthiopian?: boolean;
  yearRange?: number;
}

const ethiopianMonths = [
  "Meskerem",
  "Tikimt",
  "Hidar",
  "Tahsas",
  "Tir",
  "Yekatit",
  "Megabit",
  "Miazia",
  "Ginbot",
  "Sene",
  "Hamle",
  "Nehase",
  "Pagume",
];

// Placeholder conversion functions (replace with accurate implementations)
const convertToEthiopian = (gregorianDate: Date): EthiopianDate => {
  const year = gregorianDate.getFullYear() - 8;
  const month = gregorianDate.getMonth() + 1;
  const day = gregorianDate.getDate();
  return { year, month, day };
};

const convertToGregorian = (ethiopianDate: EthiopianDate): Date => {
  const year = ethiopianDate.year + 8;
  const month = ethiopianDate.month - 1;
  const day = ethiopianDate.day;
  return new Date(year, month, day);
};

const EthiopianGregorianDateTimePicker: React.FC<DateTimePickerProps> = ({
  onChange,
  initialDate = new Date(),
  showTimePicker = true,
  enableEthiopian = false,
  yearRange = 100,
}) => {
  const [gregorianDate, setGregorianDate] = useState<Date>(initialDate);
  const [ethiopianDate, setEthiopianDate] = useState<EthiopianDate>(
    convertToEthiopian(initialDate)
  );
  const [calendarType, setCalendarType] = useState<CalendarType>(
    enableEthiopian ? "ethiopian" : "gregorian"
  );

  useEffect(() => {
    onChange(gregorianDate);
  }, [gregorianDate, onChange]);

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) return;
    if (calendarType === "gregorian") {
      setGregorianDate(newDate);
      setEthiopianDate(convertToEthiopian(newDate));
    } else {
      const ethiopianNewDate = convertToEthiopian(newDate);
      setEthiopianDate(ethiopianNewDate);
      setGregorianDate(convertToGregorian(ethiopianNewDate));
    }
  };

  const handleCalendarTypeChange = (value: string) => {
    setCalendarType(value as CalendarType);
  };

  const handleTimeChange = (newDate: Date | undefined) => {
    if (newDate) {
      setGregorianDate(newDate);
      setEthiopianDate(convertToEthiopian(newDate));
    }
  };

  const formatDate = (date: Date): string => {
    if (calendarType === "gregorian") {
      return format(date, "PPP");
    } else {
      const ethDate = convertToEthiopian(date);
      return `${ethDate.day} ${ethiopianMonths[ethDate.month - 1]} ${
        ethDate.year
      } (Ethiopian)`;
    }
  };

  const handleYearChange = (newYear: number) => {
    if (calendarType === "gregorian") {
      const newDate = new Date(gregorianDate);
      newDate.setFullYear(newYear);
      setGregorianDate(newDate);
      setEthiopianDate(convertToEthiopian(newDate));
    } else {
      const newEthDate = { ...ethiopianDate, year: newYear };
      setEthiopianDate(newEthDate);
      setGregorianDate(convertToGregorian(newEthDate));
    }
  };

  const handleMonthChange = (newMonth: number) => {
    if (calendarType === "gregorian") {
      const newDate = new Date(gregorianDate);
      newDate.setMonth(newMonth);
      setGregorianDate(newDate);
      setEthiopianDate(convertToEthiopian(newDate));
    } else {
      const newEthDate = { ...ethiopianDate, month: newMonth };
      setEthiopianDate(newEthDate);
      setGregorianDate(convertToGregorian(newEthDate));
    }
  };

  const years = Array.from(
    { length: yearRange },
    (_, i) => new Date().getFullYear() - i
  );
  const currentYear =
    calendarType === "gregorian"
      ? gregorianDate.getFullYear()
      : ethiopianDate.year;
  const currentMonth =
    calendarType === "gregorian"
      ? gregorianDate.getMonth()
      : ethiopianDate.month - 1;

  return (
    <div className="flex flex-col items-start space-y-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !gregorianDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {gregorianDate ? (
              formatDate(gregorianDate)
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4">
          <div className="flex flex-row gap-4 items-center mb-4">
            {enableEthiopian && (
              <Select
                onValueChange={handleCalendarTypeChange}
                defaultValue={calendarType}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Calendar Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gregorian">Gregorian</SelectItem>
                  <SelectItem value="ethiopian">Ethiopian</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Select
              value={String(currentYear)}
              onValueChange={(value) => handleYearChange(parseInt(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue>{currentYear}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {calendarType === "ethiopian" ? y - 8 : y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(currentMonth)}
              onValueChange={(value) => handleMonthChange(parseInt(value))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue>
                  {calendarType === "ethiopian"
                    ? ethiopianMonths[currentMonth]
                    : format(new Date(0, currentMonth), "MMMM")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(calendarType === "ethiopian"
                  ? ethiopianMonths
                  : Array.from({ length: 12 })
                ).map((_, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {calendarType === "ethiopian"
                      ? ethiopianMonths[i]
                      : format(new Date(0, i), "MMMM")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Calendar
            mode="single"
            selected={gregorianDate}
            onSelect={handleDateChange}
            initialFocus
            formatters={{
              formatCaption: (date) =>
                calendarType === "ethiopian"
                  ? `${ethiopianMonths[convertToEthiopian(date).month - 1]} ${
                      convertToEthiopian(date).year
                    }`
                  : format(date, "LLLL yyyy"),
              formatDay: (date) =>
                calendarType === "ethiopian"
                  ? convertToEthiopian(date).day.toString()
                  : date.getDate().toString(),
            }}
          />

          {showTimePicker && (
            <div className="pt-4">
              <TimePickerDemo date={gregorianDate} setDate={handleTimeChange} />
            </div>
          )}
        </PopoverContent>
      </Popover>
      <div>
        <p>
          Selected Date: {formatDate(gregorianDate)}{" "}
          {showTimePicker && format(gregorianDate, "HH:mm:ss")}
        </p>
      </div>
    </div>
  );
};

export default EthiopianGregorianDateTimePicker;
