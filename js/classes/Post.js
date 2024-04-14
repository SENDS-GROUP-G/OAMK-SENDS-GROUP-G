import Button from './Button.js';
import API from './API.js';
import Comment from './Comment.js';

export default class Post {
  constructor(post) {
    this.post = post;
    this.postElement = this.createElement("div", "card");
    this.saveEdit = null;
    this.createPostElement();
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  }

   async createPostElement() {
    const deletePostButton = new Button(
      "",
      "delBtn"
    ).getElement();
    deletePostButton.addEventListener("click", async () => {
      await API.deletePost(this.post.post_id);
      this.postElement.remove();
    });

    const editPostButton = new Button("Edit", "editBtn").getElement();
    editPostButton.addEventListener("click", () => {
      if (editPostButton.textContent === "Edit") {
        titleElement.contentEditable = true;
        contentElement.contentEditable = true;
        editPostButton.textContent = "Save Edit";
        editPostButton.classList.replace("editBtn", "saveBtn");
      } else {
        titleElement.contentEditable = false;
        contentElement.contentEditable = false;
        editPostButton.textContent = "Edit";
        editPostButton.classList.replace("saveBtn", "editBtn");
        API.editPost(
          this.post.post_id,
          titleElement.textContent,
          contentElement.textContent
        );
      }
    });

    const titleElement = this.createElement("h2", "card-title");
    titleElement.textContent = this.post.title;
    const contentElement = this.createElement("p", "card-text");
    contentElement.textContent = this.post.post_content;

    const commentsElement = this.createElement("div", "list-group");
    const comments = await API.fetchComments(this.post.post_id);
    comments.forEach((comment) => {
      const commentItem = new Comment(
        this.post.post_id,
        comment
      ).getCommentItem();
      commentsElement.appendChild(commentItem);
    });

    const commentButton = new Button("Comment", "btn-secondary").getElement();
    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.placeholder = "Add a comment";
    commentInput.className = "form-control mb-2";
    commentInput.style.display = "none";

    const postCommentButton = new Button(
      "Post comment",
      "btn-primary"
    ).getElement();
    postCommentButton.style.display = "none";

    commentButton.addEventListener("click", () => {
      commentInput.style.display = "block";
      postCommentButton.style.display = "block";
    });

    postCommentButton.addEventListener("click", async () => {
      const commentContent = commentInput.value;
      if (commentContent) {
        const newComment = await API.addComment(
          this.post.post_id,
          commentContent
        );
        if (newComment) {
          const commentItem = new Comment(
            this.post.post_id,
            newComment
          ).getCommentItem();
          commentsElement.appendChild(commentItem);
          commentInput.value = "";
          commentInput.style.display = "none";
          postCommentButton.style.display = "none";
        } else {
          alert("Failed to post comment.");
        }
      } else {
        alert("Please enter a comment.");
      }
    });

    this.postElement.append(
      deletePostButton,
      titleElement,
      contentElement,
      editPostButton,
      commentsElement,
      commentButton,
      commentInput,
      postCommentButton
    );
  }
}
