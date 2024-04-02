import { postInput, addPostBtn, postsContainer } from "./domElements.js";
import { createComment } from "./comment.js";

export function createPost(content) {
  const post = document.createElement("div");
  post.classList.add("post");
  post.innerHTML = ` 
        <div class="post-header">
            <h3>User Name</h3> 
            <span class="time">${new Date().toLocaleString()}</span>
            <button class="delete-post-btn">Delete Post</button> 
        </div>
        <p>${content}</p>
        <div class="post-actions">
            <button class="like-btn">Like <span class="like-count">0</span></button> 
            <button class="comment-btn">Comment</button>
        </div>
        <div class="comments">
        </div> 
    `;
  postsContainer.appendChild(post);

  const likeBtn = post.querySelector(".like-btn");
  const likeCount = post.querySelector(".like-count");
  const commentsSection = post.querySelector(".comments");
  const commentBtn = post.querySelector(".comment-btn");
  const deletePostBtn = post.querySelector(".delete-post-btn");

  deletePostBtn.addEventListener("click", () => {
    post.remove();
  });

  likeBtn.addEventListener("click", () => {
    let count = parseInt(likeCount.textContent);
    if (likeBtn.classList.contains("liked")) {
      // Check if already liked
      count--;
      likeBtn.classList.remove("liked"); // Remove liked class
    } else {
      count++;
      likeBtn.classList.add("liked"); // Add liked class
    }
    likeCount.textContent = count;
  });

  commentBtn.addEventListener("click", () => {
    if (commentsSection.querySelector("input")) return;

    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.placeholder = "Add a comment...";

    const submitCommentBtn = document.createElement("button");
    submitCommentBtn.textContent = "Submit";

    commentsSection.appendChild(commentInput);
    commentsSection.appendChild(submitCommentBtn);

    submitCommentBtn.addEventListener("click", () => {
      const commentText = commentInput.value;
      if (commentText.trim() !== "") {
        createComment(commentsSection, commentText);
        commentInput.remove();
        submitCommentBtn.remove();
      }
    });
  });
}

addPostBtn.addEventListener("click", () => {
  const postContent = postInput.value;
  if (postContent.trim() !== "") {
    createPost(postContent);
    postInput.value = "";
  }
});
