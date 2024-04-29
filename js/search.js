import API from "./classes/API.js";

let userResults = [];
let postResults = [];

document.getElementById("search-button").addEventListener("click", async () => {
  const query = document.getElementById("search-input").value;
  userResults = await API.searchUser(query);
  postResults = await API.searchPost(query);
  displayResults(userResults, postResults);
});

document.getElementById("all-button").addEventListener("click", () => {
  displayResults(userResults, postResults);
});

document.getElementById("users-button").addEventListener("click", () => {
  displayResults(userResults, []);
});

document.getElementById("posts-button").addEventListener("click", () => {
  displayResults([], postResults);
});

function displayResults(userResults, postResults) {
  const resultsElement = document.getElementById("search-results");
  resultsElement.innerHTML = "";
  userResults.forEach((user) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `<a href="/user.html?user_id=${user.user_id}">${user.user_name}</a>`;
    resultsElement.appendChild(li);
  });
  postResults.forEach((post) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `<a href="/post.html?post_id=${post.post_id}">${post.title}</a>`;
    resultsElement.appendChild(li);
  });
}
