const BASE_URL = "https://tunevibes.onrender.com/api/auth";

// Register Functionality
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: name, email, password }),
    });

    if (!response.ok) {
      throw new Error("Registration failed. Please try again.");
    }

    alert("Registration successful! Please login.");
    window.location.href = "login.html"; // Redirect to login
  } catch (error) {
    alert(error.message);
  }
});

// Login Functionality
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed. Please check your credentials.");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token); // Store JWT token
    localStorage.setItem("username", data.username); // Store username from response

    alert("Login successful!");
    window.location.href = "index.html"; // Redirect to home
  } catch (error) {
    alert(error.message);
  }
});

//Hide and show icons
document.addEventListener("DOMContentLoaded", function() {
  const username = localStorage.getItem("username");

    if (username) {
       document.getElementById("loginLink").style.display = "none";
       document.getElementById("registerLink").style.display = "none";
       document.getElementById("profileLink").style.display = "block";
       document.getElementById("logoutLink").style.display = "block";
     } else {
       document.getElementById("loginLink").style.display = "block";
       document.getElementById("registerLink").style.display = "block";
       document.getElementById("logoutLink").style.display = "none";
       document.getElementById("profileLink").style.display = "none";
      }

      // Logout functionality
      const logoutLink = document.getElementById("logoutLink");
      if (logoutLink) {
       logoutLink.addEventListener("click", function(event) {
       event.preventDefault();
       localStorage.removeItem("username");
       localStorage.removeItem("token");
       window.location.href = "index.html";
    });
  }
});

//Load Blogs
document.addEventListener("DOMContentLoaded", function () {
    const blogListIndex = document.getElementById("blogListIndex");
    const blogListPage = document.getElementById("blogListPage");

    async function loadBlogs() {
        try {
            const response = await fetch("https://tunevibes.onrender.com/api/blogs");
            if (!response.ok) throw new Error("Failed to fetch blogs");
            let blogs = await response.json();

            // Sort blogs by newest first
            blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const blogHTML = blogs.length
                ? blogs.map(blog => `
                    <div class="blog-card">
                        <div class="blog-image" style="background-image: url('${blog.imageUrl || 'default.jpg'}');">
                            <h3 class="blog-title">${blog.title}</h3>
                        </div>
                        <div class="blog-content">
                            <p>${blog.content.slice(0, 100)}...</p>
                            <button class="read-more" onclick="viewFullBlog('${blog.blogId}')">Read More</button>
                        </div>
                        <small class="blog-meta">By ${blog.createdBy} | ${new Date(blog.createdAt).toLocaleDateString()}</small>
                    </div>
                `).join("")
                : "<p>No blogs available.</p>";

            if (blogListIndex) blogListIndex.innerHTML = blogHTML;
            if (blogListPage) blogListPage.innerHTML = blogHTML;
        } catch (error) {
            if (blogListIndex) blogListIndex.innerHTML = "<p>Error loading blogs.</p>";
            if (blogListPage) blogListPage.innerHTML = "<p>Error loading blogs.</p>";
        }
    }

    // Function to view full blog (redirect to full blog page)
    window.viewFullBlog = function (blogId) {
        window.location.href = `blog-details.html?id=${blogId}`;
    };

    loadBlogs();
});

//Blog Details
document.addEventListener("DOMContentLoaded", function () {
    const blogDetailsContainer = document.getElementById("blogDetails");

    async function loadBlogDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const blogId = urlParams.get("id");

        if (!blogId) {
            blogDetailsContainer.innerHTML = "<p>Blog not found.</p>";
            return;
        }

        try {
            const response = await fetch(`https://tunevibes.onrender.com/api/blogs/${blogId}`);
            if (!response.ok) throw new Error("Failed to fetch blog");

            const blog = await response.json();

            blogDetailsContainer.innerHTML = `
                <div class="blog-detail-card">
                    <div class="blog-detail-image" style="background-image: url('${blog.imageUrl || 'default.jpg'}');"></div>
                    <h1 class="blog-detail-title">${blog.title}</h1>
                    <p class="blog-meta">By ${blog.createdBy} | ${new Date(blog.createdAt).toLocaleDateString()}</p>
                    <p class="blog-detail-content">${blog.content}</p>
                </div>
            `;
        } catch (error) {
            blogDetailsContainer.innerHTML = "<p>Error loading blog.</p>";
        }
    }

    function goBack() {
        window.history.back();
    }

    loadBlogDetails();
});
