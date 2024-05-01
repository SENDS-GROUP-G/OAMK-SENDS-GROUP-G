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
        const postContentBox = document.getElementById("postContent");
        postContentBox.style.height = `0px`;
      } else alert("Please enter both title and content of the post.");
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


    const postTitle = document.getElementById("postTitle");

    postTitle.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        // Optionally, perform an alternative action on Enter press (e.g., submit form)
      }
    });

    const postContent = document.getElementById("postContent");

    postContent.addEventListener("input", function() {
      const currentContent = postContent.value;
      let previousContent = "";
      if (postContent.value && currentContent !== previousContent) {
        previousContent = currentContent;
        postContent.style.height = `${postContent.scrollHeight}px`;
        window.requestAnimationFrame(() => {
          postContent.style.height = null; // Trigger reflow
          postContent.style.height = `${postContent.scrollHeight}px`;
      });
    } else {
        // If there's no input, reset to default height
        postContent.style.height = `0px`;
      }
    });
    
  }
}