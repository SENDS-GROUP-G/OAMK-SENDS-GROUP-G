import API from './API.js'

class FeedbackForm {
  constructor() {
    this.titleInput = document.getElementById("title");
    this.contentInput = document.getElementById("content");
    this.submitButton = document.querySelector(".buttons a[href='#submit']");
    this.cancelButton = document.querySelector(".buttons a[href='#cancel']");
    this.addEventListeners();
  }

  addEventListeners() {
    this.submitButton.addEventListener("click", (event) => this.handleSubmit(event));
    this.cancelButton.addEventListener("click", (event) => this.handleCancel(event));
  }

  handleSubmit(event) {
    event.preventDefault();

    const title = this.titleInput.value;
    const content = this.contentInput.value;

    API.sendFeedback(title, content)
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
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new FeedbackForm();
});