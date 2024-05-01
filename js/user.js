import API from "./classes/API.js";
import Post from "./classes/Post.js";

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("user_id");
  try {
    const userData = await API.fetchUser(userId);
    const user = userData.user;
    const posts = userData.posts;
    document.getElementById("userInfo").innerHTML = `<h1>User: ${user.user_name}</h1><p>Email: ${user.email}</p>`;
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
};
