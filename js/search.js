document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    if (searchForm) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const keyword = searchInput.value.trim();
            if (keyword) {
                window.location.href = `search.html?query=${encodeURIComponent(keyword)}`;
            }
        });
    }

    const searchResultsContainer = document.getElementById("search-results");
    if (searchResultsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const keyword = urlParams.get("query");

        if (keyword) {
            fetch(`https://tunevibes.onrender.com/api/search?keyword=${encodeURIComponent(keyword)}`)
                .then(response => response.json())
                .then(data => displayResults(data))
                .catch(error => console.error("Error fetching search results:", error));
        }
    }
});

function displayResults(data) {
    const searchResultsContainer = document.getElementById("search-results");
    searchResultsContainer.innerHTML = "";

    if (data.blogs.length === 0 && data.music.length === 0 && data.videos.length === 0) {
        searchResultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    if (data.blogs.length > 0) {
        let blogHtml = "<h3>Blogs</h3><ul>";
        data.blogs.forEach(blog => {
            blogHtml += `<li>
                <h4>${blog.title}</h4>
                <p>${blog.content}</p>
                <img src="${blog.imageUrl}" alt="Blog Image" style="max-width:100px;">
                <p><small>Published on: ${blog.createdAt}</small></p>
            </li>`;
        });
        blogHtml += "</ul>";
        searchResultsContainer.innerHTML += blogHtml;
    }

    if (data.videos.length > 0) {
        let videoHtml = "<h3>Videos</h3><ul>";
        data.videos.forEach(video => {
            videoHtml += `<li>
                <h4>${video.title}</h4>
                <p>${video.description}</p>
                <video width="200" controls>
                    <source src="${video.fileUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <p><small>Published on: ${video.createdAt}</small></p>
            </li>`;
        });
        videoHtml += "</ul>";
        searchResultsContainer.innerHTML += videoHtml;
    }

    if (data.musics.length > 0) {
        let musicHtml = "<h3>Music</h3><ul>";
        data.musics.forEach(track => {
            musicHtml += `<li>
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
                <audio controls>
                    <source src="${track.fileUrl}" type="audio/mpeg">
                    Your browser does not support the audio tag.
                </audio>
                <p><small>Published on: ${track.createdAt}</small></p>
            </li>`;
        });
        musicHtml += "</ul>";
        searchResultsContainer.innerHTML += musicHtml;
    }
}
