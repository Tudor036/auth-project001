import { SignInUser } from './firebaseMethods';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#login-form');

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const email = form.email.value;
        const password = form.password.value;
        
        SignInUser(email, password);
    })
})