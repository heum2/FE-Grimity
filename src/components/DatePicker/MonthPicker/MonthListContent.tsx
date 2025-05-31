import { getMonth, getYear, isBefore, startOfMonth } from "date-fns";

import Icon from "@/components/Asset/IconTemp";
import Button from "@/components/Button/Button";
import useDateNavigation from "@/hooks/useDateNavigation";

import { formattedDate } from "@/utils/formatDate";

import styles from "@/components/DatePicker/DatePicker.module.scss";

interface MonthListContentProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onMonthSelect?: () => void;
  isMobile?: boolean;
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

function MonthListContent({
  selectedDate,
  onDateChange,
  onMonthSelect,
  isMobile = false,
}: MonthListContentProps) {
  const { currentDate, onPrevYear, onNextYear } = useDateNavigation(selectedDate, onDateChange);

  const isYearDisabled = !isBefore(startOfMonth(currentDate), startOfMonth(new Date()));

  const today = new Date();
  const currentYear = getYear(currentDate);
  const todayYear = getYear(today);
  const todayMonth = getMonth(today) + 1;

  const isMonthDisabled = (month: number) => {
    return currentYear > todayYear || (currentYear === todayYear && month > todayMonth);
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentYear, month - 1, 1);
    onDateChange(newDate);
    onMonthSelect?.();
  };

  return (
    <div className={isMobile ? styles.monthListBottomSheet : ""}>
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
          leftIcon={<Icon icon="chevronRight" className={isYearDisabled ? styles.disabled : ""} />}
          className={styles.monthListHeaderButton}
          disabled={isYearDisabled}
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
              rightIcon={
                isCurrentMonth &&
                isMobile && <Icon icon="check" className={styles.checkIcon} size="lg" />
              }
              className={`${styles.monthItemText} ${isCurrentMonth ? styles.active : ""}`}
              onClick={() => handleMonthSelect(month)}
            >
              {month}월
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default MonthListContent;
