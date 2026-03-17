function getToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return null;
    }
    return token;
}

function getUserIdFromToken() {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.userId;
    } catch (e) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return null;
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

async function getMovie() {
    const token = getToken();
    if (!token) return;

    const movieId = document.getElementById("movieIdInput").value;

    if (!movieId) {
        alert("Please enter a movie ID");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/movie/${movieId}`,
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            alert("Movie not found");
            return;
        }

        const movie = await response.json();

        document.getElementById("movieCard").innerHTML = `
            <h3>${movie.title}</h3>
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Year:</strong> ${movie.year}</p>
            <p>${movie.description}</p>
        `;
    } catch (error) {
        console.error("Movie fetch failed:", error);
    }
}

async function loadReviews() {
    const token = getToken();
    if (!token) return;

    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
        const response = await fetch(
            `${API_URL}/user/${userId}/reviews`,
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) return;

        const reviews = await response.json();
        const container = document.getElementById("reviewsList");
        container.innerHTML = "";

        reviews.forEach(review => {
            const div = document.createElement("div");
            div.className = "review-item";
            div.innerHTML = `
                <strong>${review.movieTitle}</strong>
                <span> ⭐ ${review.rating}</span>
            `;
            div.onclick = () => {
                const userId = getUserIdFromToken();
                window.location.href =
                    `review.html?userId=${userId}&reviewId=${review.id}`;
            };
            container.appendChild(div);
        });

    } catch (error) {
        console.error("Failed to load reviews:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadReviews();
});