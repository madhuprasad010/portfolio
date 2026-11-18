# sujai-portfolio

Personal portfolio of **L.S. Sujai Sideshwer** — Java full-stack developer (Java · Spring Boot · Kafka · AWS · React · Angular).

**Live:** https://github.com/madhuprasad010/portfolio

## How it works

- Pure static site — vanilla HTML, CSS and JavaScript. No build step, no dependencies.
- The **Current projects** section fetches my public repositories live from the GitHub API on every visit, so new repos appear automatically (cached client-side for 10 minutes).
- Dark/light theme with a toggle, persisted in `localStorage`.
- Fully responsive — mobile, tablet and desktop.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which publishes the site to the `gh-pages` branch (the GitHub Pages source). No manual deploy needed.

## Editing content

Everything lives in three files:

| File | What's in it |
| --- | --- |
| `index.html` | All content — hero, about, skills, experience, featured projects, contact |
| `css/style.css` | Design tokens (colors, fonts) and all styling |
| `js/main.js` | Theme toggle, mobile nav, scroll animations, GitHub repo fetching |

The résumé PDF served by the "Download résumé" button is at `assets/Sujai_Sideshwer_Resume.pdf` — replace that file to update it.
# portfolio
