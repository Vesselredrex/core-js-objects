function shallowCopy(obj) {
  const copy = {};
  return Object.assign(copy, obj);
}

function mergeObjects(objects) {
  const result = {};

  objects.forEach((obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      result[key] = (result[key] ?? 0) + value;
    });
  });

  return result;
}

function removeProperties(obj, keys) {
  const result = { ...obj };

  keys.forEach((key) => {
    delete result[key];
  });

  return result;
}

function compareObjects(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => keys2.includes(key) && obj1[key] === obj2[key]);
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

function makeImmutable(obj) {
  return Object.freeze(obj);
}

function makeWord(lettersObject) {
  const result = [];

  Object.keys(lettersObject).forEach((letter) => {
    lettersObject[letter].forEach((position) => {
      result[position] = letter;
    });
  });

  return result.join('');
}

function sellTickets(queue) {
  let bills25 = 0;
  let bills50 = 0;

  return queue.every((bill) => {
    if (bill === 25) {
      bills25 += 1;
    } else if (bill === 50) {
      if (bills25 === 0) return false;

      bills25 -= 1;
      bills50 += 1;
    } else if (bill === 100) {
      if (bills50 > 0 && bills25 > 0) {
        bills50 -= 1;
        bills25 -= 1;
      } else if (bills25 >= 3) {
        bills25 -= 3;
      } else {
        return false;
      }
    }

    return true;
  });
}

function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  this.getArea = function getArea() {
    return this.width * this.height;
  };
}

function getJSON(obj) {
  return JSON.stringify(obj);
}

function fromJSON(proto, json) {
  const obj = JSON.parse(json);

  return Object.assign(Object.create(proto), obj);
}

function sortCitiesArray(arr) {
  return arr.sort((a, b) => {
    const countryCompare = a.country.localeCompare(b.country);

    if (countryCompare !== 0) {
      return countryCompare;
    }

    return a.city.localeCompare(b.city);
  });
}

function group(array, keySelector, valueSelector) {
  const result = new Map();

  array.forEach((item) => {
    const key = keySelector(item);
    const value = valueSelector(item);

    if (!result.has(key)) {
      result.set(key, []);
    }

    result.get(key).push(value);
  });

  return result;
}

const types = [
  'element',
  'id',
  'class',
  'attr',
  'pseudoClass',
  'pseudoElement',
];

class Selector {
  constructor() {
    this.parts = [];
    this.lastOrder = -1;
    this.used = new Set();
  }

  add(type, value) {
    const order = types.indexOf(type);

    if (
      ['element', 'id', 'pseudoElement'].includes(type) &&
      this.used.has(type)
    ) {
      throw new Error(
        'Element, id and pseudo-element should not occur more than one time inside the selector'
      );
    }

    if (order < this.lastOrder) {
      throw new Error(
        [
          'Selector parts should be arranged in the following order:',
          'element, id, class, attribute, pseudo-class, pseudo-element',
        ].join(' ')
      );
    }

    this.lastOrder = order;
    this.used.add(type);

    const prefixes = {
      element: '',
      id: '#',
      class: '.',
      attr: '',
      pseudoClass: ':',
      pseudoElement: '::',
    };

    if (type === 'attr') {
      this.parts.push(`[${value}]`);
    } else {
      this.parts.push(prefixes[type] + value);
    }

    return this;
  }

  element(value) {
    return this.add('element', value);
  }

  id(value) {
    return this.add('id', value);
  }

  class(value) {
    return this.add('class', value);
  }

  attr(value) {
    return this.add('attr', value);
  }

  pseudoClass(value) {
    return this.add('pseudoClass', value);
  }

  pseudoElement(value) {
    return this.add('pseudoElement', value);
  }

  stringify() {
    return this.parts.join('');
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new Selector().element(value);
  },

  id(value) {
    return new Selector().id(value);
  },

  class(value) {
    return new Selector().class(value);
  },

  attr(value) {
    return new Selector().attr(value);
  },

  pseudoClass(value) {
    return new Selector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new Selector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return {
      stringify() {
        return `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
      },
    };
  },
};

module.exports = {
  shallowCopy,
  mergeObjects,
  removeProperties,
  compareObjects,
  isEmptyObject,
  makeImmutable,
  makeWord,
  sellTickets,
  Rectangle,
  getJSON,
  fromJSON,
  group,
  sortCitiesArray,
  cssSelectorBuilder,
};
