export const REACT_COMPONENT = "React.Component";

export function isClass(clazz) {
  return typeof clazz === "function" && clazz?.__react_type === REACT_COMPONENT;
}

export function isReactClassComponent(element) {
  return element?.constructor?.__react_type === REACT_COMPONENT;
}

export function isStatelessComponent(element) {
  return !isClass(element) && typeof element === 'function';
}

export function shouldAddEventListener(property) {
  return /^on.*$/.test(property);
}