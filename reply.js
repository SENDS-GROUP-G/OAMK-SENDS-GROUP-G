export function createReply(repliesSection, text) { 
    const reply = document.createElement('div');
    reply.classList.add('reply');
    reply.innerHTML = `<p>${text}</p>`;
    repliesSection.appendChild(reply);
} 