(() => {
  let rootReactElement, rootDOMElement;

  class Component {
    static __react_type = REACT_COMPONENT;

    constructor(props) {
      this.props = props;
      this.state = {};
    }

    setState(state) {
      this.state = { ...this.state, ...state };
      rerender();
    }
  }

  function rerender() {
    // clear the dom and render again
    while (rootDOMElement.hasChildNodes()) {
      rootDOMElement.removeChild(rootDOMElement.lastChild);
    }

    ReactDOM.render(rootReactElement, rootDOMElement);
  }

  function element(el, props, children) {
    if (isClass(el)) {
      return handleClass(el, props, children);
    } else if (isStatelessComponent(el)) {
      return el(props);
    }
    return handleHtmlElement(el, props, children);
  }

  function handleClass(el, props, children) {
    const component = new el(props);
    component.children = children;
    return component;
  }

  function handleHtmlElement(el, props, children) {
    const anElement = document.createElement(el);
    for (const child of children) {
      appendChild(anElement, child);
    }

    if (props) {
      // set html event listeners and attributes
      Object.keys(props).forEach((propName) => {
        if (shouldAddEventListener(propName)) {
          anElement.addEventListener(
            propName.substring(2).toLowerCase(),
            props[propName]
          );
        } else {
          const attributeName = propName === "className" ? "class" : propName;
          const attributeValue = (() => {
            if (propName === "style" && typeof props[propName] === "object") {
              return Object.keys(props[propName])
                .map(
                  (styleProp) => `${styleProp}: ${props[propName][styleProp]}`
                )
                .join(";");
            }
            return props[propName];
          })();

          anElement.setAttribute(attributeName, attributeValue);
        }
      });
    }

    return anElement;
  }

  function appendChild(el, child) {
    if (isReactClassComponent(child)) {
      appendChild(el, child.render());
    } else if (typeof child === "object") {
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

  const ReactDOM = {
    render: (el, domEl) => {
      rootReactElement = el;
      rootDOMElement = domEl;

      domEl.appendChild(isReactClassComponent(el) ? el.render() : el);
    },
  };

  window.ReactDOM = ReactDOM;
})();
