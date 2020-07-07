
const ATT_TWB = 'data-tw-bind';
const isTextInput = element => element?.type === 'text' || element?.type === 'textarea';
const getTwElements = () => document.querySelectorAll(`[${ATT_TWB}]`);

class PropTwBind {
  constructor(nameProp) {
    this._nameProp = nameProp;
    this.enumerable = true;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;

    getTwElements().forEach(element => {
      if (element.getAttribute(ATT_TWB) === this._nameProp) {
        if (isTextInput(element)) {
          element.value = this.value;
        } else if (!element.type) {
          element.innerHTML = this.value;
        }
      }
    });
  }
}

const addScopeProp = (propName, scope) => {
  if (!scope.hasOwnProperty(propName)) {
    scope[propName] = new PropTwBind(propName);
  }
};

const init = () => {
  const scope = {};
  const elements = getTwElements();
  elements.forEach(element => {
    if (isTextInput(element)) {
      const propToBind = element.getAttribute(ATT_TWB);
      addScopeProp(propToBind, scope);
      element.addEventListener('input', event => {
        scope[propToBind].value = event.target.value;
      });
    }
  });
};

init();
