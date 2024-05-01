import Button from "./Button.js";
import API from "./API.js";
import Comment from "./Comment.js";

export default class Post {
  constructor(post) {
    this.post = post;
    this.postElement = this.createElement("div", "card");
    this.createPostElement();
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  }

  timeAgo(saved) {
    const diffInMilliseconds = new Date() - new Date(saved);
    const units = [
      { name: 'year', value: 60 * 60 * 24 * 365 },
      { name: 'month', value: 60 * 60 * 24 * 30 },
      { name: 'week', value: 60 * 60 * 24 * 7 },
      { name: 'day', value: 60 * 60 * 24 },
      { name: 'hour', value: 60 * 60 },
      { name: 'minute', value: 60 },
    ];
    for (const unit of units) {
      const diff = Math.floor(diffInMilliseconds / 1000 / unit.value);
      if (diff > 0) return `${diff} ${unit.name}(s) ago`;
    }
    return `a moment ago`;
  }

  async createPostElement() {
    const loggedInUserId = localStorage.getItem("user_id");
    const deletePostButton = new Button("Delete post", "btn-danger").getElement();
    deletePostButton.addEventListener("click", async () => {
      await API.deletePost(this.post.post_id);
      this.postElement.remove();
    });

    const titleElement = this.createElement("h2", "card-title");
    const titleLink = this.createElement("a", "");
    titleLink.href = `/post.html?post_id=${this.post.post_id}`;
    titleLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `/post.html?post_id=${this.post.post_id}`;
    });
    titleLink.appendChild(titleElement);

    const contentElement = this.createElement("p", "card-text");

    const userNameElement = this.createElement("a", "post-user-name");
    userNameElement.href = `/user.html?user_id=${this.post.user_id}`;
    userNameElement.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `/user.html?user_id=${this.post.user_id}`;
    });

    const editPostButton = new Button("Edit post", "btn-primary").getElement();
    if (Number(this.post.user_id === Number(loggedInUserId))) {
      deletePostButton.style.display = "block";
      editPostButton.style.display = "block";
    } else {
      deletePostButton.style.display = "none";
      editPostButton.style.display = "none";
    }
    userNameElement.textContent = `Posted by ${this.post.user_name}`;

    const timeAgoElement = this.createElement("span", "post-time-ago");
    timeAgoElement.textContent = `Posted ${this.timeAgo(this.post.saved)}`;

    editPostButton.addEventListener("click", async () => {
      if (editPostButton.textContent === "Edit post") {
        titleElement.contentEditable = true;
        contentElement.contentEditable = true;
        editPostButton.textContent = "Save Edit";
        editPostButton.classList.replace("btn-primary", "btn-success");
      } else {
        titleElement.contentEditable = false;
        contentElement.contentEditable = false;
        editPostButton.textContent = "Edit post";
        editPostButton.classList.replace("btn-success", "btn-primary");
        const updatedPost = await API.editPost(
          this.post.post_id,
          titleElement.textContent,
          contentElement.textContent
        );
        userNameElement.textContent = `Posted by ${this.post.user_name}`;
      }
    });

    const commentsElement = this.createElement("div", "list-group");
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

    const commentButton = new Button("Comment", "btn-secondary").getElement();
    const commentInput = this.createElement("input", "form-control mb-2");
    commentInput.type = "text";
    commentInput.placeholder = "Add a comment";
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
        }
      }
    });

    titleElement.textContent = this.post.title;
    contentElement.textContent = this.post.post_content;

    this.postElement.append(
      deletePostButton,
      editPostButton,
      titleLink,
      contentElement,
      userNameElement,
      timeAgoElement,
      commentsElement,
      reactButton,
      commentButton,
      commentInput,
      postCommentButton
    );
  }
}