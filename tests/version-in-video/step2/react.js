(() => {
  function element(el, children) {
    const anElement = document.createElement(el);
    anElement.innerHTML = children.join(' ');
    return anElement;
  }

  function createElement(el, props, ...children) {
    return element(el, children);
  }

  window.React = {
    createElement,
  };

  window.ReactDOM = {
    render: (el, domEl) => {
      domEl.appendChild(el);
    },
  };
})();
