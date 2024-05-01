window.onload = function() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      document.getElementById('signup').style.display = 'none';
      document.getElementById('login').style.display = 'none';
      document.getElementById('logout').style.display = 'block';
      document.getElementById('feedback').style.display = 'block';
      document.getElementById('settings').style.display = 'block';
    } else {
      document.getElementById('signup').style.display = 'block';
      document.getElementById('login').style.display = 'block';
      document.getElementById('logout').style.display = 'none';
      document.getElementById('feedback').style.display = 'none';
      document.getElementById('settings').style.display = 'none';
    }
  };
  
  window.logout = function() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    window.location.href = 'landingpage.html';
}