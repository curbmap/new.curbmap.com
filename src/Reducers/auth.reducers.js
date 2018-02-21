import { LOGGED_IN, SIGNED_UP } from "../Actions/auth.action.creators";

const initialState = {
  logged_in: false,
  signed_up: false,
  session: null,
  username: null,
  email: null,
  score: 0
};

export function auth(state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN:
      if (action.status.success === 1) {
        return Object.assign({}, state, {
          session: action.status.session,
          username: action.status.username,
          email: action.status.email,
          score: parseInt(action.status.score, 10),
          logged_in: true,
          signed_up: false
        });
      }
      return state;
    case SIGNED_UP:
      if (action.status.success === 1) {
        return Object.assign({}, state, {
          logged_in: false,
          signed_up: true,
          session: null
        });
      }
      return state;
    default:
      return state;
  }
}
