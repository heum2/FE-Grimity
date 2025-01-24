export interface TextFieldProps {
  ref?: React.Ref<HTMLInputElement>;
  placeholder: string;
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  maxLength?: number;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
