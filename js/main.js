/* ================= Theme toggle ================= */
(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") {
    root.dataset.theme = stored;
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.dataset.theme = "light";
  }
  document.getElementById("themeToggle").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
})();

/* ================= Mobile nav ================= */
(function () {
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      links.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
  });
})();

/* ================= Scroll reveal ================= */
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

/* ================= Live GitHub repositories ================= */
(function () {
  const USER = "SujaiSideshwer";
  const API = `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`;
  const CACHE_KEY = "gh-repos-cache-v1";
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min — softens GitHub API rate limits

  const grid = document.getElementById("repoGrid");
  const filters = document.getElementById("repoFilters");

  // GitHub's linguist colors for the languages likely to appear
  const LANG_COLORS = {
    Java: "#b07219", JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26",
    CSS: "#563d7c", Python: "#3572A5", Shell: "#89e051", Dockerfile: "#384d54",
    Kotlin: "#A97BFF", Go: "#00ADD8", C: "#555555", "C++": "#f34b7d", Ruby: "#701516",
  };

  function relativeTime(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return "today";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  }

  function repoCard(r) {
    const a = document.createElement("a");
    a.className = "repo-card glass";
    a.href = r.html_url;
    a.target = "_blank";
    a.rel = "noopener";
    a.dataset.lang = r.language || "Other";

    const langColor = LANG_COLORS[r.language] || "#8b98a9";
    a.innerHTML = `
      <div class="repo-top">
        <span class="repo-name">${r.name}</span>
        ${r.fork ? '<span class="repo-fork-badge">fork</span>' : ""}
      </div>
      <p class="repo-desc"></p>
      <div class="repo-meta">
        ${r.language ? `<span class="lang"><span class="lang-dot" style="background:${langColor}"></span>${r.language}</span>` : ""}
        <span title="Stars">★ ${r.stargazers_count}</span>
        <span title="Last updated">↻ ${relativeTime(r.pushed_at || r.updated_at)}</span>
      </div>`;
    a.querySelector(".repo-desc").textContent = r.description || "No description yet.";
    return a;
  }

  function render(repos) {
    grid.innerHTML = "";
    repos.forEach((r) => grid.appendChild(repoCard(r)));

    // Language filter chips
    const langs = [...new Set(repos.map((r) => r.language || "Other"))];
    filters.innerHTML = "";
    ["All", ...langs].forEach((lang, i) => {
      const btn = document.createElement("button");
      btn.textContent = lang;
      if (i === 0) btn.classList.add("active");
      btn.addEventListener("click", () => {
        filters.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        grid.querySelectorAll(".repo-card").forEach((card) => {
          card.style.display = lang === "All" || card.dataset.lang === lang ? "" : "none";
        });
      });
      filters.appendChild(btn);
    });
  }

  function showError() {
    grid.innerHTML = `<p class="repo-error mono">Couldn't reach the GitHub API right now —
      <a href="https://github.com/${USER}?tab=repositories" target="_blank" rel="noopener">browse my repositories directly on GitHub</a>.</p>`;
  }

  async function load() {
    // Serve from short-lived cache first
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
      if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
        render(cached.repos);
        return;
      }
    } catch (_) { /* ignore bad cache */ }

    try {
      const res = await fetch(API, { headers: { Accept: "application/vnd.github+json" } });
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const repos = await res.json();
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos }));
      render(repos);
    } catch (err) {
      console.error(err);
      showError();
    }
  }

  load();
})();
