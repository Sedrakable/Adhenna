"use client";
import React, { PropsWithChildren, ButtonHTMLAttributes, FC } from "react";
import styles from "./Button.module.scss";
import cn from "classnames";
import Link, { LinkProps } from "next/link";
import { Icon, IconProps } from "./Icon";
import { Paragraph } from "./Paragraph/Paragraph";
import { useWindowResize } from "@/helpers/useWindowResize";

interface ButtonIconProps extends IconProps {
  side?: "left" | "right";
}

export interface ButtonProps {
  variant: "primary" | "transparent" | "white" | "extra";
  small?: boolean;
  fit?: "grow" | "shrink";
  iconProps?: ButtonIconProps;
  // eslint-disable-next-line no-unused-vars
  onClick?: (() => void) | ((event: MouseEvent) => void);
  path?: string;
  href?: string;
  disabled?: boolean;
  className?: string;
  target?: React.HTMLAttributeAnchorTarget;
}

export const Button: FC<PropsWithChildren<
  ButtonProps & (ButtonHTMLAttributes<HTMLButtonElement> | LinkProps)
>> = ({
  children,
  variant,
  iconProps,
  path,
  href,
  disabled,
  small,
  fit,
  target,
  onClick,
  ...props
}) => {
  const { isMobile } = useWindowResize();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      if (onClick.length === 0) {
        (onClick as () => void)();
      } else {
        // eslint-disable-next-line no-unused-vars
        (onClick as (event: React.MouseEvent<HTMLButtonElement>) => void)(
          event
        );
      }
    }
  };

  const ButtonHeading: React.FC = () => (
    <Paragraph
      level="regular"
      textAlign="center"
      color={variant === "primary" ? "cream-white" : "burgundy"}
      className={styles.textWrapper}
    >
      {children as string}
    </Paragraph>
  );

  const iconElement = iconProps && <Icon {...iconProps} color="burgundy" />;
  const buttonContent = (
    <>
      {iconProps?.side === "left" && iconElement}
      {children && <ButtonHeading />}
      {(!iconProps?.side || iconProps.side === "right") && iconElement}
    </>
  );

  const buttonStyles = cn(styles.button, styles[variant], {
    [styles.small]: small,
    [styles.onlyIcon]: iconProps && !children,
    [styles.withIcon]: iconProps && children,
    [styles.iconLeft]: iconProps?.side === "left",
    [styles.iconRight]: !iconProps?.side || iconProps.side === "right",
    [styles.disabled]: disabled,
  });

  const buttonProps = {
    className: buttonStyles,
    style: {
      width:
        fit === "shrink"
          ? "auto"
          : fit === "grow" || isMobile
          ? "100%"
          : "auto",
    },
    "aria-label": children ? (children as string) : props["aria-label"],
  };

  if (path) {
    return (
      <Link
        href={path}
        {...buttonProps}
        target={target}
        onClick={(e) => handleClick(e as any)}
      >
        {buttonContent}
      </Link>
    );
  } else if (href) {
    return (
      <a
        {...buttonProps}
        href={href}
        target={target || "_blank"}
        rel="noopener noreferrer"
      >
        {buttonContent}
      </a>
    );
  } else {
    return (
      <button
        {...buttonProps}
        onClick={handleClick}
        disabled={disabled}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {buttonContent}
      </button>
    );
  }
};
