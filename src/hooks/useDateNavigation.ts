import { useState, useEffect } from "react";
import { subDays, addDays, subMonths, addMonths, subYears, addYears } from "date-fns";

interface UseDateNavigationReturn {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPrevYear: () => void;
  onNextYear: () => void;
}

function useDateNavigation(
  initialDate: Date,
  onDateChange: (date: Date) => void,
): UseDateNavigationReturn {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const handlePrevWeek = () => {
    const prevDate = subDays(currentDate, 7);
    setCurrentDate(prevDate);
    onDateChange(prevDate);
  };

  const handleNextWeek = () => {
    const nextDate = addDays(currentDate, 7);
    setCurrentDate(nextDate);
    onDateChange(nextDate);
  };

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentDate, 1);
    setCurrentDate(prevMonth);
    onDateChange(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    setCurrentDate(nextMonth);
    onDateChange(nextMonth);
  };

  const handlePrevYear = () => {
    const prevYear = subYears(currentDate, 1);
    setCurrentDate(prevYear);
    onDateChange(prevYear);
  };

  const handleNextYear = () => {
    const nextYear = addYears(currentDate, 1);
    setCurrentDate(nextYear);
    onDateChange(nextYear);
  };

  useEffect(() => {
    setCurrentDate(initialDate);
  }, [initialDate]);

  return {
    currentDate,
    onPrevWeek: handlePrevWeek,
    onNextWeek: handleNextWeek,
    onPrevMonth: handlePrevMonth,
    onNextMonth: handleNextMonth,
    onPrevYear: handlePrevYear,
    onNextYear: handleNextYear,
  };
}

export default useDateNavigation;
