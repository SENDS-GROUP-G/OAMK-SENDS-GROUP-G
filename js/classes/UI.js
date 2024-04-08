import Button from './Button.js';
import Post from './Post.js';
import Comment from './Comment.js';

export default class UI {
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