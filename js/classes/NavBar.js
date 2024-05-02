const toggleButton = document.getElementById('toggle-button');
const navLinks = document.getElementById('toggle-menu');
const avatar = localStorage.getItem('avatar');
const imgUrl = `./avatars/${avatar}.png`;
toggleButton.style.backgroundImage = `url(${imgUrl})`;


toggleButton.addEventListener('click', () => {
  navLinks.classList.toggle('show');
  
});