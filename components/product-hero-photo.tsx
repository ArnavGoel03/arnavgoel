import type { Review } from "@/lib/types";
import { ProductPhotoGallery } from "./product-photo-gallery";

/**
 * Product hero shot for the detail page. The card sizes to the photo's
 * own aspect ratio (no fixed-square frame), and gracefully extends into
 * a thumbnail-strip gallery whenever the review has more than one
 * photo (main + photoTimeline entries).
 */
export function ProductHeroPhoto({ review }: { review: Review }) {
  if (!review.photo && review.photoTimeline.length === 0) return null;
  return <ProductPhotoGallery review={review} />;
}
