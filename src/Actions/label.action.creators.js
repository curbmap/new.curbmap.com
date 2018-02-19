export const CHANGED_BOX_LABELS = "CHANGED_BOX_LABELS";

export function changeLabels(labels) {
  return { type: CHANGED_BOX_LABELS, labels };
}
