(() => {
  function element(el, children) {
    if (typeof el === 'function') {
      return el();
    }

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
