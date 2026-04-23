import type { ComponentType, SVGProps } from "react";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  XIcon,
} from "@/components/brand-icons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface Social {
  label: string;
  handle: string;
  href: string;
  icon: IconComponent;
}

export const socials: Social[] = [
  {
    label: "GitHub",
    handle: "@ArnavGoel03",
    href: "https://github.com/ArnavGoel03",
    icon: GithubIcon,
  },
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
  {
    label: "LinkedIn",
    handle: "Yash Goel",
    href: "https://linkedin.com/in/yashgoel",
    icon: LinkedinIcon,
  },
  {
    label: "Email",
    handle: "yashgoel0304@gmail.com",
    href: "mailto:yashgoel0304@gmail.com",
    icon: MailIcon,
  },
];
