const REACT_COMPONENT = "React.Component";

function isClass(clazz) {
  return typeof clazz === "function" && clazz?.__react_type === "React.Component";
}

function isStatelessComponent(element) {
  return !isClass(element) && typeof element === 'function';
}

function shouldAddEventListener(property) {
  return /^on.*$/.test(property);
}