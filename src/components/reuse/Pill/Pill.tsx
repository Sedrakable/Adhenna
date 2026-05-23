import React, {
  useState,
  FC,
  PropsWithChildren,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import styles from "./Pill.module.scss";
import cn from "classnames";
import { Icon } from "../Icon";
import FlexDiv from "../FlexDiv";
import { josefin } from "../Heading";

export interface PillProps {
  initialValue?: number;
  max?: number;
  onChange?: (value: number) => void;
  version?: "1" | "2";
}

export const Pill: FC<PropsWithChildren<PillProps>> = ({
  initialValue = 1,
  max = 99,
  onChange,
  version = "1",
}) => {
  const [value, setValue] = useState<number | "">(() =>
    initialValue === undefined ? "" : initialValue,
  );

  const handleIncrement = () => {
    const newValue = (typeof value === "number" ? value : 0) + 1;
    setValue(newValue > max ? max : newValue);
    if (onChange) {
      onChange(newValue > max ? max : newValue);
    }
  };

  const handleDecrement = () => {
    if (typeof value === "number" && value > 1) {
      const newValue = value - 1;
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value ? Number(event.target.value) : 0;
    if (newValue > max) {
      newValue = max;
    }
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    if (value === "" || (typeof value === "number" && value < 0)) {
      setValue(0);
      if (onChange) {
        onChange(0);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <FlexDiv
      className={cn(styles.pill, styles[`version${version}`])}
      padding={{ horizontal: [4], vertical: [2] }}
      gapArray={[3, 4, 4, 4]}
    >
      <button
        className={cn(styles.minus, {
          [styles.disabled]: typeof value === "number" && value === 0,
        })}
        onClick={handleDecrement}
        aria-label="Decrement"
      >
        <Icon icon="minus" size="small" />
      </button>
      <input
        type="number"
        className={cn(styles.value, josefin.className)}
        value={value === "" ? "" : value.toString()}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        max={max}
        aria-label="number of items"
      />
      <button
        className={styles.plus}
        onClick={handleIncrement}
        aria-label="Increment"
      >
        <Icon icon="plus" size="small" />
      </button>
    </FlexDiv>
  );
};
