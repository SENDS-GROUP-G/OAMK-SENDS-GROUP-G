import { postInput, addPostBtn } from './domElements.js';
import { createPost } from './post.js';

addPostBtn.addEventListener('click', () => {
    const postContent = postInput.value;
    if (postContent.trim() !== '') { 
        createPost(postContent);
        postInput.value = '';
    }
});