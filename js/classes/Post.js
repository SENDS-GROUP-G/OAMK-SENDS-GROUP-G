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

  timeAgo(saved) {
    const savedDate = new Date(saved);
    const now = new Date();
    const diffInMilliseconds = now - savedDate;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInYears > 0) return `${diffInYears} year(s) ago`;
    if (diffInMonths > 0) return `${diffInMonths} month(s) ago`;
    if (diffInWeeks > 0) return `${diffInWeeks} week(s) ago`;
    if (diffInDays > 0) return `${diffInDays} day(s) ago`;
    if (diffInHours > 0) return `${diffInHours} hour(s) ago`;
    if (diffInMinutes > 0) return `${diffInMinutes} minute(s) ago`;
    return `a moment ago`;
  }

   async createPostElement() {
    const deletePostButton = new Button("", "delBtn").getElement();
    deletePostButton.addEventListener("click", async () => {
      await API.deletePost(this.post.post_id);
      this.postElement.remove();
    });

    const editPostButton = new Button("Edit", "editBtn").getElement();
    editPostButton.addEventListener("click", async () => {
      if (editPostButton.textContent === "Edit") {
        titleElement.contentEditable = true;
        contentElement.contentEditable = true;
        editPostButton.textContent = "Save";
        editPostButton.classList.replace("editBtn", "saveBtn");
      } else {
        titleElement.contentEditable = false;
        contentElement.contentEditable = false;
        editPostButton.textContent = "Edit";
        editPostButton.classList.replace("saveBtn", "editBtn");
        const updatedPost = await API.editPost(
          this.post.post_id,
          titleElement.textContent,
          contentElement.textContent
        );
        userNameElement.textContent = `Posted by ${this.post.user_name}`;
      }
    });

    const titleElement = this.createElement("h2", "card-title");
    const titleLink = this.createElement("a", "");
    titleLink.href = `/post.html?post_id=${this.post.post_id}`;
    titleLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `/post.html?post_id=${this.post.post_id}`;
    });
    titleLink.appendChild(titleElement);
    const contentElement = this.createElement("pre", "card-text");
    const userNameElement = this.createElement("span", "post-user-name");
    const user = await API.fetchUser(this.post.user_id);
    this.post.user_name = user.user_name;
    userNameElement.textContent = `Posted by ${this.post.user_name}`;

    const timeAgoElement = this.createElement("span", "post-time-ago");
    timeAgoElement.textContent = `Posted ${this.timeAgo(this.post.saved)}`;

    const commentsElement = this.createElement("div", "cmt-list");
    const comments = await API.fetchComments(this.post.post_id);
    comments.forEach((comment) => {
      const commentItem = new Comment(
        this.post.post_id,
        comment
      ).getCommentItem();
      commentsElement.appendChild(commentItem);
    });

    const reactButton = this.createElement("button", "btn btn-secondary");
    let hasReacted = false;
    let reactionCount = 0;

    const updateReactButton = () => {
      reactButton.textContent = `React (${reactionCount})`;
      reactButton.className = hasReacted
        ? "btn btn-success"
        : "btn btn-secondary";
    };

    reactButton.addEventListener("click", async () => {
      if (hasReacted) {
        await API.removeReactcion(this.post.post_id);
        reactionCount--;
      } else {
        await API.addReaction(this.post.post_id, 1); 
        reactionCount++;
      }
      hasReacted = !hasReacted;
      updateReactButton();
    });

    const reactions = await API.fetchReactions(this.post.post_id);
    hasReacted = reactions.userReacted;
    reactionCount = reactions.reactions;
    updateReactButton();

    const commentButton = new Button("Comment", "cmtBtn").getElement();
    const commentInput = document.createElement("input", "form-control mb-2");
    commentInput.type = "text";
    commentInput.placeholder = "Add a comment";
    commentInput.style.display = "none";

    const postCommentButton = new Button(
      "Post comment",
      "postCmtBtn"
    ).getElement();
    postCommentButton.style.display = "none";

    commentButton.addEventListener("click", () => {
      if (commentInput.style.display === "none") {
        commentInput.style.display = "block";
        postCommentButton.style.display = "block";
      } else {
        commentInput.style.display = "none";
        postCommentButton.style.display = "none";
      }
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

    titleElement.textContent = this.post.title;
    contentElement.textContent = this.post.post_content;

    this.postElement.append(
      deletePostButton,
      titleLink,
      userNameElement,
      timeAgoElement,
      contentElement,
      editPostButton,
      reactButton,
      commentButton,
      commentsElement,
      commentInput,
      postCommentButton
    );
  }
}
