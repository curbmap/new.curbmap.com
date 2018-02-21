export const CHANGED_IMAGE = "CHANGED_IMAGE";

export function updateImage(imageStatus) {
  return { type: CHANGED_IMAGE, imageStatus: imageStatus };
}
