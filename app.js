
const ATT_TWB = 'data-tw-bind';
const isTextInput = element => element?.type === 'text' || element?.type === 'textarea';

/**
 * Get all the binded elements and return them, filtering by property binded if passed
 * @param {string} nameProp name of the property binded 
 */
const getTwElements = nameProp => {
  const elements = document.querySelectorAll(`[${ATT_TWB}]`);
  if (nameProp) {
    return Array.from(elements).filter(el => el.getAttribute(ATT_TWB) === nameProp);
  }
  return elements;
}

class PropTwBind {
  constructor(nameProp) {
    this._nameProp = nameProp;
    this.enumerable = true;
  }

  get value() {
    return this._value;
  }

  // Each time a input tw binded element changes
  //  the value of the input has to be changed,
  //  but also the value of all the one way binded elements
  set value(newValue) {
    this._value = newValue;

    getTwElements(this._nameProp).forEach(element => {
      if (isTextInput(element)) {
        element.value = this.value;
      } else if (!element.type) {
        element.innerHTML = this.value;
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

  // Get all the binded elements
  const elements = getTwElements();
  elements.forEach(element => {

    // Add event listener to the binded elements that are inputs
    if (isTextInput(element)) {
      const propToBind = element.getAttribute(ATT_TWB);
      
      // Add setter logic to the elements
      addScopeProp(propToBind, scope);
      element.addEventListener('input', event => {
        scope[propToBind].value = event.target.value;
      });
    }
  });
};

init();
