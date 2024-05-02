import Button from './Button.js';
import API from './API.js';

export default class Comment {
    constructor(postId, comment) {
      this.postId = postId;
      this.comment = comment;
      this.commentItem = document.createElement("li");
      this.commentItem.className = "comment";
      this.createCommentElement();
    }
  
    createCommentElement() {
      const nameText = document.createElement("p")
      // Use the username from the comment data
      nameText.textContent = this.comment.user_name;
      nameText.className = "cmt-user-name";
      const commentText = document.createElement("pre");
      commentText.textContent = this.comment.comment_content;
      commentText.className = "cmt-text";
  
      const deleteButton = new Button(
        "",
        "cmtDelBtn"
      ).getElement();
      deleteButton.addEventListener("click", async () => {
        await API.deleteComment(this.postId, this.comment.comment_id);
        this.commentItem.remove();
      });
  
      const editCommentButton = new Button(
        "",
        "cmtEditBtn"
      ).getElement();
      editCommentButton.addEventListener("click", () => {
        if (editCommentButton.textContent === "") {
          deleteButton.style.pointerEvents = "none";
          deleteButton.classList.replace("cmtDelBtn","disabled");
          commentText.contentEditable = true;
          editCommentButton.textContent = "Save";
          editCommentButton.classList.replace("cmtEditBtn", "cmtSaveBtn");
        } else {
          deleteButton.style.pointerEvents = "auto";
          deleteButton.classList.replace("disabled","cmtDelBtn");
          commentText.contentEditable = false;
          editCommentButton.textContent = "";
          editCommentButton.classList.replace("cmtSaveBtn", "cmtEditBtn");
          API.editComment(
            this.postId,
            this.comment.comment_id,
            commentText.textContent
          );
        }
      });
  
      this.commentItem.append(nameText, commentText, editCommentButton, deleteButton);

    }
  
    getCommentItem() {
      return this.commentItem;
    }
  }