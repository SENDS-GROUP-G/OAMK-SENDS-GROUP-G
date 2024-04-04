const backendUrl = 'http://localhost:3001';

// Fetch posts
fetch(`${backendUrl}`)
  .then(response => response.json())
  .then(data => {
    const postsContainer = document.getElementById('posts');

    data.forEach(post => {
      const postElement = createPostElement(post);
      postsContainer.appendChild(postElement);
    });
  })
  .catch(error => console.error('Error fetching posts:', error));

// Create post element
function createPostElement(post) {
  const postElement = document.createElement('div');
  postElement.classList.add('post');

  const postHeader = document.createElement('div');
  postHeader.classList.add('post-header');

  const userIdElement = document.createElement('span');
  userIdElement.textContent = `User ID: ${post.userId}`;
  postHeader.appendChild(userIdElement);

  const likeCountElement = document.createElement('span');
  likeCountElement.textContent = `Likes: ${post.likeCount}`;
  postHeader.appendChild(likeCountElement);

  postElement.appendChild(postHeader);

  const postContentElement = document.createElement('p');
  postContentElement.classList.add('post-content');
  postContentElement.textContent = post.content;
  postElement.appendChild(postContentElement);

  const commentsContainer = document.createElement('div');
  commentsContainer.classList.add('comments');
  postElement.appendChild(commentsContainer);

  // Fetch comments for the post
  fetch(`${backendUrl}/posts/${post.postId}/comments`)
    .then(response => response.json())
    .then(comments => {
      comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsContainer.appendChild(commentElement);
      });
    })
    .catch(error => console.error(`Error fetching comments for post ${post.postId}:`, error));

  return postElement;
}

// Create comment element
function createCommentElement(comment) {
  const commentElement = document.createElement('div');
  commentElement.classList.add('comment');

  const userIdElement = document.createElement('span');
  userIdElement.textContent = `User ID: ${comment.userId}`;
  commentElement.appendChild(userIdElement);

  const commentContentElement = document.createElement('p');
  commentContentElement.textContent = comment.commentContent;
  commentElement.appendChild(commentContentElement);

  return commentElement;
}