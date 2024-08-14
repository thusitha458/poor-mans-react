(() => {
  const REACT_CLASS_COMPONENT = "React.Class.Component";

  let rootReactElement, rootDOMElement;

  class Component {
    static __react_type = REACT_CLASS_COMPONENT;

    constructor(props) {
      this.props = props;
      this.state = {};
      this.prevState = {};
    }

    render() {
      return null;
    }

    setState(newState) {
      this.state = { ...this.state, ...newState };
      rerender();
    }
  }

  function useState(initialState) {
    const reactElement = useState.caller?.arguments?.[1]?.__react_element; // should recursively find parent react element, it might not be the immediate caller

    const stateCounter = reactElement.getStateCounter();
    reactElement.incrementStateCounter();
    if (reactElement?.getStateMap()?.[stateCounter] === undefined) {
      reactElement.setPrevStateMap({ ...reactElement.getStateMap() });
      reactElement.setStateMap({
        ...reactElement.stateMap,
        [stateCounter]: initialState,
      });
    }

    return [
      reactElement.getStateMap()[stateCounter],
      (value) => {
        reactElement.setPrevStateMap({ ...reactElement.getStateMap() });
        reactElement.setStateMap({
          ...reactElement.getStateMap(),
          [stateCounter]: value,
        });
        rerender();
      },
    ];
  }

  function rerender() {
    while (rootDOMElement.hasChildNodes()) {
      rootDOMElement.removeChild(rootDOMElement.lastChild);
    }

    if (typeof rootReactElement !== "object") {
      rootDOMElement.innerHTML += rootReactElement;
      return;
    }

    rootDOMElement.appendChild(rootReactElement.rerender());
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

    rerender() {
      return null;
    }
  }

  class ReactPlainTextElement extends ReactElement {
    constructor(val) {
      super("plain-text", null, null);
      this.val = val;
    }

    doRender() {
      return this._render();
    }

    rerender() {
      return this._render();
    }

    _render() {
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
      return this._render(true);
    }

    rerender() {
      return this._render(false);
    }

    _render(initial = true) {
      const el = document.createElement(this.htmlType);

      function renderAndAppendChild(child) {
        if (Array.isArray(child)) {
          child.forEach((c) => renderAndAppendChild(c));
          return;
        }

        const html = initial ? child.doRender() : child.rerender();
        if (typeof html !== "object") {
          el.innerHTML += html;
        } else {
          el.appendChild(html);
        }
      }

      this.children.forEach(renderAndAppendChild);

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
              if (
                propName === "style" &&
                typeof this.props[propName] === "object"
              ) {
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
    stateCounter = 0;
    stateMap = {};
    prevStateMap = {};

    constructor(func, props, children) {
      super("functional-element", props, children);
      this.func = func;
      this.childElement = this.func(this.props, { __react_element: this });
      this.stateCounter = 0;
      this.stateMap = {};
    }

    getStateCounter() {
      return this.stateCounter;
    }

    incrementStateCounter() {
      this.stateCounter = this.stateCounter + 1;
    }

    getStateMap() {
      return this.stateMap;
    }

    setStateMap(map) {
      this.stateMap = map;
    }

    getPrevStateMap() {
      return this.prevStateMap;
    }

    setPrevStateMap(map) {
      this.prevStateMap = map;
    }

    doRender() {
      return this.childElement.doRender();
    }

    shouldRerender() {
      const prevState = this.prevStateMap;
      const nextState = this.stateMap;

      for (const key of Object.keys(prevState)) {
        if (prevState[key] !== nextState[key]) {
          return true;
        }
      }

      for (const key of Object.keys(nextState)) {
        if (nextState[key] !== prevState[key]) {
          return true;
        }
      }

      return false;
    }

    rerender() {
      if (this.shouldRerender()) {
        this.stateCounter = 0;
        this.childElement = this.func(this.props, { __react_element: this });
      }

      return this.childElement.rerender();
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

    shouldRerender() {
      const prevState = this.instance.prevState;
      const nextState = this.instance.state;

      for (const key of Object.keys(prevState)) {
        if (prevState[key] !== nextState[key]) {
          return true;
        }
      }

      for (const key of Object.keys(nextState)) {
        if (nextState[key] !== prevState[key]) {
          return true;
        }
      }

      return false;
    }

    rerender() {
      if (this.shouldRerender()) {
        this.childElement = this.instance.render();
      }

      return this.childElement.rerender();
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
    useState,
  };

  window.ReactDOM = {
    render: (el, domEl) => {
      rootReactElement = el;
      rootDOMElement = domEl;

      if (typeof el !== "object") {
        domEl.innerHTML += el;
        return;
      }

      domEl.appendChild(el.doRender());
    },
  };
})();
