document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");
    const postId = urlParams.get("id");

    if (!type || !postId) {
        console.error("Invalid post type or ID");
        return;
    }

    fetchPostDetails(type, postId);
});

// Fetch post data from API
async function fetchPostDetails(type, postId) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    try {
        const response = await fetch(`http://tunevibes.onrender.com/api/${type}/${postId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error("Failed to fetch post details.");
            return;
        }

        const post = await response.json();
        loadEditForm(type, post);
    } catch (error) {
        console.error("Error fetching post:", error);
    }
}

// Load the correct form based on type
function loadEditForm(type, post) {
    const formContainer = document.getElementById("edit-form-container");
    formContainer.innerHTML = ""; // Clear existing content

    // Dynamically check whether blogId or id exists
       const postId = post.blogId ? post.blogId : post.id;

    let formHtml = `
        <h2>Edit ${type.charAt(0).toUpperCase() + type.slice(1)}</h2>
        <form id="editForm" enctype="multipart/form-data">
            <input type="hidden" id="postId" value="${postId}" />
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" value="${post.title || post.name}" required />
    `;

    if (type === "blogs") {
        formHtml += `
            <label for="content">Content:</label>
            <textarea id="content" name="content" required>${post.content}</textarea>
            <label for="image">Upload New Image (Optional):</label>
            <input type="file" id="image" name="image" accept="image/*">
        `;
    } else if (type === "music") {
        formHtml += `
            <label for="artist">Artist:</label>
            <input type="text" id="artist" name="artist" value="${post.artist}" required />
            <label for="musicFile">Upload New Music File (Optional):</label>
            <input type="file" id="musicFile" name="file" accept="audio/*">
        `;
    } else if (type === "video") {
        formHtml += `
            <label for="description">Description:</label>
            <input type="text" id="description" name="description" value="${post.description}" required />
            <label for="videoFile">Upload New Video File (Optional):</label>
            <input type="file" id="videoFile" name="file" accept="video/*">
        `;
    }

    formHtml += `
        <button type="submit">Update</button>
        </form>
    `;

    formContainer.innerHTML = formHtml;

    document.getElementById("editForm").addEventListener("submit", (e) => {
        e.preventDefault();
        updatePost(type);
    });
}

// Handles the update request (multipart/form-data)
async function updatePost(type) {
    const postId = document.getElementById("postId").value;
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", document.getElementById("title").value);

    if (type === "blogs") {
        formData.append("content", document.getElementById("content").value);
        const imageFile = document.getElementById("image").files[0];
        if (imageFile) formData.append("image", imageFile);
    } else if (type === "music") {
        formData.append("artist", document.getElementById("artist").value);
        const musicFile = document.getElementById("musicFile").files[0];
        if (musicFile) formData.append("file", musicFile);
    } else if (type === "video") {
        formData.append("description", document.getElementById("description").value);
        const videoFile = document.getElementById("videoFile").files[0];
        if (videoFile) formData.append("file", videoFile);
    }

    try {
        const response = await fetch(`http://tunevibes.onrender.com/api/${type}/${postId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            alert(`${type} updated successfully!`);
            window.location.href = "profile.html";
        } else {
            alert(`Failed to update ${type}.`);
        }
    } catch (error) {
        console.error("Error updating post:", error);
    }
}
