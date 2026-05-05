import { permanentRedirect } from "next/navigation";

/**
 * Folded into /build?tool=stack so the three builder tools live
 * under one workshop URL. 308 (permanentRedirect) so search engines
 * and any saved stack-builder share-links keep working.
 */
export default function StackBuilderPage(): never {
  permanentRedirect("/build?tool=stack");
}
