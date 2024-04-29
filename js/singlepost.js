import API from "./classes/API.js";
import Post from "./classes/Post.js";

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("post_id");
  const post = await API.fetchPost(postId);
  const postElement = new Post(post).getPostElement();
  document.getElementById("post").appendChild(postElement);
};
