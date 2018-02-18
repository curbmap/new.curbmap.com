export const LOGGED_IN = "LOGGED_IN";
export const SIGNED_UP = "SIGNED_UP";

export function loggedIn(status) {
  return { type: LOGGED_IN, status };
}

export function signedUp(status) {
  return { type: SIGNED_UP, status };
}
