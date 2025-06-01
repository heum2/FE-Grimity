import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import DatePicker from "@/components/DatePicker";
import { DatePickerMode } from "@/components/DatePicker/DatePicker.types";

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: { type: "radio" },
      options: [DatePickerMode.WEEK, DatePickerMode.MONTH],
      description: "DatePicker 모드를 선택합니다",
    },
    selectedDate: {
      control: { type: "date" },
      description: "초기 선택된 날짜",
    },
    onDateChange: {
      action: "dateChanged",
      description: "날짜가 변경될 때 호출되는 콜백 함수",
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WeekMode: Story = {
  args: {
    mode: DatePickerMode.WEEK,
    selectedDate: new Date(),
    onDateChange: action("week-date-changed"),
  },
};

export const MonthMode: Story = {
  args: {
    mode: DatePickerMode.MONTH,
    selectedDate: new Date(),
    onDateChange: action("month-date-changed"),
  },
};
