import { CHANGED_IMAGE } from "../Actions/image.action.creators";
let HOST_AUTH = "https://curbmap.com";
let HOST_RES = "https://curbmap.com:50003";
if (process.env.REACT_APP_STAGE === "dev") {
  HOST_AUTH = "http://localhost:8080";
  HOST_RES = "http://localhost:8081";
}
const initialState = {
  image: HOST_RES+"/uploads/03673a00-ef23-11e7-903b-8d9a8c07e4d0-1518909562583-85632G73+W75F-14.6148719787598.jpg",
  imageid: "5a88b87a4225c62402aed3d4"
};

export function updateImage(state = initialState, action) {
  switch (action.type) {
    case CHANGED_IMAGE:
      console.log("CHANGING IMG:"+action.imageStatus)
      return Object.assign({}, state, {
        image: action.imageStatus.file,
        imageid: action.imageStatus.id
      });
    default:
      return state;
  }
}
