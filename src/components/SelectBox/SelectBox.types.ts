export interface SelectBoxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}
