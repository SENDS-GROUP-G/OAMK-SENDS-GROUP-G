import { User } from "./class/User.js";

const user = new User()
const user_name_input = document.querySelector('#user-name')
const email_input = document.querySelector('#user-email')
const password_input = document.querySelector('#password')

document.querySelector('#signup-button').addEventListener('click',(event) => {
  event.preventDefault()
  const user_name = user_name_input.value
  const email = email_input.value
  const password = password_input.value

  user.register(user_name, email, password).then(user => {
    window.location.href="login.html"
  }).catch(error => {
    alert(error)
  })
})