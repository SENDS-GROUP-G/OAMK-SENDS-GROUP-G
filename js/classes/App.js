import API from './API.js';
import UI from './UI.js';

export default class App {
  static async init() {
    document.getElementById("postBtn").addEventListener("click", async () => {
      const title = document.getElementById("postTitle").value;
      const postContent = document.getElementById("postContent").value;
      if (title && postContent) {
        const newPost = await API.addPost(title, postContent);
        const postsContainer = document.getElementById("posts");
        const postElement = UI.createPostElement(newPost);
        postsContainer.appendChild(postElement);
        const comments = await API.fetchComments(newPost.post_id);
        const commentsElement = postElement.querySelector(".comments");
        comments.forEach((comment) => {
          const commentItem = UI.createCommentElement(newPost.post_id, comment);
          commentsElement.appendChild(commentItem);
        });
        document.getElementById("postTitle").value = "";
        document.getElementById("postContent").value = "";
      } else alert("Please enter both title and content for the post.");
    });
    const posts = await API.fetchPosts();
    const postsContainer = document.getElementById("posts");
    posts.forEach(async (post) => {
      const postElement = UI.createPostElement(post);
      postsContainer.appendChild(postElement);
      const comments = await API.fetchComments(post.post_id);
      const commentsElement = postElement.querySelector(".comments");
      comments.forEach((comment) => {
        const commentItem = UI.createCommentElement(post.post_id, comment);
        commentsElement.appendChild(commentItem);
      });
    });
  }
}