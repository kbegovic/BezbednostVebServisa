if (getToken()) {
    window.location.href = "app.html";
}

async function login() {

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });

    if (!response.ok) {
        error.innerText = "Invalid credentials";
        return;
    }

    const data = await response.json();
    setToken(data.accessToken);

    window.location.href = "app.html";
}