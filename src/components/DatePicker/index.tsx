import WeekPicker from "@/components/DatePicker/WeekPicker";
import MonthPicker from "@/components/DatePicker/MonthPicker";

import type DatePickerProps from "@/components/DatePicker/DatePicker.types";
import { DatePickerMode } from "@/components/DatePicker/DatePicker.types";

import styles from "@/components/DatePicker/DatePicker.module.scss";

function DatePicker({ mode, selectedDate = new Date(), onDateChange }: DatePickerProps) {
  return (
    <div className={styles.container}>
      {mode === DatePickerMode.WEEK ? (
        <WeekPicker selectedDate={selectedDate} onDateChange={onDateChange} />
      ) : (
        <MonthPicker selectedDate={selectedDate} onDateChange={onDateChange} />
      )}
    </div>
  );
}

export default DatePicker;
