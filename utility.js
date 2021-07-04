function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}