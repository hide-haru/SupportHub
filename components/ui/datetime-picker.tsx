"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { format, isValid } from "date-fns";

export function DateTimePicker({
  value,
  onChange,
}: {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [time, setTime] = React.useState("");
  const [tempDate, setTempDate] = React.useState<Date | undefined>(value);
  const [tempTime, setTempTime] = React.useState("");

  React.useEffect(() => {
    if (value && isValid(value)) {
      const hours = value.getHours().toString().padStart(2, "0");
      const minutes = value.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
      setTempTime(`${hours}:${minutes}`);
      setDate(value);
      setTempDate(value);
    }
  }, [value]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value;
    setTempTime(t);
    if (tempDate) {
      const [h, m] = t.split(":").map(Number);
      const newDate = new Date(tempDate);
      newDate.setHours(h);
      newDate.setMinutes(m);
      setTempDate(newDate);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const [h, m] = tempTime ? tempTime.split(":").map(Number) : [0, 0];
    selectedDate.setHours(h);
    selectedDate.setMinutes(m);
    setTempDate(selectedDate);
  };

  const handleConfirm = () => {
    if (tempDate && isValid(tempDate)) {
      setDate(tempDate);
      setTime(tempTime);
      onChange?.(tempDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[250px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date && isValid(date)
            ? format(date, "yyyy-MM-dd HH:mm")
            : <span>日付と時間を選択</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex flex-col space-y-3 p-3">
        <Calendar
          mode="single"
          selected={tempDate}
          onSelect={handleDateSelect}
          initialFocus
        />

        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <input
            type="time"
            value={tempTime}
            onChange={handleTimeChange}
            className="border rounded px-2 py-1 w-[120px]"
          />
        </div>

        {/* ✅ OKボタンを追加 */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleConfirm}
            className="px-4 py-1"
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
