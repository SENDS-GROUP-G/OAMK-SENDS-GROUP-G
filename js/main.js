class Button {
  constructor(text, className, floatRight = false) {
    this.button = document.createElement("button");
    this.button.textContent = text;
    this.button.className = `btn ${className}`;
    if (floatRight) this.button.classList.add("float-end");
  }
  getElement() {
    return this.button;
  }
}

class Post {
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
      "Delete post",
      "btn-danger"
    ).getElement();
    deletePostButton.addEventListener("click", async () => {
      await API.deletePost(this.post.post_id);
      this.postElement.remove();
    });

    const editPostButton = new Button("Edit post", "btn-primary").getElement();
    editPostButton.addEventListener("click", () => {
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
      editPostButton,
      titleElement,
      contentElement,
      commentsElement,
      commentButton,
      commentInput,
      postCommentButton
    );
  }
}

class Comment {
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
class API {
  static backendUrl = "http://localhost:3001";
  static async sendRequest(url, method = "GET", body = null) {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
  static fetchPosts() {
    return this.sendRequest(`${this.backendUrl}/`);
  }
  static fetchComments(postId) {
    return this.sendRequest(`${this.backendUrl}/posts/${postId}/comments`);
  }
  static editComment(postId, commentId, newContent) {
    return this.sendRequest(
      `${this.backendUrl}/posts/${postId}/comments/${commentId}`,
      "PUT",
      {
        user_id: 2,
        comment_content: newContent,
      }
    );
  }
  static editPost(postId, newTitle, newContent) {
    return this.sendRequest(`${this.backendUrl}/posts/${postId}`, "PUT", {
      user_id: 1,
      title: newTitle,
      post_content: newContent,
    });
  }
  static addPost(title, postContent) {
    return this.sendRequest(`${this.backendUrl}/posts`, "POST", {
      user_id: 2,
      title,
      post_content: postContent,
    });
  }
  static deleteComment(postId, commentId) {
    return this.sendRequest(
      `${this.backendUrl}/posts/${postId}/comments/${commentId}`,
      "DELETE"
    );
  }
  static deletePost(postId) {
    return this.sendRequest(`${this.backendUrl}/posts/${postId}`, "DELETE");
  }
  static addComment(postId, commentContent) {
    return this.sendRequest(
      `${this.backendUrl}/posts/${postId}/comments`,
      "POST",
      {
        user_id: 1,
        comment_content: commentContent,
      }
    );
  }
}

class UI {
  static createButton(text, className = "btn btn-primary", floatRight = false) {
    return new Button(text, className, floatRight).getElement();
  }
  static makeEditable(element, saveCallback, button) {
    element.contentEditable = true;
    button.textContent = "Save Edit";
    button.classList.replace("btn-primary", "btn-success");

    const saveEdit = async () => {
      if (button.textContent === "Save Edit") {
        const newContent = element.textContent;
        if (newContent) {
          await saveCallback(newContent);
          element.contentEditable = false;
          button.textContent = "Edit post";
          button.classList.replace("btn-success", "btn-primary");
          button.removeEventListener("click", saveEdit); // Remove the event listener
        } else alert("Please enter content.");
      }
    };

    button.addEventListener("click", saveEdit);
  }
  static createPostElement(post) {
    return new Post(post).postElement;
  }
  static createCommentElement(postId, comment) {
    return new Comment(postId, comment).commentItem;
  }
}

class App {
  static async init() {
    document.getElementById("postBtn").addEventListener("click", async () => {
      const title = document.getElementById("postTitle").value;
      const postContent = document.getElementById("postContent").value;
      if (title && postContent) {
        const newPost = await API.addPost(title, postContent);
        const postsContainer = document.getElementById("posts");
        const postElement = UI.createPostElement(newPost);
        postsContainer.appendChild(postElement);
        const comments = await API.fetchComments(newPost.post_id);
        const commentsElement = postElement.querySelector(".comments");
        comments.forEach((comment) => {
          const commentItem = UI.createCommentElement(newPost.post_id, comment);
          commentsElement.appendChild(commentItem);
        });
        document.getElementById("postTitle").value = "";
        document.getElementById("postContent").value = "";
      } else alert("Please enter both title and content for the post.");
    });
    const posts = await API.fetchPosts();
    const postsContainer = document.getElementById("posts");
    posts.forEach(async (post) => {
      const postElement = UI.createPostElement(post);
      postsContainer.appendChild(postElement);
      const comments = await API.fetchComments(post.post_id);
      const commentsElement = postElement.querySelector(".comments");
      comments.forEach((comment) => {
        const commentItem = UI.createCommentElement(post.post_id, comment);
        commentsElement.appendChild(commentItem);
      });
    });
  }
}

App.init();
