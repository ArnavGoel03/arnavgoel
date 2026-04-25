import type { ComponentType, SVGProps } from "react";
import {
  InstagramIcon,
  SpotifyIcon,
  YoutubeIcon,
} from "@/components/brand-icons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface Social {
  label: string;
  handle: string;
  href: string;
  icon: IconComponent;
  /**
   * Tailwind text-color classes applied to the icon glyph itself in
   * its idle state. We keep the chip background neutral (cream/stone)
   * but tint the mark so Instagram reads pink, YouTube red, Spotify
   * green at a glance, the same way the brand pills work for product
   * cards. Hover state still flips to inverse for hit feedback.
   */
  iconColor?: string;
}

export const socials: Social[] = [
  {
    label: "Instagram",
    handle: "@yashgoel03_",
    href: "https://www.instagram.com/yashgoel03_/",
    icon: InstagramIcon,
    iconColor: "text-pink-600 dark:text-pink-400",
  },
  {
    label: "YouTube",
    handle: "@nobodytosomeone",
    href: "https://www.youtube.com/@nobodytosomeone",
    icon: YoutubeIcon,
    iconColor: "text-red-600 dark:text-red-500",
  },
  {
    label: "Spotify",
    handle: "My profile",
    href: "https://open.spotify.com/user/ltemqo3w5mbso5lubgf9j2mfv",
    icon: SpotifyIcon,
    iconColor: "text-green-600 dark:text-green-400",
  },
];
