import { useEffect, useRef, useState } from "react";
import styles from "./SelectBox.module.scss";
import { SelectBoxProps } from "./SelectBox.types";
import IconComponent from "../Asset/Icon";

export function SelectBox({ options, value, onChange }: SelectBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((opt) => opt.value === value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      <div className={styles.selected} onClick={() => setIsOpen((prev) => !prev)}>
        {selected?.label}
        <span className={styles.icon}>
          <IconComponent name={isOpen ? "arrowUp" : "arrowDown"} size={16} isBtn />
        </span>
      </div>
      {isOpen && (
        <ul className={styles.options}>
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={opt.value === value ? styles.active : ""}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
