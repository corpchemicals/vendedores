export class DOM {
  static create(name) {
    return document.createElement(name)
  }

  static get(key) {
    return document.querySelector(key)
  }

  static createOption(value, innerText = value) {
    const option = this.create("option")
    option.value = value
    option.innerText = innerText
    return option
  }

  static removeAllChilds(parent) {
    while(parent.lastChild.value) {
      parent.removeChild(parent.lastChild)
    }
  }

  static removeElement(element) {
    element.remove();
  }
}