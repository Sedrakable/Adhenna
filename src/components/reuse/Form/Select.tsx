import React, { useState, useRef, useEffect } from "react";
import styles from "./Select.module.scss";
import cn from "classnames";
import FlexDiv from "../FlexDiv";
import { Paragraph } from "../Paragraph/Paragraph";
import { Icon } from "../Icon";
import { getTranslations } from "@/helpers/langUtils";
import { LangType } from "@/i18n/request";
import { useLocale } from "next-intl";
import { InputWrapper } from "./InputWrapper/InputWrapper";

export interface OptionType {
  value: string;
  label: string;
}

interface SelectProps {
  options: OptionType[];
  // eslint-disable-next-line no-unused-vars
  onChange: (selected: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  defaultValue?: string;
  required?: boolean;
  isInvalid?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  onChange,
  placeholder,
  disabled = false,
  label,
  required = false,
  isInvalid = false,
  defaultValue = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>(defaultValue);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [searchString, setSearchString] = useState("");
  const locale = useLocale() as LangType;
  const translations = getTranslations(locale);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
      setSearchString("");
    }
  }, [isOpen]);

  const scrollOptionIntoView = (index: number) => {
    if (listRef.current && index >= 0) {
      const optionElement = listRef.current.children[index] as HTMLElement;
      if (optionElement) {
        optionElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev < options.length - 1 ? prev + 1 : 0;
          scrollOptionIntoView(nextIndex);
          return nextIndex;
        });
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : options.length - 1;
          scrollOptionIntoView(nextIndex);
          return nextIndex;
        });
        break;
      case "Enter":
        event.preventDefault();
        if (highlightedIndex >= 0) {
          handleOptionClick(options[highlightedIndex].value);
        }
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        break;
      default:
        // Handle letter key presses
        if (event.key.length === 1 && event.key.match(/[a-z0-9]/i)) {
          const newSearchString = searchString + event.key.toLowerCase();
          setSearchString(newSearchString);

          // Clear the previous timeout
          if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
          }

          // Set a new timeout to clear the search string after 1 second
          searchTimeoutRef.current = setTimeout(() => {
            setSearchString("");
          }, 1000);

          // Find the first option that starts with the search string
          const matchingIndex = options.findIndex((option) =>
            option.label.toLowerCase().startsWith(newSearchString)
          );

          if (matchingIndex >= 0) {
            setHighlightedIndex(matchingIndex);
            scrollOptionIntoView(matchingIndex);
          }
        }
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (value: string) => {
    if (!disabled) {
      setSelected(value);
      onChange(value);
      setIsOpen(false);
    }
  };

  return (
    <FlexDiv
      flex={{ direction: "column", x: "flex-start", y: "flex-start" }}
      className={cn(styles.container, { [styles.disabled]: disabled })}
      ref={selectRef}
      gapArray={[2]}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="select-dropdown"
    >
      <InputWrapper label={label!} required={required} isInvalid={isInvalid}>
        <FlexDiv
          className={cn(styles.select, styles.original, {
            [styles.invalid]: isInvalid,
          })}
          onClick={handleToggle}
          flex={{ x: "space-between" }}
          gapArray={[5]}
        >
          <Paragraph
            level="regular"
            color={selected !== "" ? "burgundy" : "light-burgundy"}
          >
            {selected !== ""
              ? options.find((opt) => opt.value === selected)?.label
              : placeholder || translations.select.select}
          </Paragraph>
          <Icon
            icon="arrow"
            color="burgundy"
            size="small"
            rotate={isOpen ? 180 : undefined}
          />
        </FlexDiv>
      </InputWrapper>
      {isOpen && !disabled && (
        <FlexDiv
          flex={{ direction: "column", x: "flex-start", y: "flex-start" }}
          padding={{ vertical: [0, 0, 3, 3] }}
          className={styles.dropdown}
          as="ul"
          ref={listRef}
          role="listbox"
          id="select-dropdown"
        >
          {options.map((option, index) => (
            <FlexDiv
              flex={{ x: "space-between" }}
              width100
              as="li"
              gapArray={[5]}
              padding={{ vertical: [4, 4, 3], horizontal: [4] }}
              className={cn(styles.tab, {
                [styles.highlighted]: index === highlightedIndex,
              })}
              onClick={() => handleOptionClick(option.value)}
              key={option.value}
              role="option"
              aria-selected={option.value === selected}
            >
              <Paragraph level="regular" color="burgundy">
                {option.label}
              </Paragraph>
            </FlexDiv>
          ))}
        </FlexDiv>
      )}
    </FlexDiv>
  );
};
