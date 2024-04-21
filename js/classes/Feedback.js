document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the submit button
  document.querySelector(".buttons a[href='#submit']").addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link behavior

      // Get form data
      var title = document.getElementById("title").value;
      var content = document.getElementById("content").value;

      // Validate form data (you can add your validation logic here)

      // Construct feedback object
      var feedback = {
          title: title,
          content: content
      };

      // You can send the feedback data to your server using fetch or XMLHttpRequest
    
      fetch("/feedbacks", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(feedback)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          return response.json();
      })
      .then(data => {
          alert("Feedback submitted successfully!");
          // Clear form fields
          document.getElementById("title").value = "";
          document.getElementById("content").value = "";
      })
      .catch(error => {
          console.error("Error:", error);
          alert("Error submitting feedback. Please try again later.");
      });

      // For demonstration purposes, let's just log the feedback object to console
      console.log("Feedback:", feedback);
      alert("Feedback submitted successfully!");
      // Clear form fields
      document.getElementById("title").value = "";
      document.getElementById("content").value = "";
  });

  // Add event listener to the cancel button
  document.querySelector(".buttons a[href='#cancel']").addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link behavior

      // Clear form fields
      document.getElementById("title").value = "";
      document.getElementById("content").value = "";

      alert("You just cancelled your submission.");
  });
});
