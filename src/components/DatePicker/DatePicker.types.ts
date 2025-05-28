export enum DatePickerMode {
  WEEK = "week",
  MONTH = "month",
}

interface DatePickerProps {
  mode: DatePickerMode;
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export default DatePickerProps;
