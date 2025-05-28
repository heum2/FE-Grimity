import { subDays, isToday, isBefore, startOfDay } from "date-fns";

import Icon from "@/components/Asset/IconTemp";
import Button from "@/components/Button/Button";
import useDateNavigation from "@/hooks/useDateNavigation";

import { formattedDate } from "@/utils/formatDate";

import styles from "@/components/DatePicker/DatePicker.module.scss";

interface WeekPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

function WeekPicker({ selectedDate, onDateChange }: WeekPickerProps) {
  const { currentDate, onPrevWeek, onNextWeek } = useDateNavigation(selectedDate, onDateChange);

  const isDisabled = !isBefore(startOfDay(currentDate), startOfDay(new Date()));

  return (
    <>
      <Button
        type="outlined-assistive"
        leftIcon={<Icon icon="chevronLeft" />}
        className={styles.iconButton}
        onClick={onPrevWeek}
      />

      <span className={styles.date}>
        {formattedDate(subDays(currentDate, 7))} -{" "}
        {isToday(currentDate) ? "오늘" : formattedDate(currentDate)}
      </span>

      <Button
        type="outlined-assistive"
        leftIcon={<Icon icon="chevronRight" />}
        className={styles.iconButton}
        disabled={isDisabled}
        onClick={onNextWeek}
      />
    </>
  );
}

export default WeekPicker;
