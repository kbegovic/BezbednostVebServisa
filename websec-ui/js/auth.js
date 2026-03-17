function getToken() {
    return localStorage.getItem("token");
}

function setToken(token) {
    localStorage.setItem("token", token);
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

function authHeader() {
    return {
        "Authorization": "Bearer " + getToken()
    };
}

function handle401(response) {
    if (response.status === 401 || response.status === 403) {
        logout();
        return true;
    }
    return false;
}