import { createPost } from './addpost.js';
import { createComment, createCommentInput } from './comment.js';

const postInput = document.getElementById('postInput');
const addPostBtn = document.getElementById('addPostBtn');
const postsContainer = document.getElementById('postsContainer');

addPostBtn.addEventListener('click', createPostFromInput);
postInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        createPostFromInput();
    }
});

function createPostFromInput() {
    const postContent = postInput.value;
    if (postContent.trim() !== '') {
        createPost(postContent);
        postInput.value = '';
    }
}

postsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-post-btn')) {
        const post = event.target.closest('.post');
        post.remove();
    } else if (event.target.classList.contains('comment-btn')) {
        const post = event.target.closest('.post');
        const commentsSection = post.querySelector('.comments');
        if (commentsSection.querySelector('input')) return;
        const commentInput = createCommentInput(commentsSection);
    }
});