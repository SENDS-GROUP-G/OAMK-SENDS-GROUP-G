import { createReply } from "./reply.js";

export function createComment(commentsSection, text) {
  const comment = document.createElement("div");
  comment.classList.add("comment");
  comment.innerHTML = `
        <p>${text}</p>
        <button class="comment-like-btn">Like <span class="comment-like-count">0</span></button>
        <button class="reply-btn">Reply</button>
        <div class="replies"></div> 
    `;
  commentsSection.appendChild(comment);
  const commentLikeBtn = comment.querySelector(".comment-like-btn");
  const commentLikeCount = comment.querySelector(".comment-like-count");
  const replyBtn = comment.querySelector(".reply-btn");
  const repliesSection = comment.querySelector(".replies");

  commentLikeBtn.addEventListener("click", () => {
    let count = parseInt(commentLikeCount.textContent);
    if (commentLikeBtn.classList.contains("liked")) {
      // Check if already liked
      count--;
      commentLikeBtn.classList.remove("liked");
    } else {
      count++;
      commentLikeBtn.classList.add("liked");
    }
    commentLikeCount.textContent = count;
  });

  replyBtn.addEventListener("click", () => {
    if (repliesSection.querySelector("input")) return;

    const replyInput = document.createElement("input");
    replyInput.type = "text";
    replyInput.placeholder = "Add a reply...";

    const submitReplyBtn = document.createElement("button");
    submitReplyBtn.textContent = "Submit";

    repliesSection.appendChild(replyInput);
    repliesSection.appendChild(submitReplyBtn);

    submitReplyBtn.addEventListener("click", () => {
      const replyText = replyInput.value;
      if (replyText.trim() !== "") {
        createReply(repliesSection, replyText);
        replyInput.remove();
        submitReplyBtn.remove();
      }
    });
  });
}
