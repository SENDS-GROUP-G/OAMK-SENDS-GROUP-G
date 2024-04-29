import API from './classes/API.js';

const userId = localStorage.getItem('user_id');
const currentPassword = document.getElementById('currentPasswordInput');
const newPassword = document.getElementById('newPasswordInput');
const confirmButton = document.getElementById('confirmButton');

const changePassword = async () => {
    try {
        const response = await API.changePassword(userId, currentPassword.value, newPassword.value);
        console.log(response);
        if (response.message) {
            alert(response.message);
        } else {
            alert(response.error);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again.');
    }
};

confirmButton.addEventListener('click', changePassword);