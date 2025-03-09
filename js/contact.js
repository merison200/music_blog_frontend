document.getElementById("contactForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const statusMessage = document.getElementById("statusMessage");

    if (!name || !phone || !email || !message) {
        statusMessage.innerHTML = "All fields are required!";
        statusMessage.style.color = "red";
        return;
    }

    try {
        // Check if the email exists before submission
        const emailCheckResponse = await fetch(`https://tunevibes.onrender.com/api/contact/check-email?email=${encodeURIComponent(email)}`);
        const emailCheckText = await emailCheckResponse.text();

        if (emailCheckResponse.status === 400) {
            statusMessage.innerHTML = "This email has already been used!";
            statusMessage.style.color = "red";
            return;
        }

        const contactData = { name, phone, email, message };

        // Submit form data
        const response = await fetch("https://tunevibes.onrender.com/api/contact/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        });

        if (response.ok) {
            statusMessage.innerHTML = "Message sent successfully!";
            statusMessage.style.color = "green";
            document.getElementById("contactForm").reset();
        } else {
            const errorText = await response.text();
            statusMessage.innerHTML = `Error: ${errorText}`;
            statusMessage.style.color = "red";
        }
    } catch (error) {
        console.error("Error:", error);
        statusMessage.innerHTML = "Failed to send message. Try again later.";
        statusMessage.style.color = "red";
    }
});