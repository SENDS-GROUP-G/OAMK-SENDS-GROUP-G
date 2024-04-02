export function createCommentInput(commentsSection, username) {
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
      const time = new Date().toLocaleString();
      createComment(commentsSection, commentText, "User name", time);
      commentInput.remove();
      submitCommentBtn.remove();
    }
  });

  commentInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const commentText = commentInput.value;
      if (commentText.trim() !== "") {
        const time = new Date().toLocaleString();
        createComment(commentsSection, commentText, "User name", time);
        commentInput.remove();
        submitCommentBtn.remove();
      }
    }
  });
}

export function createComment(commentsSection, text, username, time) {
  const comment = document.createElement("div");
  comment.classList.add("comment");
  comment.innerHTML = `
      <div class="comment-header">
        <span class="username">${username}</span>
        <span class="time">${time}</span>
      </div>
      <p class="comment-content" contenteditable="false">${text}</p>
      <button class="comment-like-btn">Like <span class="comment-like-count">0</span></button>
      <button class="reply-btn">Reply</button>
      <button class="delete-comment-btn">Delete Comment</button>
      <button class="edit-comment-btn">Edit Comment</button>
      <div class="replies"></div>
  `;
  commentsSection.appendChild(comment);

  const commentLikeBtn = comment.querySelector(".comment-like-btn");
  const commentLikeCount = comment.querySelector(".comment-like-count");
  const replyBtn = comment.querySelector(".reply-btn");
  const deleteCommentBtn = comment.querySelector(".delete-comment-btn");
  const editCommentBtn = comment.querySelector(".edit-comment-btn");
  const commentContent = comment.querySelector(".comment-content");
  const repliesSection = comment.querySelector(".replies");

  commentLikeBtn.addEventListener("click", () => {
    let count = parseInt(commentLikeCount.textContent);
    if (commentLikeBtn.classList.contains("liked")) {
      count--;
      commentLikeBtn.classList.remove("liked");
    } else {
      count++;
      commentLikeBtn.classList.add("liked");
    }
    commentLikeCount.textContent = count;
  });

  replyBtn.addEventListener("click", () => {
    import("./reply.js").then(({ createReplyInput }) => {
      if (repliesSection.querySelector("input")) return;
      const replyInput = createReplyInput(repliesSection);
    });
  });

  deleteCommentBtn.addEventListener("click", () => {
    comment.remove();
  });

  editCommentBtn.addEventListener("click", () => {
    if (commentContent.contentEditable === "false") {
      commentContent.contentEditable = "true";
      commentContent.focus();
      editCommentBtn.textContent = "Save Edit";
    } else {
      commentContent.contentEditable = "false";
      editCommentBtn.textContent = "Edit Comment";
    }
  });

  commentContent.addEventListener("blur", () => {
    if (commentContent.contentEditable === "true") {
      setTimeout(() => {
        commentContent.contentEditable = "false";
        editCommentBtn.textContent = "Edit Comment";
      }, 100);
    }
  });
}
