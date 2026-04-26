/**
 * The /uses page data. Every piece of hardware, software, and service
 * the author actually uses, grouped into editorial sections.
 *
 * Convention: the `link` field points to the canonical product or
 * project page (manufacturer site preferred over marketplace). Add new
 * items by appending; the page renders sections in array order.
 */

export type UsesItem = {
  name: string;
  detail?: string;
  link?: string;
  /** Optional internal cross-link to a review elsewhere on the site. */
  reviewHref?: string;
};

export type UsesSection = {
  label: string;
  blurb?: string;
  items: UsesItem[];
};

export const USES: UsesSection[] = [
  {
    label: "Computing",
    blurb:
      "Daily-driver hardware. Quiet preference for fanless ARM, longest possible battery, smallest possible bag.",
    items: [
      {
        name: "MacBook Air 15-inch (M4, 16 GB / 256 GB)",
        detail: "Primary machine. Fanless, 18 hours real-world battery, the second 15-inch in a row.",
        reviewHref: "/essentials/apple-macbook-air-m4",
      },
      {
        name: "Apple Studio Display",
        detail: "5K external panel for the desk setup at home.",
        link: "https://www.apple.com/shop/buy-mac/studio-display",
      },
      {
        name: "Logitech MX Master 3S",
        detail: "The only mouse that makes Figma and Final Cut tolerable on a laptop.",
        link: "https://www.logitech.com/en-us/shop/p/mx-master-3s",
      },
      {
        name: "Keychron K2 Pro (Brown switches)",
        detail: "75% mechanical, hot-swap, wireless when I want the desk clean.",
        link: "https://www.keychron.com/products/keychron-k2-pro-qmk-via-wireless-mechanical-keyboard",
      },
      {
        name: "Anker 3-Port 67W GaN Wall Charger",
        detail: "One brick covers the MacBook plus phone plus iPad on every trip.",
        reviewHref: "/essentials/anker-3-port-67w-gan-wall-charger",
      },
    ],
  },
  {
    label: "Phone & audio",
    items: [
      {
        name: "iPhone 16 Pro Max",
        detail: "Daily phone, mostly for the camera and Action Button. Shielded by an ESR 9H tempered-glass triple-pack.",
        link: "https://www.apple.com/iphone-16-pro/",
      },
      {
        name: "AirPods Pro 2 (USB-C, MagSafe case)",
        detail: "ANC + adaptive audio + the underrated hearing-aid firmware update.",
        reviewHref: "/essentials/apple-airpods-pro-2",
      },
      {
        name: "WHOOP 5.0 Peak",
        detail: "Screenless 24/7 strap. Recovery score, HRV, sleep tracking. Worn through the shower.",
        reviewHref: "/essentials/whoop-peak-5-0",
      },
    ],
  },
  {
    label: "Editor & dev",
    blurb:
      "Whatever runs locally on macOS. Heavy on terminal, light on IDE chrome.",
    items: [
      {
        name: "VS Code",
        detail: "Daily editor. Stock theme, no flair extensions, Vim mode off.",
        link: "https://code.visualstudio.com",
      },
      {
        name: "Claude Code",
        detail: "AI pair-programmer in the terminal. Most edits to this site flow through it.",
        link: "https://claude.com/claude-code",
      },
      {
        name: "Ghostty",
        detail: "Mitchell Hashimoto's terminal. Fast, native, opinionated about the right things.",
        link: "https://ghostty.org",
      },
      {
        name: "GitHub",
        detail: "Where the source lives. The /admin dashboard commits straight to main.",
        link: "https://github.com/ArnavGoel03",
      },
      {
        name: "Vercel",
        detail: "Hosting + Blob + AI Gateway. The deploy pipeline is git push → live in 30s.",
        link: "https://vercel.com",
      },
    ],
  },
  {
    label: "Productivity & writing",
    items: [
      {
        name: "Notion",
        detail: "Personal database. Reading list, project notes, the journals that don't make it onto the site.",
        link: "https://www.notion.so",
      },
      {
        name: "Obsidian",
        detail: "Local-first markdown vault for the things I want offline. Synced via iCloud.",
        link: "https://obsidian.md",
      },
      {
        name: "Raycast",
        detail: "Spotlight replacement. Window management, snippet manager, calculator, the lot.",
        link: "https://www.raycast.com",
      },
      {
        name: "Things 3",
        detail: "Task manager. Older than every productivity-cult app and still the cleanest.",
        link: "https://culturedcode.com/things/",
      },
    ],
  },
  {
    label: "Photo & video",
    items: [
      {
        name: "Sony A7 IV",
        detail: "The DSLR / mirrorless body that ends up in the bag for travel and street.",
        link: "https://electronics.sony.com/imaging/interchangeable-lens-cameras/full-frame/p/ilce7m4-b",
      },
      {
        name: "Lightroom Classic",
        detail: "Catalog + RAW develop. Every photo on /photos passes through here.",
        link: "https://www.adobe.com/products/photoshop-lightroom-classic.html",
      },
      {
        name: "Final Cut Pro",
        detail: "The occasional video project. M4 makes long timelines feel like real-time.",
        link: "https://www.apple.com/final-cut-pro/",
      },
    ],
  },
  {
    label: "Around the desk",
    items: [
      {
        name: "Brita Tahoe 10-cup pitcher",
        detail: "Filtered water, lives in the fridge.",
        reviewHref: "/essentials/brita-water-filter-tahoe-10-cup",
      },
      {
        name: "Dreo Tower Fan Nomad One",
        detail: "Bladeless tower, sleep-mode caps the speed and dims every LED. White noise floor included.",
        reviewHref: "/essentials/dreo-tower-fan-nomad-one",
      },
      {
        name: "Zulay Tornado milk frother",
        detail: "Whisk attachment trio. Daily for matcha; weekly for cold foam.",
        reviewHref: "/miscellaneous/zulay-tornado-triple-whisk-milk-frother",
      },
    ],
  },
  {
    label: "Browser",
    items: [
      {
        name: "Arc",
        detail: "Default browser. Vertical tabs, spaces by project, a little too clever sometimes.",
        link: "https://arc.net",
      },
      {
        name: "1Password",
        detail: "Where every login lives.",
        link: "https://1password.com",
      },
      {
        name: "uBlock Origin",
        detail: "On every browser. The web is unreadable without it.",
        link: "https://github.com/gorhill/uBlock",
      },
    ],
  },
];
