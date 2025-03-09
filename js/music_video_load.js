document.addEventListener("DOMContentLoaded", async function () {
    const musicList = document.getElementById("musicList");

    async function loadMusic() {
        try {
            const response = await fetch("https://tunevibes.onrender.com/api/music");
            if (!response.ok) throw new Error("Failed to fetch music");

            const musicData = await response.json();

            // Sort music by createdAt (newest first)
            musicData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            if (musicData.length === 0) {
                musicList.innerHTML = "<p>No music available.</p>";
                return;
            }

            musicList.innerHTML = musicData.map(music => `
                <div class="music">
                    <h3>${music.title}</h3>
                    <p><strong>Artist:</strong> ${music.artist}</p>
                    <audio controls>
                        <source src="${music.fileUrl}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                    <p><strong>Uploaded by:</strong> ${music.createdBy}</p>
                    <p><strong>Created At:</strong> ${formatDate(music.createdAt)}</p>
                    <p><strong>Last Updated:</strong> ${formatDate(music.updatedAt)}</p>
                </div>
            `).join("");
        } catch (error) {
            musicList.innerHTML = "<p>Error loading music.</p>";
        }
    }

    function formatDate(dateTime) {
        if (!dateTime) return "N/A";
        const date = new Date(dateTime);
        return date.toLocaleString(); // Formats it like: "6/20/2025, 2:30 PM"
    }

    loadMusic();
});


document.addEventListener("DOMContentLoaded", async function () {
    const videoList = document.getElementById("videoList");

    async function loadVideos() {
        try {
            const response = await fetch("https://tunevibes.onrender.com/api/video");
            if (!response.ok) throw new Error("Failed to fetch videos");

            const videoData = await response.json();

            // **Sort videos by createdAt (newest first)**
            videoData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            if (videoData.length === 0) {
                videoList.innerHTML = "<p>No videos available.</p>";
                return;
            }

            videoList.innerHTML = videoData.map(video => `
                <div class="video">
                    <h3>${video.title}</h3>
                    <p><strong>Description:</strong> ${video.description}</p>

                    <video controls>
                        <source src="${video.fileUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>

                    <p><strong>Uploaded by:</strong> ${video.createdBy}</p>
                    <p><strong>Created At:</strong> ${formatDate(video.createdAt)}</p>
                    <p><strong>Last Updated:</strong> ${formatDate(video.updatedAt)}</p>
                </div>
            `).join("");
        } catch (error) {
            videoList.innerHTML = "<p>Error loading videos.</p>";
        }
    }

    function formatDate(dateTime) {
        if (!dateTime) return "N/A";
        const date = new Date(dateTime);
        return date.toLocaleString(); // Formats like: "6/20/2025, 2:30 PM"
    }

    loadVideos();
});
