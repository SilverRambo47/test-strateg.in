async function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        document.getElementById('registerMessage').innerText = data.msg || 'Registration successful';
    } catch (error) {
        document.getElementById('registerMessage').innerText = 'Error registering user';
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            document.getElementById('loginMessage').innerText = 'Login successful';
        } else {
            document.getElementById('loginMessage').innerText = data.msg || 'Login failed';
        }
    } catch (error) {
        document.getElementById('loginMessage').innerText = 'Error logging in';
    }
}

async function loadUsers() {
    const token = localStorage.getItem('token');
    if (!token) {
        document.getElementById('usersList').innerText = 'No token, authorization denied';
        return;
    }

    try {
        const response = await fetch('/api/auth/users', {
            method: 'GET',
            headers: {
                'x-auth-token': token
            }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
            const usersList = document.getElementById('usersList');
            usersList.innerHTML = '';
            data.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.email;
                usersList.appendChild(li);
            });
        } else {
            document.getElementById('usersList').innerText = data.msg || 'Failed to fetch users';
        }
    } catch (error) {
        document.getElementById('usersList').innerText = 'Error fetching users';
    }
}

// Load users when the users.html page is opened
if (window.location.pathname === '/users.html') {
    loadUsers();
}
