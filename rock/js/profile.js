//Select the appropriate form
document.addEventListener("DOMContentLoaded", function () {
    const postType = document.getElementById("postType");
    const forms = {
        blog: document.getElementById("blogForm"),
        music: document.getElementById("musicForm"),
        video: document.getElementById("videoForm"),
    };

    function showForm(selected) {
        Object.keys(forms).forEach(type => {
            forms[type].style.display = type === selected ? "block" : "none";
        });
    }

    postType.addEventListener("change", function () {
        showForm(this.value);
    });

    // Initialize the first selected form
    showForm(postType.value);
});

//Save already typed keywords
document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll(".postForm");

    function saveFormData(form) {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        localStorage.setItem(form.id, JSON.stringify(data));
    }

    function loadFormData(form) {
        const savedData = localStorage.getItem(form.id);
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = form.elements[key];
                if (input) {
                    input.value = data[key];
                }
            });
        }
    }

    forms.forEach(form => {
        loadFormData(form);
        form.addEventListener("input", () => saveFormData(form));
    });
});

//Handles post
document.addEventListener("DOMContentLoaded", function () {
    const postTypeSelect = document.getElementById("postType");
    const formsContainer = document.getElementById("formsContainer");
    const message = document.getElementById("message");

    const token = localStorage.getItem("token");
    if (!token) {
        message.innerText = "You must be logged in to post.";
        return;
    }

    // Function to handle form submissions
    function handleFormSubmission(formId, apiEndpoint, fieldMap) {
        const form = document.getElementById(formId);
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const formData = new FormData();
            Object.keys(fieldMap).forEach(key => {
                const input = document.getElementById(fieldMap[key]);
                if (input.type === "file") {
                    if (input.files.length > 0) formData.append(key, input.files[0]);
                } else {
                    formData.append(key, input.value);
                }
            });

            try {
                const response = await fetch(`http://tunevibes.onrender.com/api/${apiEndpoint}`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) throw new Error(`Failed to post ${apiEndpoint}`);

                message.innerText = "Uploaded successfully! ✅";
                message.style.color = "green";
                message.style.display = "block";
                form.reset();
            } catch (error) {
                message.innerText = `Error posting ${apiEndpoint}.`;
                message.style.color = "red";
            }
        });
    }

    // Initialize form handlers with correct mappings
    handleFormSubmission("blogForm", "blogs", {
        "title": "blogTitle",
        "content": "content",
        "image": "image"
    });

    handleFormSubmission("musicForm", "music", {
        "title": "musicTitle",
        "artist": "artist",
        "file": "musicFile"
    });

    handleFormSubmission("videoForm", "video", {
        "title": "videoTitle",
        "description": "description",
        "file": "videoFile"
    });

    // Handle form visibility based on selection
    postTypeSelect.addEventListener("change", function () {
        document.querySelectorAll(".postForm").forEach(form => form.classList.remove("active"));
        const selectedForm = document.getElementById(`${postTypeSelect.value}Form`);
        if (selectedForm) selectedForm.classList.add("active");
    });

    // Show the default form (Blog)
    postTypeSelect.value = "blog";
    postTypeSelect.dispatchEvent(new Event("change"));
});

//Handles delete, display and update
document.addEventListener("DOMContentLoaded", function () {
  fetchAllUserPosts();
});

async function fetchAllUserPosts() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("User is not authenticated.");
    return;
  }

  // Fetch all posts independently
  const fetchData = async (url) => {
    try {
      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      return [];
    }
  };

  const [blogs, music, videos] = await Promise.all([
    fetchData("http://tunevibes.onrender.com/api/blogs/my-blogs"),
    fetchData("http://tunevibes.onrender.com/api/music/my-music"),
    fetchData("http://tunevibes.onrender.com/api/video/my-video"),
  ]);

  const allPosts = [
    ...blogs.map(post => ({ ...post, id: post.blogId, type: "blogs" })),
    ...music.map(post => ({ ...post, type: "music" })),
    ...videos.map(post => ({ ...post, type: "video" })),
  ];

  allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  displayPosts(allPosts);
}

function displayPosts(posts) {
  const container = document.getElementById("post-list");
  container.innerHTML = posts.length ? "" : "<p>No posts found.</p>";

  posts.forEach(post => {
    const div = document.createElement("div");
    div.classList.add("post-item");
    div.innerHTML = `
      <h3>${post.title || post.name} (${post.type.toUpperCase()})</h3>
      <p>${post.content || post.description || ""}</p>
      ${post.type === "music" || post.type === "video" ? `<audio controls src="${post.file}"></audio>` : ""}
      <button onclick="editPost('${post.type}', ${post.id})">🖊️ Edit</button>
      <button onclick="deletePost('${post.type}', ${post.id})">🗑️ Delete</button>
    `;
    container.appendChild(div);
  });
}

function editPost(type, postId) {
  window.location.href = `edit_page.html?type=${type}&id=${postId}`;
}

function deletePost(type, postId) {
  if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

  fetch(`http://tunevibes.onrender.com/api/${type}/${postId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
  })
  .then(response => response.ok ? fetchAllUserPosts() : console.error(`Failed to delete ${type}.`))
  .catch(error => console.error(`Error deleting ${type}:`, error));
}
