import API from './API.js'

class FeedbackForm {
  constructor() {
    this.titleInput = document.getElementById("title");
    this.contentInput = document.getElementById("content");
    this.rateButtons = Array.from(document.querySelectorAll("#rate button"));
    this.submitButton = document.querySelector(".buttons button[type='submit']");
    this.cancelButton = document.querySelector(".buttons button[type='button']");

    this.addEventListeners();
  }

  addEventListeners() {

    this.rateButtons.forEach(button => button.addEventListener("click", (event) => this.handleRate(event)));

    this.submitButton.addEventListener("click", (event) => this.handleSubmit(event));
    this.cancelButton.addEventListener("click", (event) => this.handleCancel(event));
  }


  handleRate(event) {
    this.rateButtons.forEach(button => button.classList.remove("btn-primary"));
    event.target.classList.add("btn-primary");
    this.rate = event.target.dataset.rate;
  }

  handleSubmit(event) {
    event.preventDefault();

    const title = this.titleInput.value;
    const content = this.contentInput.value;
    const rate = this.rate;

    API.sendFeedback(rate, title, content)
      .then(data => {
        alert("Feedback submitted successfully!");
        this.clearFields();
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Error submitting feedback. Please try again later.");
      });
  }

  handleCancel(event) {
    event.preventDefault();
    this.clearFields();
    alert("You just cancelled your submission.");
  }

  clearFields() {
    this.titleInput.value = "";
    this.contentInput.value = "";
    this.rateButtons.forEach(button => button.classList.remove("btn-primary"));
    this.rate = null;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new FeedbackForm();
});