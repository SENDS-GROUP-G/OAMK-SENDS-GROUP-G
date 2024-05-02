
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;
  fetch('https://sendsserver.onrender.com/users/login', {
  //fetch("http://localhost:3001/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.user_id) {
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("username", data.user_name);
        localStorage.setItem("user_email", data.email);
        window.location.href = "main.html";
      } else {
        throw new Error(data.error);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error: " + error.message);
    });
});

