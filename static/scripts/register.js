import { CreateUser } from "./firebaseMethods";

document.addEventListener('DOMContentLoaded', async () => {
    const registerForm = document.querySelector('#register-form');
    
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const userInfo = {
            name: event.target.name.value,
            email: event.target.email.value,
            password: event.target.password.value,
            confirm: event.target.confirmPassword.value
        }

        await CreateUser(userInfo);
        window.location.replace('/login');
    })
})