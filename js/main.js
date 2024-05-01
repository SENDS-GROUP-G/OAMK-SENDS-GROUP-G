import App from './classes/App.js';

window.onload = function() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      document.getElementById('signup').style.display = 'none';
      document.getElementById('login').style.display = 'none';
      document.getElementById('logout').style.display = 'flex';
    } else {
      document.getElementById('signup').style.display = 'flex';
      document.getElementById('login').style.display = 'flex';
      document.getElementById('logout').style.display = 'none';
    }
  };
  
  window.logout = function() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

App.init();