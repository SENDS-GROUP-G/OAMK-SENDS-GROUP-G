import API from "./classes/API.js";

let userResults = [];
let postResults = [];

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    // Optionally, perform an alternative action on Enter press (e.g., submit form)
  }
});

searchInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value;
    userResults = await API.searchUser(query);
    postResults = await API.searchPost(query);
    displayResults(userResults, postResults);
  }
});

searchButton.addEventListener("click", async () => {
  // Existing button click functionality for search
  const query = searchInput.value;
  userResults = await API.searchUser(query);
  postResults = await API.searchPost(query);
  displayResults(userResults, postResults);
});

function displayResults(userResults, postResults) {
  // Existing logic to display search results
  const resultsElement = document.getElementById("search-results");
  resultsElement.innerHTML = "";
  userResults.forEach((user) => {
    const resultsContainer = document.createElement("div");
    resultsContainer.classList.add("result-container")
    const users = document.createElement("a");
    const usersIcon = document.createElement("img");
    usersIcon.classList.add("icon");
    usersIcon.src = "icons/user.svg";
    const usersText = document.createElement("p");
    usersText.classList.add("text");
    usersText.textContent = `${user.user_name}`;
    users.className = "result";
    users.href = `/user.html?user_id=${user.user_id}`;
    users.append(usersIcon,usersText);
    resultsContainer.appendChild(users);
    resultsElement.appendChild(resultsContainer);
  });
  postResults.forEach((post) => {
    const resultsContainer = document.createElement("div");
    resultsContainer.classList.add("result-container")
    const posts = document.createElement("a");
    const postsIcon = document.createElement("img");
    postsIcon.classList.add("icon");
    postsIcon.src = "icons/post.svg";
    const postsText = document.createElement("p");
    postsText.classList.add("text");
    postsText.textContent = `${post.title}`;
    posts.className = "result";
    posts.href = `/post.html?post_id=${post.post_id}`;
    posts.append(postsIcon,postsText);
    resultsContainer.appendChild(posts);
    resultsElement.appendChild(resultsContainer);
  });
  

}
