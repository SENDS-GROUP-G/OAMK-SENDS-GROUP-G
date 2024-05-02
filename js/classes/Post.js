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

    if (diffInYears === 1) return `a year ago`;
    else if (diffInYears > 0) return `${diffInYears} years ago`;

    if (diffInMonths === 1) return `a month ago`;
    else if (diffInMonths > 0) return `${diffInMonths} months ago`;

    if (diffInWeeks === 1) return `a week ago`;
    else if (diffInWeeks > 0) return `${diffInWeeks} weeks ago`;

    if (diffInDays === 1) return `a day ago`;
    else if (diffInDays > 0) return `${diffInDays} days ago`;

    if (diffInHours === 1) return `an hour ago`;
    else if (diffInHours > 0) return `${diffInHours} hours ago`;

    if (diffInMinutes === 1) return `a minute ago`;
    else if (diffInMinutes > 0) return `${diffInMinutes} minutes ago`;

    return `a moment ago`;
  }

  async createPostElement() {
    const loggedInUserId = localStorage.getItem("user_id");

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
        titleLink.classList.add("disabled-link");
        deletePostButton.style.display = "none";
        editPostButton.textContent = "Save";
        editPostButton.classList.replace("editBtn", "saveBtn");
      } else {
        titleElement.contentEditable = false;
        contentElement.contentEditable = false;
        editPostButton.textContent = "Edit";
        titleLink.classList.remove("disabled-link");
        deletePostButton.style.display = "block";
        editPostButton.classList.replace("saveBtn", "editBtn");

        const updatedPost = await API.editPost(
          this.post.post_id,
          titleElement.textContent,
          contentElement.textContent
        );

        userNameElement.textContent = `${this.post.user_name}`;
      }
    });

    deletePostButton.style.display = "none";
    editPostButton.style.display = "none";

    if (Number(loggedInUserId) === Number(this.post.user_id)) {
      deletePostButton.style.display = "block";
      editPostButton.style.display = "block";
    }

    const titleElement = this.createElement("h2", "card-title");
    titleElement.textContent = this.post.title;
    const titleLink = this.createElement("a", "");
    titleLink.href = `/post.html?post_id=${this.post.post_id}`;

    titleLink.addEventListener("click", (e) => {
      if (titleLink.classList.contains("disabled-link")) {
        e.preventDefault();
      } else {
        window.location.href = `/post.html?post_id=${this.post.post_id}`;
      }
    });

    titleLink.appendChild(titleElement);
    const contentElement = this.createElement("pre", "card-text");
    contentElement.textContent = this.post.post_content;
    const userNameElement = this.createElement("span", "post-user-name");
    const userResponse = await API.fetchUser(this.post.user_id);
    if (userResponse && userResponse.user && userResponse.user.user_name) {
      this.post.user_name = userResponse.user.user_name;
      userNameElement.textContent = `${this.post.user_name}`;
    } else {
      console.log("User or username is undefined", userResponse);
    }

    const userNameLink = this.createElement("a", "");
    userNameLink.href = `http://127.0.0.1:5502/user.html?user_id=${this.post.user_id}`;

    userNameLink.appendChild(userNameElement);
    const timeAgoElement = this.createElement("span", "post-time-ago");
    timeAgoElement.textContent = `• ${this.timeAgo(this.post.saved)}`;

    const commentsElement = this.createElement("div", "cmt-list");

    const comments = await API.fetchComments(this.post.post_id);
    comments.forEach((comment) => {
      const commentItem = new Comment(
        this.post.post_id,
        comment
      ).getCommentItem();
      commentsElement.appendChild(commentItem);
    });

    const reactButton = new Button("", "reactBtn card-button").getElement();
    const reactIcon = this.createElement("img", "icons");
    const reactedIcon = this.createElement("img", "icons none");
    reactIcon.src = "icons/react.svg";
    reactedIcon.src = "icons/reacted.svg";
    const reactNumber = this.createElement("p", "react-number");
    reactButton.append(reactIcon, reactedIcon, reactNumber);

    let hasReacted = false;
    let reactionCount = 0;

    const updateReactButton = () => {
      reactNumber.textContent = `${reactionCount}`;
      reactButton.className = hasReacted
        ? "reactBtn card-button true"
        : "reactBtn card-button";
      reactedIcon.className = hasReacted ? "icons" : "icons none";
      reactIcon.className = hasReacted ? "icons none" : "icons";
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

    const commentButton = new Button("", "cmtBtn card-button").getElement();
    const commentIcon = this.createElement("img", "icons");
    commentIcon.src = "icons/comment.svg";
    commentButton.append(commentIcon);
    const commentInput = document.createElement("textarea");
    commentInput.addEventListener("input", function () {
      const currentContent = commentInput.value;
      let previousContent = "";
      if (commentInput.value && currentContent !== previousContent) {
        previousContent = currentContent;
        commentInput.style.height = `${commentInput.scrollHeight}px`;
        window.requestAnimationFrame(() => {
          commentInput.style.height = null;
          commentInput.style.height = `${commentInput.scrollHeight}px`;
        });
      } else {
        commentInput.style.height = `0px`;
      }
    });
    commentInput.classList.add("cmt-input");
    const commentusername = localStorage.getItem("username");
    commentInput.placeholder = `Comment as ${commentusername}`;
    commentInput.style.display = "none";

    const postCommentButton = new Button("", "postCmtBtn").getElement();
    postCommentButton.style.display = "none";

    commentButton.addEventListener("click", () => {
      if (commentInput.style.display === "none") {
        commentButton.classList.add("true");
        commentInput.style.display = "block";
        postCommentButton.style.display = "block";
      } else {
        commentButton.classList.remove("true");
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
          commentButton.classList.remove("true");
          commentInput.style.display = "none";
          postCommentButton.style.display = "none";

          commentInput.style.height = `0px`;
        } else {
          alert("Failed to post comment.");
        }
      }
    });
    const buttons = this.createElement("div", "buttons");
    buttons.append(reactButton, commentButton);

    const userNameContainer = this.createElement("div", "user");
    userNameContainer.append(userNameLink, timeAgoElement);

    this.postElement.append(
      deletePostButton,
      titleLink,
      userNameContainer,
      contentElement,
      editPostButton,
      buttons,
      commentsElement,

      commentInput,
      postCommentButton
    );
  }
}
