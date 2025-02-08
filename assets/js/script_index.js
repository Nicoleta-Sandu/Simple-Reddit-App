const REDDIT_BASE_URL = "https://www.reddit.com";
let afterToken = "";

async function fetchSubreddits(after = "") {
  try {
    const response = await fetch(
      `${REDDIT_BASE_URL}/subreddits.json?limit=10&after=${after}`
    );
    if (!response.ok) throw new Error("Failed to fetch subreddits");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

function renderSubreddit(subreddit) {
  const subredditEl = document.createElement("div");
  subredditEl.classList.add("subreddit-item");

  // Encode the subreddit name for the URL
  const encodedName = encodeURIComponent(subreddit.display_name);

  // Remove 'r/' prefix if it exists
  const displayName = subreddit.display_name.replace(/^r\//, "");

  subredditEl.innerHTML = `
        <img src="${
          subreddit.icon_img || "https://www.reddit.com/favicon.ico"
        }" 
             alt="${displayName}" 
             onerror="this.src='https://www.reddit.com/favicon.ico'">
        <h3>${displayName}</h3>
        <p>${subreddit.public_description || "No description available."}</p>
        <a href="threads.html?subreddit=${encodedName}" 
           class="view-threads-btn">View Threads</a>
    `;
  return subredditEl;
}

async function loadSubreddits() {
  const data = await fetchSubreddits(afterToken);
  if (data && data.children) {
    const subredditList = document.getElementById("subredditList");
    data.children.forEach((item) => {
      subredditList.appendChild(renderSubreddit(item.data));
    });
    afterToken = data.after;
  }
}

// Initial load
document.addEventListener("DOMContentLoaded", loadSubreddits);

// Load more button
document.getElementById("loadMore").addEventListener("click", loadSubreddits);
