(() => {
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
      return el;
    }
  }

  function createElement(el, props, ...children) {
    return new ReactHtmlElement(el, props, children);
  }

  window.React = {
    createElement,
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
