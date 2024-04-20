import { User } from './classes/User.js'

const deleteButton = document.querySelector('#delete');
const cancel = document.querySelector('#cancel');

deleteButton.addEventListener('click', async () => {
    try {
        const user = new User();
        await user.deleteAccount();
        alert('Account deleted successfully')
        window.location.href = 'signup.html';
    } catch (error) {
        console.error(error);
    }
});

cancel.addEventListener('click', () => {
    window.location.href = 'index.html';
});