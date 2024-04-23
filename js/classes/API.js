export default class API {
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
  static sendFeedback(title, content) {
    return this.sendRequest(`${this.backendUrl}/feedbacks`, "POST", {
      title,
      content,
      user_id: 1, 
    });
  }
}
