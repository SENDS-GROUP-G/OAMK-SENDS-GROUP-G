const postInput = document.getElementById('postInput');
const addPostBtn = document.getElementById('addPostBtn');
const postsContainer = document.getElementById('postsContainer');

addPostBtn.addEventListener('click', () => {
    const postContent = postInput.value;
    if (postContent.trim() !== '') { 
        createPost(postContent);
        postInput.value = '';
    }
});

function createPost(content) {
    const post = document.createElement('div');
    post.classList.add('post');
    post.innerHTML = ` 
        <div class="post-header">
            <h3>User Name</h3> 
            <span class="time">${new Date().toLocaleString()}</span>
            <button class="delete-post-btn">Delete Post</button> 
        </div>
        <p>${content}</p>
        <div class="post-actions">
            <button class="like-btn">Like <span class="like-count">0</span></button> 
            <button class="comment-btn">Comment</button>
        </div>
        <div class="comments">
        </div> 
    `;
    postsContainer.appendChild(post);

    const likeBtn = post.querySelector('.like-btn');
    const likeCount = post.querySelector('.like-count');
    const commentsSection = post.querySelector('.comments');
    const commentBtn = post.querySelector('.comment-btn');

    likeBtn.addEventListener('click', () => {
        let count = parseInt(likeCount.textContent);
    if(likeBtn.classList.contains('liked')) { // Check if already likedf
        count--;
        likeBtn.classList.remove('liked'); // Remove liked class
    } else {
        count++;
        likeBtn.classList.add('liked') // Add liked class
    }
    likeCount.textContent = count;
    });

    commentBtn.addEventListener('click', () => {
        if (commentsSection.querySelector('input')) return; 

        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.placeholder = 'Add a comment...';

        const submitCommentBtn = document.createElement('button');
        submitCommentBtn.textContent = 'Submit';

        commentsSection.appendChild(commentInput);
        commentsSection.appendChild(submitCommentBtn);

        submitCommentBtn.addEventListener('click', () => {
            const commentText = commentInput.value;
            if (commentText.trim() !== '') {
                createComment(commentsSection, commentText);
                commentInput.remove(); 
                submitCommentBtn.remove(); 
            }
        });
    });
}

function createComment(commentsSection, text) {
    const comment = document.createElement('div');
    comment.classList.add('comment');
    comment.innerHTML = `
        <p>${text}</p>
        <button class="comment-like-btn">Like <span class="comment-like-count">0</span></button>
        <button class="reply-btn">Reply</button>
        <div class="replies"></div> 
    `;
    commentsSection.appendChild(comment);
const commentLikeBtn = comment.querySelector('.comment-like-btn');
    const commentLikeCount = comment.querySelector('.comment-like-count');

    commentLikeBtn.addEventListener('click', () => {
        let count = parseInt(commentLikeCount.textContent);
        if (commentLikeBtn.classList.contains('liked')) { // Check if already liked
            count--;
            commentLikeBtn.classList.remove('liked');
        } else {
            count++;
            commentLikeBtn.classList.add('liked');
        }
        commentLikeCount.textContent = count;
    });    
}

postsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-post-btn')) {
        const post = event.target.closest('.post');
        post.remove(); 
    } else if (event.target.classList.contains('delete-comment-btn')) {
        const comment = event.target.closest('.comment');
        comment.remove(); 
    } else if (event.target.classList.contains('reply-btn')) {
        const comment = event.target.closest('.comment');
        const repliesSection = comment.querySelector('.replies');

        const replyInput = document.createElement('input');
        replyInput.type = 'text';
        replyInput.placeholder = 'Add a reply...';

        const submitReplyBtn = document.createElement('button');
        submitReplyBtn.textContent = 'Submit';

        repliesSection.appendChild(replyInput);
        repliesSection.appendChild(submitReplyBtn);

        submitReplyBtn.addEventListener('click', () => {
            const replyText = replyInput.value;
            if (replyText.trim() !== '') {
                createReply(repliesSection, replyText);
                replyInput.remove();
                submitReplyBtn.remove();
            }
        });
    }
});

function createReply(repliesSection, text) { 
    const reply = document.createElement('div');
    reply.classList.add('reply');
    reply.innerHTML = `<p>${text}</p>`;
    repliesSection.appendChild(reply);
} 
