export default class Button {
    constructor(text, className, floatRight = false) {
      this.button = document.createElement("button");
      this.button.textContent = text;
      this.button.className = `btn ${className}`;
      if (floatRight) this.button.classList.add("float-end");
    }
    getElement() {
      return this.button;
    }
  }