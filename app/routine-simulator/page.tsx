import { permanentRedirect } from "next/navigation";

export default function RoutineSimulatorPage(): never {
  permanentRedirect("/build?tool=simulator");
}
