const BACKEND_ROOT_URL = 'http://localhost:3001';
const email = document.getElementById('emailInput');
const currentPassword = document.getElementById('currentPasswordInput');
const newPassword = document.getElementById('newPasswordInput');
const confirmButton = document.getElementById('confirmButton');

const changePassword = async () => {
    try {
        const response = await fetch(BACKEND_ROOT_URL + '/users/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value,
                password: currentPassword.value,
                new_pass: newPassword.value
            })
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
        } else {
            const errorData = await response.json();
            alert(errorData.error);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again.');
    }
};

confirmButton.addEventListener('click', changePassword);
