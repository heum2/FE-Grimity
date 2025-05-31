import { useState } from "react";

import { getMonth, getYear, isBefore, startOfMonth } from "date-fns";

import Icon from "@/components/Asset/IconTemp";
import Button from "@/components/Button/Button";
import useDateNavigation from "@/hooks/useDateNavigation";

import { formattedDate } from "@/utils/formatDate";

import styles from "@/components/DatePicker/DatePicker.module.scss";

interface MonthPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

function MonthPicker({ selectedDate, onDateChange }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentDate, onPrevMonth, onNextMonth, onPrevYear, onNextYear } = useDateNavigation(
    selectedDate,
    onDateChange,
  );

  const isDisabled = !isBefore(startOfMonth(currentDate), startOfMonth(new Date()));

  const today = new Date();
  const currentYear = getYear(currentDate);
  const todayYear = getYear(today);
  const todayMonth = getMonth(today) + 1;

  const isMonthDisabled = (month: number) => {
    return currentYear > todayYear || (currentYear === todayYear && month > todayMonth);
  };

  const handleToggleMonthList = () => {
    setIsOpen(!isOpen);
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentYear, month - 1, 1);
    onDateChange(newDate);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="outlined-assistive"
        leftIcon={<Icon icon="chevronLeft" />}
        className={`${styles.iconButton} ${styles.prevButton}`}
        onClick={onPrevMonth}
      />

      <Button
        type="text-assistive"
        className={`${styles.date} ${styles.month}`}
        leftIcon={<Icon icon="calendar" className={styles.calendarIcon} />}
        rightIcon={
          <Icon
            icon="chevronDown"
            size="sm"
            className={`${styles.icon} ${isOpen ? styles.open : ""}`}
          />
        }
        onClick={handleToggleMonthList}
      >
        {formattedDate(currentDate, "M")}월
      </Button>

      <Button
        type="outlined-assistive"
        leftIcon={<Icon icon="chevronRight" />}
        className={`${styles.iconButton} ${styles.nextButton}`}
        disabled={isDisabled}
        onClick={onNextMonth}
      />

      <div className={`${styles.monthList} ${isOpen ? styles.open : ""}`}>
        <div className={styles.monthListHeader}>
          <Button
            type="text-assistive"
            leftIcon={<Icon icon="chevronLeft" />}
            className={styles.monthListHeaderButton}
            onClick={onPrevYear}
          />
          <span className={styles.monthListHeaderText}>{formattedDate(currentDate, "yyyy")}</span>
          <Button
            type="text-assistive"
            leftIcon={<Icon icon="chevronRight" className={isDisabled ? styles.disabled : ""} />}
            className={styles.monthListHeaderButton}
            disabled={isDisabled}
            onClick={onNextYear}
          />
        </div>

        <div className={styles.monthItem}>
          {MONTHS.map((month) => {
            const isCurrentMonth = getMonth(currentDate) + 1 === month;
            const disabled = isMonthDisabled(month);

            return (
              <Button
                type={isCurrentMonth ? "text-assistive" : "outlined-assistive"}
                key={month}
                disabled={disabled}
                className={`${styles.monthItemText} ${isCurrentMonth ? styles.active : ""}`}
                onClick={() => handleMonthSelect(month)}
              >
                {month}월
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default MonthPicker;
