export function apiHeaders(token) {
  if (!token) throw new Error("token is not set");
  let headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("x-mes-subsystem", "familyweb");
  return headers;
}

export function viewTransitionHelper(name, callback) {
  if (!document.startViewTransition) {
    callback();
    return;
  }
  let tr = document.startViewTransition(() => {
    callback();
  });
  tr.types.add(name);
}
