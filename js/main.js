const BASE_URL = 'https://your-api-url.com';

// Fetch posts
fetch(`${BASE_URL}/posts`)
  .then(res => res.json())
  .then(data => {
    const postsSection = document.getElementById('posts');
    data.forEach(post => {
      const article = document.createElement('article');
      const title = document.createElement('h2');
      const content = document.createElement('p');
      const likesInfo = document.createElement('p');
      const commentsContainer = document.createElement('div');

      title.textContent = `Post ${post.postId}`;
      content.textContent = post.Content;
      likesInfo.textContent = `Likes: ${post.likeCount} (${post.likeState ? 'Liked' : 'Not Liked'})`;

      article.appendChild(title);
      article.appendChild(content);
      article.appendChild(likesInfo);
      postsSection.appendChild(article);

      // Fetch comments for this post
      fetch(`${BASE_URL}/posts/${post.postId}/comments`)
        .then(res => res.json())
        .then(commentsData => {
          commentsData.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.textContent = `${comment.commentContent} (User: ${comment.userId}, Comment ID: ${comment.commentId})`;
            commentsContainer.appendChild(commentElement);
          });
          article.appendChild(commentsContainer);
        })
        .catch(error => console.error(`Error fetching comments for post ${post.postId}:`, error));
    });
  })
  .catch(error => console.error('Error fetching posts:', error));