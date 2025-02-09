function getTimestamp(item) {
  return new Date(item.created_utc * 1000).getTime();
}

function sortByDateTime(a, b) {
  return getTimestamp(b) - getTimestamp(a);
}

const REDDIT_BASE_URL = "https://www.reddit.com";
let afterToken = "";
const urlParams = new URLSearchParams(window.location.search);
const subredditName = urlParams.get("subreddit");

if (!subredditName) {
  window.location.href = "index.html";
}

// Changed to display just the subreddit name without 'r/'
document.getElementById("subredditTitle").textContent = subredditName;
// Update the page title as well
document.title = `${subredditName} - Reddit Threads`;

async function fetchThreads(after = "") {
  try {
    const response = await fetch(
      `${REDDIT_BASE_URL}/r/${subredditName}.json?limit=10&after=${after}`
    );
    if (!response.ok) throw new Error("Failed to fetch threads");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

function renderThread(thread) {
  const threadEl = document.createElement("div");
  threadEl.classList.add("thread-item");

  const content = thread.selftext || "No content available.";
  const truncatedContent =
    content.length > 300 ? content.substring(0, 300) + "..." : content;

  threadEl.innerHTML = `
        <a href="https://reddit.com${thread.permalink}" 
           target="_blank" 
           class="thread-title">${thread.title}</a>
        <div class="thread-meta">
            Posted by u/${thread.author}
        </div>
        <div class="thread-content">${truncatedContent}</div>
        <div class="thread-stats">
            <span>👍 ${thread.ups} upvotes</span>
            <span>💬 ${thread.num_comments} comments</span>
        </div>
    `;
  return threadEl;
}

async function loadThreads() {
  const data = await fetchThreads(afterToken);
  if (data && data.children) {
    const threadList = document.getElementById("threadList");
    const sortedThreads = [...data.children].sort((a, b) =>
      sortByDateTime(a.data, b.data)
    );

    sortedThreads.forEach((item) => {
      threadList.appendChild(renderThread(item.data));
    });
    afterToken = data.after;
  }
}

// Initial load
document.addEventListener("DOMContentLoaded", loadThreads);

// Load more button
document.getElementById("loadMore").addEventListener("click", loadThreads);
