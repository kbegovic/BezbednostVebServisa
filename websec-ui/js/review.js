
function getToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You are not logged in.");
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
        console.error("Invalid token:", e);
        alert("Invalid session. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return null;
    }
}

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

async function loadReview() {
    const token = getToken();

    const userId = getQueryParam("userId");
    const reviewId = getQueryParam("reviewId");

    if (!userId || !reviewId) {
        alert("Missing parameters.");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/user/${userId}/review/${reviewId}`,
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            alert("Failed to load review.");
            return;
        }

        const review = await response.json();

        document.getElementById("movieTitle").textContent =
            review.movieTitle;

        document.getElementById("reviewDate").textContent =
            review.reviewDate
                ? new Date(review.reviewDate).toLocaleString()
                : "N/A";

        document.getElementById("reviewText").value =
            review.reviewText || "";

        document.getElementById("rating").value =
            review.rating ?? "";

    } catch (error) {
        console.error("Error loading review:", error);
    }
}

async function updateReview() {
    const token = getToken();
    const userId = getUserIdFromToken();
    const reviewId = getQueryParam("reviewId");

    const reviewText =
        document.getElementById("reviewText").value;

    const ratingValue =
        document.getElementById("rating").value;

    const rating = ratingValue ? parseFloat(ratingValue) : null;

    try {
        const response = await fetch(
            `${API_URL}/user/${userId}/review/${reviewId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    reviewText: reviewText,
                    rating: rating
                })
            }
        );

        if (!response.ok) {
            alert("Update failed.");
            return;
        }

        const updated = await response.json();

        alert("Review updated successfully!");

    } catch (error) {
        console.error("Error updating review:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadReview);

function goBack() {
    window.location.href = "app.html";
}

async function loadReview() {
    const token = getToken();
    const userId = getUserIdFromToken();
    const reviewId = getQueryParam("reviewId");

    if (!reviewId) {
        alert("Missing review ID.");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/user/${userId}/review/${reviewId}`,
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            alert("Failed to load review.");
            return;
        }

        const review = await response.json();

        document.getElementById("movieTitle").textContent =
            review.movieTitle;

        document.getElementById("reviewDate").textContent =
            review.reviewDate
                ? new Date(review.reviewDate).toLocaleString()
                : "N/A";

        document.getElementById("reviewText").value =
            review.reviewText || "";

        document.getElementById("rating").value =
            review.rating ?? "";

    } catch (error) {
        console.error("Error loading review:", error);
    }
}