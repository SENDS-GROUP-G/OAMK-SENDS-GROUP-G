const backendUrl = "http://localhost:3001";

function createButton(text, className, floatRight = false) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add(className);
  if (floatRight) {
    button.style.float = "right";
  }
  return button;
}

function makeEditable(element, saveCallback, button) {
  element.contentEditable = true;
  button.textContent = "Save Edit";
  element.addEventListener("blur", async () => {
    const newContent = element.textContent;
    if (newContent) {
      await saveCallback(newContent);
      element.textContent = newContent;
      element.contentEditable = false;
      button.textContent = "Edit Comment";
    } else {
      alert("Please enter content.");
    }
  });
}


async function sendPutRequest(url, body) {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending PUT request:", error);
  }
}

async function fetchPosts() {
  try {
    const response = await fetch(`${backendUrl}/`);
    const posts = await response.json();
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";
    for (const post of posts) {
      const postElement = createPostElement(post);
      postsContainer.appendChild(postElement);
      fetchComments(post.post_id, postElement);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

async function fetchComments(postId, postElement) {
  try {
    const response = await fetch(`${backendUrl}/posts/${postId}/comments`);
    const comments = await response.json();
    const commentsElement = postElement.querySelector(".comments");
    commentsElement.innerHTML = "";

    const commentsHeading = document.createElement("h3");
    commentsHeading.textContent = "Comments";
    commentsElement.appendChild(commentsHeading);

    const commentsList = document.createElement("ul");
    commentsList.id = `comments-${postId}`;
    comments.forEach((comment) => {
      const commentItem = createCommentElement(postId, comment);
      commentsList.appendChild(commentItem);
    });
    commentsElement.appendChild(commentsList);

    if (comments.length === 0) {
      const noCommentsMessage = document.createElement("p");
      noCommentsMessage.textContent = "No comments yet.";
      commentsElement.appendChild(noCommentsMessage);
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  const deletePostButton = createButton("Delete post", "delete-post-btn");
  deletePostButton.addEventListener("click", async () => {
    await deletePost(post.post_id);
    postElement.remove();
  });
  postElement.appendChild(deletePostButton);

  const editPostButton = createButton("Edit post", "edit-post-btn");
  postElement.appendChild(editPostButton);

  const titleElement = document.createElement("h2");
  titleElement.textContent = post.title;
  postElement.appendChild(titleElement);

  const contentElement = document.createElement("p");
  contentElement.textContent = post.post_content;
  postElement.appendChild(contentElement);

  editPostButton.addEventListener("click", () => {
    makeEditable(titleElement, async (newTitle) => {
      await sendPutRequest(`${backendUrl}/posts/${post.post_id}`, {
        user_id: 2,
        title: newTitle,
      });
    });
    makeEditable(contentElement, async (newContent) => {
      await sendPutRequest(`${backendUrl}/posts/${post.post_id}`, {
        user_id: 2,
        post_content: newContent,
      });
    });
  });

  const commentsElement = document.createElement("div");
  commentsElement.classList.add("comments");
  postElement.appendChild(commentsElement);

  const commentButton = createButton("Comment", "comment-btn");
  postElement.appendChild(commentButton);

  const commentInput = document.createElement("input");
  commentInput.type = "text";
  commentInput.placeholder = "Add a comment";
  commentInput.style.display = "none";
  postElement.appendChild(commentInput);

  const postCommentButton = createButton("Post comment", "post-comment-btn");
  postCommentButton.style.display = "none";
  postElement.appendChild(postCommentButton);

  commentButton.addEventListener("click", () => {
    commentInput.style.display = "block";
    postCommentButton.style.display = "block";
  });

  postCommentButton.addEventListener("click", async () => {
    const commentContent = commentInput.value;
    if (commentContent) {
      const newComment = await addComment(post.post_id, commentContent);
      const commentItem = createCommentElement(post.post_id, newComment);
      const commentsList = postElement.querySelector(
        `#comments-${post.post_id}`
      );
      commentsList.appendChild(commentItem);
      commentInput.value = "";
      commentInput.style.display = "none";
      postCommentButton.style.display = "none";
    } else {
      alert("Please enter a comment.");
    }
  });

  return postElement;
}


async function editComment(postId, commentId, newContent) {
  try {
    const response = await fetch(`${backendUrl}/posts/${postId}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: 2,
        comment_content: newContent,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const comment = await response.json();
    return comment;
  } catch (error) {
    console.error("Error editing comment:", error);
  }
}

async function editPost(postId, newTitle, newContent) {
  try {
    const response = await fetch(`${backendUrl}/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: 1,
        title: newTitle,
        post_content: newContent,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const post = await response.json();
    return post;
  } catch (error) {
    console.error("Error editing post:", error);
  }
}

function createCommentElement(postId, comment) {
  const commentItem = document.createElement("li");
  commentItem.contentEditable = false;

  const commentText = document.createElement("span");
  commentText.textContent = comment.comment_content;
  commentItem.appendChild(commentText);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.style.float = "right";
  deleteButton.addEventListener("click", async () => {
    await deleteComment(postId, comment.comment_id);
    commentItem.remove();
  });
  commentItem.appendChild(deleteButton);

  const editCommentButton = createButton("Edit Comment", "edit-comment-btn", true);
  editCommentButton.addEventListener("click", () => {
    makeEditable(commentText, async (newContent) => {
      await sendPutRequest(`${backendUrl}/posts/${postId}/comments/${comment.comment_id}`, {
        user_id: 2,
        comment_content: newContent,
      });
    }, editCommentButton);
  });
  commentItem.appendChild(editCommentButton);

  return commentItem;
}

async function addPost(title, postContent) {
  try {
    const response = await fetch(`${backendUrl}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: 2,
        title: title,
        post_content: postContent,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const post = await response.json();
    return post;
  } catch (error) {
    console.error("Error adding post:", error);
  }
}

async function deleteComment(postId, commentId) {
  try {
    const response = await fetch(
      `${backendUrl}/posts/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return commentId;
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
}

async function deletePost(postId) {
  try {
    const response = await fetch(`${backendUrl}/posts/${postId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return postId;
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}

async function addComment(postId, commentContent) {
  try {
    const response = await fetch(`${backendUrl}/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: 1,
        comment_content: commentContent,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const comment = await response.json();
    return comment;
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

document.getElementById("postBtn").addEventListener("click", async () => {
  const title = document.getElementById("postTitle").value;
  const postContent = document.getElementById("postContent").value;
  if (title && postContent) {
    const newPost = await addPost(title, postContent);
    const postsContainer = document.getElementById("posts");
    const postElement = createPostElement(newPost);
    postsContainer.appendChild(postElement);
    fetchComments(newPost.post_id, postElement);
    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";
  } else {
    alert("Please enter both title and content for the post.");
  }
});

fetchPosts();