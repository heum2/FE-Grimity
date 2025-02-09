export interface TextAreaProps {
  ref?: React.Ref<HTMLTextAreaElement>;
  placeholder: string;
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  maxLength?: number;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  isReply?: boolean;
}
