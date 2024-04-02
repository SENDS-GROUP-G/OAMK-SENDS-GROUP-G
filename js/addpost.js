export function createPost(content) {
  const post = document.createElement("div");
  post.classList.add("post");
  post.innerHTML = `
          <div class="post-header">
              <h3>User Name</h3>
              <span class="time">${new Date().toLocaleString()}</span>
              <button class="delete-post-btn">Delete Post</button>
              <button class="edit-post-btn">Edit Post</button>
          </div>
          <p class="post-content" contenteditable="false">${content}</p>
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

  likeBtn.addEventListener("click", () => {
    let count = parseInt(likeCount.textContent);
    if (likeBtn.classList.contains("liked")) {
      count--;
      likeBtn.classList.remove("liked");
    } else {
      count++;
      likeBtn.classList.add("liked");
    }
    likeCount.textContent = count;
  });

  commentBtn.addEventListener("click", () => {
    import("./comment.js").then(({ createCommentInput }) => {
      if (commentsSection.querySelector("input")) return;
      const commentInput = createCommentInput(commentsSection);
    });
  });

  const editPostBtn = post.querySelector(".edit-post-btn");
  const postContent = post.querySelector(".post-content");

  editPostBtn.addEventListener("click", () => {
    if (postContent.contentEditable === "true") {
      postContent.contentEditable = "false";
      editPostBtn.textContent = "Edit Post";
    } else {
      postContent.contentEditable = "true";
      postContent.focus();
      editPostBtn.textContent = "Save Edit";
    }
  });

  postContent.addEventListener("blur", () => {
    if (postContent.contentEditable === "true") {
      setTimeout(() => {
        postContent.contentEditable = "false";
        editPostBtn.textContent = "Edit Post";
      }, 100);
    }
  });
}
