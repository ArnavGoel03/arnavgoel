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
    handle: "@yashgoel",
    href: "https://twitter.com/yashgoel",
    icon: XIcon,
  },
  {
    label: "Instagram",
    handle: "@yashgoel",
    href: "https://instagram.com/yashgoel",
    icon: InstagramIcon,
  },
];
