(() => {
  class Component {
    static __react_type = REACT_COMPONENT;

    constructor(props) {
      this.props = props;
    }
  }

  function element(el, props, children) {
    if (isClass(el)) {
      return handleClass(el, props);
    } else if (isStatelessComponent(el)) {
      return el(props);
    }
    return handleHtmlElement(el, children);
  }

  function handleClass(el, props) {
    const component = new el(props);
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
    return element(el, props, children);
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
