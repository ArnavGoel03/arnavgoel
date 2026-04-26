import { permanentRedirect } from "next/navigation";

export default function ReadingRedirect(): never {
  permanentRedirect("/library?tab=reading");
}
