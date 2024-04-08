import Button from './Button.js';
import API from './API.js';

export default class Comment {
    constructor(postId, comment) {
      this.postId = postId;
      this.comment = comment;
      this.commentItem = document.createElement("li");
      this.commentItem.className = "list-group-item";
      this.createCommentElement();
    }
  
    createCommentElement() {
      const commentText = document.createElement("span");
      commentText.textContent = this.comment.comment_content;
  
      const deleteButton = new Button(
        "Delete",
        "btn-danger float-end"
      ).getElement();
      deleteButton.addEventListener("click", async () => {
        await API.deleteComment(this.postId, this.comment.comment_id);
        this.commentItem.remove();
      });
  
      const editCommentButton = new Button(
        "Edit Comment",
        "btn-primary float-end"
      ).getElement();
      editCommentButton.addEventListener("click", () => {
        if (editCommentButton.textContent === "Edit Comment") {
          commentText.contentEditable = true;
          editCommentButton.textContent = "Save Edit";
          editCommentButton.classList.replace("btn-primary", "btn-success");
        } else {
          commentText.contentEditable = false;
          editCommentButton.textContent = "Edit Comment";
          editCommentButton.classList.replace("btn-success", "btn-primary");
          API.editComment(
            this.postId,
            this.comment.comment_id,
            commentText.textContent
          );
        }
      });
  
      this.commentItem.append(commentText, deleteButton, editCommentButton);
    }
  
    getCommentItem() {
      return this.commentItem;
    }
  }