import { User } from './classes/User.js'

const user = new User();

const logoutButton = document.querySelector('#logout');
logoutButton.addEventListener('click', () => {
    user.logout();
    window.location.href = 'login.html';
});