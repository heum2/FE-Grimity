import styles from "./TextArea.module.scss";
import { forwardRef, useRef, useEffect } from "react";
import { TextAreaProps } from "./TextArea.types";

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      placeholder,
      label,
      isError,
      errorMessage,
      maxLength,
      value,
      onChange,
      onKeyDown,
      onFocus,
      isReply,
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const adjustHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    useEffect(() => {
      adjustHeight();
    }, [value]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (onKeyDown) {
          onKeyDown(event);
        }
      }
    };

    return (
      <div className={styles.container}>
        {label && (
          <div className={styles.labelContainer}>
            <label className={styles.label} htmlFor="label">
              {label}
            </label>
          </div>
        )}
        <div
          className={`${isReply ? styles.inputReplyContainer : styles.inputContainer} ${
            isError && styles.error
          }`}
        >
          <textarea
            ref={(el) => {
              textareaRef.current = el;
              if (ref) {
                if (typeof ref === "function") {
                  ref(el);
                } else {
                  ref.current = el;
                }
              }
            }}
            className={`${isReply ? styles.textareaReply : styles.textarea}`}
            placeholder={placeholder}
            value={value}
            onChange={(event) => {
              onChange(event);
              adjustHeight();
            }}
            onKeyDown={handleKeyPress}
            maxLength={maxLength}
            onFocus={onFocus}
            id="label"
            rows={1}
          />
          {value && maxLength && (
            <div className={styles.countTotal}>
              <span className={styles.count}>{value.length}</span>/{maxLength}
            </div>
          )}
        </div>
        {isError && <span className={styles.errorMessage}>{errorMessage}</span>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
