import styles from "./TextField.module.scss";
import { TextFieldProps } from "./TextField.types";
import { forwardRef } from "react";

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      placeholder,
      label,
      isError,
      errorMessage,
      maxLength,
      value,
      onChange,
      required = false,
      onKeyDown,
      onFocus,
    },
    ref
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event);
    };

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) {
        onKeyDown(event);
      }
    };

    return (
      <div className={styles.container}>
        <div className={styles.labelContainer}>
          {required && <p className={styles.required}>*</p>}
          {label && (
            <label className={styles.label} htmlFor="label">
              {label}
            </label>
          )}
        </div>
        <div className={`${styles.inputContainer} ${isError && styles.error}`}>
          <input
            ref={ref}
            className={styles.input}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onKeyDown={handleEnter}
            maxLength={maxLength}
            onFocus={onFocus}
            id="label"
          />
          {value && maxLength && (
            <p className={styles.countTotal}>
              <p className={styles.count}>{value.length}</p>/{maxLength}
            </p>
          )}
        </div>
        {isError && <span className={styles.error}>{errorMessage}</span>}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
