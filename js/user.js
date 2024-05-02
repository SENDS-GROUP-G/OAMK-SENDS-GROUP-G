import API from "./classes/API.js";
import Post from "./classes/Post.js";
import App from './classes/App.js';


window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId1 = urlParams.get("user_id");

  try {
    const userData = await API.fetchUser(userId1);
    const user = userData.user;
    const posts = userData.posts;
    document.getElementById("userInfo").innerHTML = `<p id="user-page-text1" class="user-page-text">Posts from </p><p id="user-page-text2" class="user-page-text"> ${user.user_name}:</p>`;
    const postsContainer = document.getElementById("userPosts");
    posts.forEach(async (postId) => {
      const post = await API.fetchPost(postId);
      const postInstance = new Post(post, user);
      postsContainer.appendChild(postInstance.postElement);
    });
  } catch (error) {
    console.error('Error fetching user and posts:', error);
    document.getElementById("userInfo").innerHTML = "<p>Error loading user data.</p>";
  }

  const userId2 = localStorage.getItem('user_id');
  if (userId2) {
    document.getElementById('signup').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('setting').style.display = 'flex';
    document.getElementById('logout').style.display = 'flex';
  } else {
    document.getElementById('signup').style.display = 'flex';
    document.getElementById('login').style.display = 'flex';
    document.getElementById('setting').style.display = 'none';
    document.getElementById('logout').style.display = 'none';
  }
};

window.logout = function() {
  localStorage.removeItem('user_id');
  localStorage.removeItem('username');
  window.location.href = 'index.html';
}

App.init();