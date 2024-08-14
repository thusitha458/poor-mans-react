const REACT_COMPONENT = "React.Component";

function isClass(clazz) {
  return typeof clazz === "function" && clazz?.__react_type === REACT_COMPONENT;
}

function isReactClassComponent(element) {
  return element?.constructor?.__react_type === REACT_COMPONENT;
}

function isStatelessComponent(element) {
  return !isClass(element) && typeof element === 'function';
}

function shouldAddEventListener(property) {
  return /^on.*$/.test(property);
}