export const apiHeaders = new Headers();
apiHeaders.append("Authorization", `Bearer ${MOSRU_BEARER}`);
apiHeaders.append("x-mes-subsystem", "familyweb");

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
