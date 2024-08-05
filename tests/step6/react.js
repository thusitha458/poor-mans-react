(() => {
  class Component {
    static __react_type = REACT_COMPONENT;

    constructor(props) {
      this.props = props;
    }
  }

  function element(el, children) {
    if (isClass(el)) {
      return handleClass(el);
    } else if (isStatelessComponent(el)) {
      return el();
    }
    return handleHtmlElement(el, children);
  }

  function handleClass(el) {
    const component = new el();
    return component.render();
  }

  function handleHtmlElement(el, children) {
    const anElement = document.createElement(el);
    for (const child of children) {
      appendChild(anElement, child);
    }
    return anElement;
  }

  function appendChild(el, child) {
    if (typeof child === "object") {
      el.appendChild(child);
    } else {
      el.innerHTML += child;
    }
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
