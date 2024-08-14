(() => {
  const REACT_CLASS_COMPONENT = "React.Class.Component";

  class Component {
    static __react_type = REACT_CLASS_COMPONENT;

    constructor(props) {
      this.props = props;
    }

    render() {
      return null;
    }
  }

  class ReactElement {
    constructor(type, props, children) {
      this.type = type;
      this.props = props;
      this.children = children;
    }

    isPlainText() {
      return this.type === "plain-text";
    }

    isHtml() {
      return this.type === "html-element";
    }

    isFunctional() {
      return this.type === "functional-element";
    }

    isClass() {
      return this.type === "class-element";
    }

    doRender() {
      return null;
    }
  }

  class ReactPlainTextElement extends ReactElement {
    constructor(val) {
      super("plain-text", null, null);
      this.val = val;
    }

    doRender() {
      return this.val;
    }
  }

  class ReactHtmlElement extends ReactElement {
    constructor(htmlType, props, children) {
      super(
        "html-element",
        props,
        (children || []).map((child) => {
          if (typeof child !== "object") {
            return new ReactPlainTextElement(child);
          }
          return child;
        })
      );
      this.htmlType = htmlType;
    }

    doRender() {
      const el = document.createElement(this.htmlType);

      this.children.forEach((child) => {
        const html = child.doRender();
        if (typeof html !== "object") {
          el.innerHTML += html;
        } else {
          el.appendChild(html);
        }
      });

      if (this.props) {
        // set html event listeners and attributes
        Object.keys(this.props).forEach((propName) => {
          if (propName.startsWith("on")) {
            el.addEventListener(
              propName.substring(2).toLowerCase(),
              this.props[propName]
            );
          } else {
            const attributeName = propName === "className" ? "class" : propName;
            const attributeValue = (() => {
              if (propName === "style" && typeof this.props[propName] === "object") {
                return Object.keys(this.props[propName])
                  .map(
                    (styleProp) => `${styleProp}: ${props[propName][styleProp]}`
                  )
                  .join(";");
              }
              return this.props[propName];
            })();
  
            el.setAttribute(attributeName, attributeValue);
          }
        });
      }


      return el;
    }
  }

  class ReactFunctionalElement extends ReactElement {
    constructor(func, props, children) {
      super("functional-element", props, children);
      this.func = func;
      this.childElement = this.func(this.props);
    }

    doRender() {
      return this.childElement.doRender();
    }
  }

  class ReactClassElement extends ReactElement {
    constructor(clazz, props, children) {
      super("class-element", props, children);
      this.instance = new clazz(this.props);
      this.childElement = this.instance.render();
    }

    doRender() {
      return this.childElement.doRender();
    }
  }

  function createElement(el, props, ...children) {
    if (typeof el === "function" && el.__react_type === REACT_CLASS_COMPONENT) {
      return new ReactClassElement(el, props, children);
    } else if (typeof el === "function") {
      return new ReactFunctionalElement(el, props, children);
    }
    return new ReactHtmlElement(el, props, children);
  }

  window.React = {
    createElement,
    Component,
  };

  window.ReactDOM = {
    render: (el, domEl) => {
      if (typeof el !== "object") {
        domEl.innerHTML += el;
        return;
      }

      domEl.appendChild(el.doRender());
    },
  };
})();
