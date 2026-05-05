import { permanentRedirect } from "next/navigation";

export default function RoutineBuilderPage(): never {
  permanentRedirect("/build?tool=routine");
}
