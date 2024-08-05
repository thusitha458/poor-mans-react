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
    return handleHtmlElement(el, props, children);
  }

  function handleClass(el, props) {
    const component = new el(props);
    return component.render();
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
