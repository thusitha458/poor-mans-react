(() => {
  class Component {
    static __react_type = "React.Component";

    constructor(props) {
      this.props = props;
    }
  }

  function isClass(clazz) {
    return typeof clazz === "function" && clazz?.__react_type === "React.Component";
  }

  function element(el, children) {
    if (isClass(el)) {
      return new el().render();
    } else if (typeof el === "function") {
      return el();
    }

    const anElement = document.createElement(el);
    for (const child of children) {
      if (typeof child === "object") {
        anElement.appendChild(child);
      } else {
        anElement.innerHTML += child;
      }
    }
    return anElement;
  }

  function createElement(el, props, ...children) {
    return element(el, children);
  }

  window.React = {
    createElement,
    Component,
  };

  window.ReactDOM = {
    render: (el, domEl) => {
      domEl.appendChild(el);
    },
  };
})();
