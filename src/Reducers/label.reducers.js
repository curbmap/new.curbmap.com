import { CHANGED_BOX_LABELS } from "../Actions/label.action.creators";

const initialState = {
    labels : []
};

export function updateLabels(state = initialState, action) {
  switch (action.type) {
    case CHANGED_BOX_LABELS:
        return Object.assign({}, state, {
          labels: action.labels
        });
    default:
      return state;
  }
}
