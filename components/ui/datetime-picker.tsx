"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

export function DateTimePicker({
  value,
  onChange,
}: {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}) {
  const [date, setDate] = React.useState<Date | undefined>(value || new Date());
  const [time, setTime] = React.useState("12:00");

  React.useEffect(() => {
    if (value) {
      const hours = value.getHours().toString().padStart(2, "0");
      const minutes = value.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
      setDate(value);
    }
  }, [value]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value;
    setTime(t);
    if (date) {
      const [h, m] = t.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(h);
      newDate.setMinutes(m);
      onChange?.(newDate);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const [h, m] = time.split(":").map(Number);
    selectedDate.setHours(h);
    selectedDate.setMinutes(m);
    setDate(selectedDate);
    onChange?.(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[250px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "yyyy-MM-dd HH:mm") : <span>日付と時間を選択</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col space-y-2 p-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="border rounded px-2 py-1 w-[120px]"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}