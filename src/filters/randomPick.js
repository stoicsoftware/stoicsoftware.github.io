const randomIndex = list => {
  if (!Array.isArray(list)) {
    throw new TypeError('randomIndex: list is not an Array');
  }
  return Math.floor(Math.random() * list.length);
}

const randomKey = obj => {
  if (typeof obj !== 'object') {
    throw new TypeError('randomKey: obj is not an Object');
  }
  const keys = Object.keys(obj);
  return keys[randomIndex(keys)];
}

module.exports = {
  randomPick: (collection) => {
    if (Array.isArray(collection)) {
      return collection[randomIndex(collection)];
    }

    if (typeof collection === 'object') {
      return collection[randomKey(collection)];
    }

    throw new TypeError('randomPick: collection is neither Array nor Object');
  }
}
