export default class API {
  static backendUrl = "http://localhost:3001";
  static async sendRequest(url, method = "GET", body = null) {
    const options = { method, headers: { "Content-Type": "application/json" } };
    if (body) {
      body.user_id = localStorage.getItem("user_id");
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
  static fetchPost(postId) {
    return this.sendRequest(`${this.backendUrl}/posts/${postId}`);
  }
  static registerAccount(email, userName, password) {
    return this.sendRequest(`${this.backendUrl}/register`, "POST", {
      email,
      user_name: userName,
      password,
    });
  }
  static loginAccount(email, password) {
    return this.sendRequest(`${this.backendUrl}/users/login`, "POST", {
      email,
      password,
    });
  }
  static fetchPosts() {
    return this.sendRequest(`${this.backendUrl}`);
  }
  static fetchComments(postId) {
    return this.sendRequest(`${this.backendUrl}/posts/${postId}/comments`);
  }
  static addPost(title, postContent) {
    return this.sendRequest(`${this.backendUrl}/posts`, "POST", {
      title,
      post_content: postContent,
    });
  }
  static editPost(postId, newTitle, newContent) {
    return this.sendRequest(`${this.backendUrl}/posts/${postId}`, "PUT", {
      title: newTitle,
      post_content: newContent,
    });
  }
  static deletePost(postId) {
    return this.sendRequest(`${this.backendUrl}/posts/${postId}`, "DELETE");
  }
  static addComment(postId, commentContent) {
    return this.sendRequest(
      `${this.backendUrl}/posts/${postId}/comments`,
      "POST",
      { comment_content: commentContent }
    );
  }
  static editComment(postId, commentId, newContent) {
    return this.sendRequest(
      `${this.backendUrl}/posts/${postId}/comments/${commentId}`,
      "PUT",
      { comment_content: newContent }
    );
  }
  static deleteComment(postId, commentId) {
    return this.sendRequest(
      `${this.backendUrl}/posts/${postId}/comments/${commentId}`,
      "DELETE"
    );
  }
  static fetchReactions(postId) {
    const userId = localStorage.getItem("user_id");
    return this.sendRequest(
      `${this.backendUrl}/posts/${postId}/reacts?user_id=${userId}`,
      "GET"
    );
  }
  static addReaction(postId, reactId) {
    return this.sendRequest(
      `${this.backendUrl}/posts/${postId}/reacts`,
      "POST",
      { react_id: reactId, user_id: localStorage.getItem("user_id") }
    );
  }
  static removeReactcion(postId) {
    const userId = localStorage.getItem("user_id");
    return this.sendRequest(
      `${this.backendUrl}/posts/${postId}/reacts`,
      "DELETE",
      { user_id: userId }
    );
  }
  static fetchUser(user_id) {
    return this.sendRequest(`${this.backendUrl}/users/${user_id}`);
  }
  static fetchUserAndPosts(userId) {
    return this.sendRequest(`${this.backendUrl}/user/${userId}`);
  }
  static deleteUser(userId, password) {
    return this.sendRequest(
      `${this.backendUrl}/delete/users/${userId}`,
      "DELETE",
      {
        password,
      }
    );
  }
  static sendFeedback(title, content) {
    return this.sendRequest(`${this.backendUrl}/feedbacks`, "POST", {
      title,
      content,
      user_id: localStorage.getItem("user_id"),
    });
  }
}
