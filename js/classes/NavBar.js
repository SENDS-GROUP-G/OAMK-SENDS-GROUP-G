const toggleButton = document.getElementById('toggle-button');
const navLinks = document.getElementById('toggle-menu');

toggleButton.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});