const backendUrl = "http://localhost:3001";

async function fetchPosts() {
  try {
    const response = await fetch(`${backendUrl}/`);
    const posts = await response.json();
    const postsContainer = document.getElementById("posts");
    for (const post of posts) {
      const postElement = document.createElement("div");
      postElement.classList.add("post");

      const titleElement = document.createElement("h2");
      titleElement.textContent = post.title;
      postElement.appendChild(titleElement);

      const contentElement = document.createElement("p");
      contentElement.textContent = post.post_content;
      postElement.appendChild(contentElement);

      const commentsElement = document.createElement("div");
      commentsElement.textContent = "Loading comments...";
      postElement.appendChild(commentsElement);

      await fetchComments(post.post_id, commentsElement);

      postsContainer.appendChild(postElement);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

async function fetchComments(postId, commentsElement) {
  try {
    const response = await fetch(`${backendUrl}/posts/${postId}/comments`);
    const comments = await response.json();
    commentsElement.innerHTML = "";
    const commentsHeading = document.createElement("h3");
    commentsHeading.textContent = "Comments";
    commentsElement.appendChild(commentsHeading);

    if (comments.length === 0) {
      const noCommentsMessage = document.createElement("p");
      noCommentsMessage.textContent = "No comments yet.";
      commentsElement.appendChild(noCommentsMessage);
    } else {
      const commentsList = document.createElement("ul");
      comments.forEach((comment) => {
        const commentItem = document.createElement("li");
        commentItem.textContent = comment.comment_content;
        commentsList.appendChild(commentItem);
      });
      commentsElement.appendChild(commentsList);
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

fetchPosts();
