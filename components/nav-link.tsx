"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

type NavLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  href: string;
};

/**
 * NavLink wraps Next <Link> with an aggressive hover-prefetch.
 * On mouseenter the router prefetches the route immediately — before
 * the user clicks — so the navigation feels instant.
 */
export function NavLink({ href, onMouseEnter, ...props }: NavLinkProps) {
  const router = useRouter();

  function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    router.prefetch(href);
    onMouseEnter?.(e);
  }

  return <Link href={href} onMouseEnter={handleMouseEnter} {...props} />;
}
