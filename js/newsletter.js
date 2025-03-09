document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("subscribeBtn").addEventListener("click", function () {
        const email = document.getElementById("newsletterEmail").value;
        const responseMessage = document.getElementById("responseMessage");

        if (!email || !email.includes("@")) {
            responseMessage.innerText = "Please enter a valid email address.";
            responseMessage.style.color = "white";
            return;
        }

        fetch(`https://tunevibes.onrender.com/api/newsletter/subscribe?email=${encodeURIComponent(email)}`, {
            method: "POST"
        })
        .then(response => response.text())
        .then(data => {
            responseMessage.innerText = data;
            responseMessage.style.color = data.includes("already") ? "white" : "white";
        })
        .catch(error => {
            responseMessage.innerText = "An error occurred. Please try again.";
            responseMessage.style.color = "white";
        });
    });
});
