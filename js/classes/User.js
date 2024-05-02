//const BACKEND_URL = 'http://localhost:3001'
const BACKEND_URL = 'https://sendsserver.onrender.com'

class User {
  #id = undefined
  #email = undefined

  constructor() {
    const userFromStorage = sessionStorage.getItem('user')
    if (userFromStorage) {
      const userObject = JSON.parse(userFromStorage)
      this.#id = userObject.id
      this.#email = userObject.email
    }
  }

  get id() {
    return this.#id
  }

  get email() {
    return this.#email
  }

  get isLoggedIn() {
    return this.#id !== undefined ? true : false
  }

  async login(email,password) {
    const data = JSON.stringify({email: email,password: password})
    const response = await fetch(BACKEND_URL + '/user/login',{
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: data
    })
    if (response.ok === true) {
      const json = await response.json()
      this.#id = json.id
      this.#email = json.email
      sessionStorage.setItem('user',JSON.stringify(json))
      return this
    } else {
      throw response.statusText
    }
  }

  async register(user_name, email, password) {
    const data = JSON.stringify({ user_name, email, password });
    const response = await fetch(BACKEND_URL + '/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: data
    });
    if (response.ok === true) {
      const json = await response.json();
      this.#id = json.user_id;
      this.#email = json.email;
      sessionStorage.setItem('user', JSON.stringify(json));
      return this;
    } else {
      throw response.statusText;
    }
  }
  async deleteAccount() {
    try {
        const response = await fetch(BACKEND_URL + '/delete/' + this.#id, {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok === true) {
            sessionStorage.removeItem('user');
            this.#id = undefined;
            this.#email = undefined;
            return true;
        } else {
            throw response.statusText;
        }
        } catch (error) {
        throw error;
        }
  }
  logout() {
    sessionStorage.removeItem('user')
    this.#id = undefined
    this.#email = undefined
  }
}

export { User }

