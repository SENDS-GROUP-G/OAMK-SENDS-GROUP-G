export function createReplyInput(repliesSection) {
    const replyInput = document.createElement("input");
    replyInput.type = "text";
    replyInput.placeholder = "Add a reply...";

    const submitReplyBtn = document.createElement("button");
    submitReplyBtn.textContent = "Submit";

    repliesSection.appendChild(replyInput);
    repliesSection.appendChild(submitReplyBtn);

    submitReplyBtn.addEventListener("click", () => {
        const replyText = replyInput.value;
        if (replyText.trim() !== "") {
            const time = new Date().toLocaleString();
            createReply(repliesSection, replyText, "User name", time);
            replyInput.remove();
            submitReplyBtn.remove();
        }
    });

    replyInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const replyText = replyInput.value;
            if (replyText.trim() !== "") {
                const time = new Date().toLocaleString();
                createReply(repliesSection, replyText, "User name", time);
                replyInput.remove();
                submitReplyBtn.remove();
            }
        }
    });
}

export function createReply(repliesSection, text, username, time) {
    const reply = document.createElement("div");
    reply.classList.add("reply");
    reply.innerHTML = `
            <div class="reply-header">
                <span class="username">${username}</span>
                <span class="time">${time}</span>
            </div>
            <p class="reply-content" contenteditable="false">${text}</p>
            <button class="reply-like-btn">Like <span class="reply-like-count">0</span></button>
            <button class="edit-reply-btn">Edit Reply</button>
            <button class="delete-reply-btn">Delete Reply</button>
    `;
    repliesSection.appendChild(reply);

    const replyLikeBtn = reply.querySelector(".reply-like-btn");
    const replyLikeCount = reply.querySelector(".reply-like-count");
    const editReplyBtn = reply.querySelector(".edit-reply-btn");
    const deleteReplyBtn = reply.querySelector(".delete-reply-btn");
    const replyContent = reply.querySelector(".reply-content");

    replyLikeBtn.addEventListener("click", () => {
        let count = parseInt(replyLikeCount.textContent);
        if (replyLikeBtn.classList.contains("liked")) {
            count--;
            replyLikeBtn.classList.remove("liked");
        } else {
            count++;
            replyLikeBtn.classList.add("liked");
        }
        replyLikeCount.textContent = count;
    });

    editReplyBtn.addEventListener("click", () => {
        if (replyContent.contentEditable === "false") {
            replyContent.contentEditable = "true";
            replyContent.focus();
            editReplyBtn.textContent = "Save Edit";
        } else {
            replyContent.contentEditable = "false";
            editReplyBtn.textContent = "Edit Reply";
        }
    });

    replyContent.addEventListener("blur", () => {
        if (replyContent.contentEditable === "true") {
            setTimeout(() => {
                replyContent.contentEditable = "false";
                editReplyBtn.textContent = "Edit Reply";
            }, 100);
        }
    });

    deleteReplyBtn.addEventListener("click", () => {
        reply.remove();
    });
}