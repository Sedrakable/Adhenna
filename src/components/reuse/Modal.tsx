"use client";
import React, { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import styles from "./Modal.module.scss";
import cn from "classnames";
import { Variants, motion } from "motion/react";

import { Backdrop } from "./Backdrop";
import FlexDiv from "./FlexDiv";
import { Button } from "./Button";

export interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  version?: "default" | "image";
}

const dropIn: Variants = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.01,
      type: "spring",
      damping: 100,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

export const Modal: React.FC<ModalProps> = ({
  children,
  onClose,
  version = "default",
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const handleClose = () => {
    // Navigate back to the parent path
    const parentPath = pathname!.split("/").slice(0, -1).join("/");
    router.push(parentPath);
  };

  const close = onClose ? onClose : handleClose;

  return (
    <Backdrop onClick={close}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={cn(styles.modal, styles[version])}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        ref={containerRef}
      >
        <FlexDiv
          className={cn(styles.modalContainer)}
          padding={{ all: [4, 6, 6, 7] }}
        >
          {children}
        </FlexDiv>
        {version != "image" && (
          <FlexDiv
            padding={{ all: [3, 3, 3, 4] }}
            className={styles.closeButtonWrapper}
          >
            <Button
              variant="white"
              small
              iconProps={{ icon: "close", size: "small" }}
              onClick={close}
              aria-label="Close"
            />
          </FlexDiv>
        )}
      </motion.div>
    </Backdrop>
  );
};
