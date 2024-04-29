import API from './classes/API.js';

document.getElementById('delete').addEventListener('click', async () => {
    const userId = localStorage.getItem('user_id');
    const password = document.getElementById('password').value;
    try {
        const response = await API.deleteUser(userId, password);
        console.log(response);
        if (response.message) {
            alert(response.message);
            window.logout(); 
        } else {
            alert(response.error);
        }
    } catch (error) {
        console.error(error);
    }
});