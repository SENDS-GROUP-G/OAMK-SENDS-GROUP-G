document.getElementById('deleteButton').addEventListener('click', function() {
    document.getElementById('deleteAccount').classList.remove('hidden');
    document.getElementById('changePassword').classList.add('hidden');
});

document.getElementById('changePassButton').addEventListener('click', function() {
    document.getElementById('changePassword').classList.remove('hidden');
    document.getElementById('deleteAccount').classList.add('hidden');
});