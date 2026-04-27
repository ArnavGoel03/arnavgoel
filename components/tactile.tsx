"use client";

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type TactileProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/**
 * Wrapper that fires an 8ms haptic blip on supported devices when the
 * user clicks any child surface. Use around any interactive region
 * where the global :active scale isn't quite enough (e.g. a card that
 * wraps multiple buttons).
 *
 * Works entirely in the client. Safe to render in SSR — `navigator`
 * is only accessed at click time, never at mount.
 */
export function Tactile<T extends ElementType = "div">({
  as,
  children,
  onClick,
  ...props
}: TactileProps<T>) {
  const Tag = (as ?? "div") as ElementType;

  function handleClick(e: React.MouseEvent) {
    // Haptic blip: 8ms is imperceptible as a buzz but registers
    // as a physical confirmation. Guard for browsers / devices
    // that don't support the API.
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(8);
    }
    // Forward any passed onClick.
    (onClick as ((e: React.MouseEvent) => void) | undefined)?.(e);
  }

  return (
    <Tag onClick={handleClick} {...(props as object)}>
      {children}
    </Tag>
  );
}
