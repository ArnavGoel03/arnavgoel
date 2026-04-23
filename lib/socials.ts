import type { ComponentType, SVGProps } from "react";
import { InstagramIcon, XIcon } from "@/components/brand-icons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface Social {
  label: string;
  handle: string;
  href: string;
  icon: IconComponent;
}

export const socials: Social[] = [
  {
    label: "Twitter",
    handle: "Add your handle",
    href: "#",
    icon: XIcon,
  },
  {
    label: "Instagram",
    handle: "Add your handle",
    href: "#",
    icon: InstagramIcon,
  },
];
