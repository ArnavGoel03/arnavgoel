/**
 * The /reading and /watching pages. Books and films/series in the
 * same shape: title, author/creator, status, the one-line take.
 *
 * Status meanings:
 *   "current"  — actively reading / watching now
 *   "finished" — done, with a one-line verdict
 *   "abandoned" — gave up partway, with a reason
 *
 * Add new entries by appending to the array. Page sorts by status
 * (current first, then finished, then abandoned) and within each by
 * the optional `date` field newest-first.
 */

export type LibraryItem = {
  title: string;
  by: string;
  status: "current" | "finished" | "abandoned";
  rating?: "loved" | "liked" | "okay" | "skip";
  date?: string;
  note?: string;
  link?: string;
};

export const READING: LibraryItem[] = [
  {
    title: "Stolen Focus",
    by: "Johann Hari",
    status: "current",
    date: "2026-04",
    note: "Halfway in. The chapter on flow states is the one I keep underlining.",
    link: "https://stolenfocusbook.com/",
  },
  {
    title: "The Anxious Generation",
    by: "Jonathan Haidt",
    status: "finished",
    rating: "loved",
    date: "2026-03",
    note: "The phone-based-childhood thesis lands harder when you read it on a phone.",
    link: "https://www.anxiousgeneration.com/",
  },
  {
    title: "Outlive",
    by: "Peter Attia",
    status: "finished",
    rating: "loved",
    date: "2026-02",
    note: "The frame of medicine 3.0 is what re-shaped how I think about the supplement stack on this site.",
  },
  {
    title: "How to Live",
    by: "Derek Sivers",
    status: "finished",
    rating: "liked",
    date: "2026-01",
    note: "27 contradictory ways to live, each argued in the same voice. Reads in a sitting. Stays for years.",
  },
  {
    title: "The Comfort Crisis",
    by: "Michael Easter",
    status: "finished",
    rating: "liked",
    date: "2025-12",
    note: "The Misogi chapter is the one people quote; the chapters before it are the actual book.",
  },
  {
    title: "Fooled by Randomness",
    by: "Nassim Nicholas Taleb",
    status: "abandoned",
    note: "Got two-thirds in. The argument is right; the prose is hostile. Came back to it twice; not the third time.",
  },
];

export const WATCHING: LibraryItem[] = [
  {
    title: "Severance, Season 2",
    by: "Apple TV+",
    status: "current",
    date: "2026-04",
    note: "Slower than season one, more Lumon-canon weirdness. Worth it for the cold-open of episode three alone.",
  },
  {
    title: "Shogun",
    by: "FX / Hulu",
    status: "finished",
    rating: "loved",
    date: "2026-03",
    note: "Best historical drama in a decade. The translation choreography in episode 2 is the masterclass.",
  },
  {
    title: "Dune: Part Two",
    by: "Denis Villeneuve",
    status: "finished",
    rating: "loved",
    date: "2026-02",
    note: "Saw it in IMAX. Worth the seat. Worth a re-watch with subtitles for the Fremen syllables.",
  },
  {
    title: "Top Boy, the final season",
    by: "Netflix",
    status: "finished",
    rating: "liked",
    date: "2026-01",
    note: "The London accent rewards a second pass. Sully's final scene rewards none of the predictions.",
  },
  {
    title: "Oppenheimer",
    by: "Christopher Nolan",
    status: "finished",
    rating: "loved",
    date: "2025-12",
    note: "Three hours of dialogue. None of it wasted. Nolan finally trusts a face over a clock.",
  },
  {
    title: "House of the Dragon, Season 2",
    by: "HBO",
    status: "abandoned",
    note: "Two episodes in, gave up. Episode-of-the-week pacing for a story that needed binge cadence.",
  },
];
