import { format, isValid } from "date-fns";

export function formattedDate(date: string | Date, formatString: string = "yyyy.MM.dd"): string {
  const validDate = new Date(date);

  if (!isValid(validDate)) {
    throw new Error("Invalid date");
  }

  return format(validDate, formatString);
}
