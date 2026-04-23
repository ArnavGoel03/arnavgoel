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
}

export const socials: Social[] = [
  {
    label: "Instagram",
    handle: "@yashgoel03_",
    href: "https://www.instagram.com/yashgoel03_/",
    icon: InstagramIcon,
  },
  {
    label: "YouTube",
    handle: "@nobodytosomeone",
    href: "https://www.youtube.com/@nobodytosomeone",
    icon: YoutubeIcon,
  },
  {
    label: "Spotify",
    handle: "My profile",
    href: "https://open.spotify.com/user/ltemqo3w5mbso5lubgf9j2mfv",
    icon: SpotifyIcon,
  },
];
