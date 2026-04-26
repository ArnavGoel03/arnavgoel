import { permanentRedirect } from "next/navigation";

export default function WatchingRedirect(): never {
  permanentRedirect("/library?tab=watching");
}
