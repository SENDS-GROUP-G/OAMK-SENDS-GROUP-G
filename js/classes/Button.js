export default class Button {
    constructor(text, className) {
      this.button = document.createElement("button");
      this.button.textContent = text;
      this.button.className = `btn ${className}`;
    }
    getElement() {
      return this.button;
    }
    
  }
  function disableButton(button) {
    // 1. Prevent click events (optional):
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default click behavior
    });
  
    // 2. Disable pointer interactions:
    button.style.pointerEvents = "none"; // Disables hover, click, etc.
  
    // 3. Optional visual cues (optional):
    button.classList.add("disabled"); // Add a CSS class for styling (e.g., grayed out)
  }
