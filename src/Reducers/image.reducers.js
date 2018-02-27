import { CHANGED_IMAGE } from "../Actions/image.action.creators";

const initialState = {

};

export function updateImage(state = initialState, action) {
  switch (action.type) {
    case CHANGED_IMAGE:
      console.log("CHANGING IMG:"+action.imageStatus);
      return Object.assign({}, state, {
        image: action.imageStatus.image,
        imageid: action.imageStatus.id
      });
    default:
      return state;
  }
}
