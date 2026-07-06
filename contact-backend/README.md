# Contact form backend + frontend

## What's here
- `server.js` — Express API with one route: `POST /api/contact`
- `public/contact.html` — the contact page (drop into your site, matches your color scheme)
- `public/sent.html` — the splash page that pops open in a new tab on success
- `.env.example` — copy to `.env` and fill in real values

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in:
   - `TO_EMAIL` — the address you want messages delivered to
   - `SMTP_EMAIL` / `SMTP_APP_PASSWORD` — a Gmail account + app password (see comments in `.env.example` for how to generate one)
   - `ALLOWED_ORIGINS` — the URL(s) your frontend will be served from

3. Run the server:
   ```
   npm start
   ```
   It'll listen on port 3001 (or whatever you set `PORT` to).

4. Open `public/contact.html` in a browser (or serve it alongside the rest of your site). Update the `API_URL` constant near the top of the `<script>` block in `contact.html` to point at wherever you deploy the backend (e.g. `https://your-backend.onrender.com/api/contact`).

## Deploying
The backend is a normal Node/Express app — it'll run as-is on Render, Railway, Fly.io, or a small VPS. Free tiers on Render or Railway are plenty for a personal contact form. Your static frontend pages (`contact.html`, `sent.html`) can stay wherever the rest of your site is hosted (GitHub Pages, Netlify, Vercel, etc.) — they just need `API_URL` pointed at wherever the backend ends up.

## Spam protection included
- **Honeypot field** (`website`) — invisible to real users, bots often fill it. Silently ignored server-side.
- **Rate limiting** — max 3 submissions per IP per 15 minutes.
- **Server-side validation** — required fields, email format, length limits.
- **HTML-escaping** — user input is escaped before being placed into the email body.

## Adding MongoDB logging later (optional)
If you want to also store every submission (for an admin view), add `mongoose`, connect to your Atlas cluster in `server.js`, and insert a document inside the `/api/contact` route right before sending the email. Happy to add this when you're ready — it's a small addition on top of what's here.
