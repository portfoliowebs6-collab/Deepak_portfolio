document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    // Handle Register
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('https://deepak-portfolio-3pkq.onrender.com/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                alert(data.message);
                if (data.success) {
                    window.location.href = 'login.html';
                }
            } catch (err) {
                console.error(err);
                alert('Registration failed!');
            }
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const res = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                alert(data.message);
                if (data.success) {
                    localStorage.setItem('adminEmail', data.email);
                    window.location.href = 'admin.html'; // Redirect to main dashboard
                }
            } catch (err) {
                console.error(err);
                alert('Login failed!');
            }
        });
    }
});
