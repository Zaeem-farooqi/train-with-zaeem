"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useContactModal } from "@/lib/contact-modal";
import { Magnetic } from "@/components/animations/magnetic";

type BookSessionButtonProps = {
  children: ReactNode;
  className?: string;
  magnetic?: boolean;
  magneticStrength?: number;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "onClick" | "type">;

export function BookSessionButton({
  children,
  className,
  magnetic = true,
  magneticStrength = 0.3,
  ...props
}: BookSessionButtonProps) {
  const { openModal } = useContactModal();

  const button = (
    <button type="button" onClick={openModal} className={className} {...props}>
      {children}
    </button>
  );

  if (!magnetic) return button;

  return (
    <Magnetic strength={magneticStrength} className="pointer-events-auto inline-flex">
      {button}
    </Magnetic>
  );
}
