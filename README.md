# Prepwise — Interview Practice Tracker

A responsive React dashboard for tracking weekly interview-preparation work. It helps a student manage DSA, Git, and technical questions, keep an eye on progress, and track a machine-coding task.

## Features

- **Overview dashboard:** total questions, completed DSA problems, completed Git/technical interview questions, and machine-coding status.
- **Question CRUD:** add, edit, and delete questions with a title, category, difficulty, status, and optional notes.
- **Search and filters:** search by title/notes/category and filter by category, status, and difficulty.
- **Progress summary:** visual completion percentage based on the saved questions, with pending and in-progress counts.
- **Weekly target:** choose a weekly completion goal and see how many questions were completed in the current Monday–Sunday week.
- **Recent completions:** see the latest questions marked complete.
- **Persistent browser storage:** questions, machine-coding status, and weekly goal are saved using `localStorage` and survive refreshes in the same browser.
- **Responsive layout:** desktop sidebar, compact tablet layout, and mobile-friendly navigation and filters.
- **No backend required:** suitable as a frontend practice project and simple to deploy as a static site.

## Tech stack

- React
- Vite
- Vanilla CSS
- Browser `localStorage`

## Local setup

Requirements: Node.js 20.19+ or 22.12+ recommended.

1. Clone the repository or download the project.
2. Open a terminal in the project directory.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed by Vite (normally `http://localhost:5173`).
6. Create, edit, or mark questions completed. Refresh the page to confirm the data persists.

Create a production build:

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push the project to a GitHub repository (steps below).
2. Sign in to Vercel and select **Add New → Project**.
3. Import the GitHub repository.
4. Use these settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
5. Select **Deploy**. Vercel will provide a live URL.
6. Open the deployed URL and test adding a question, changing its status, filters, and refresh persistence.

The project is a static frontend; it does not need environment variables or a server-side database.

## Push to GitHub

Create an empty repository on GitHub first, then run the following from this project directory (replace the URL with your repository URL):

```bash
git init
git add .
git commit -m "Build Prepwise interview prep tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/interview-prep-tracker.git
git push -u origin main
```

## Demo video (1–2 minutes)

Suggested 90-second walkthrough:

1. **0:00–0:15 — Overview:** introduce Prepwise and point out the four summary cards and completion ring.
2. **0:15–0:35 — Add a question:** add a DSA question, set its difficulty and status, and save it.
3. **0:35–0:55 — Update progress:** mark a question completed and show the dashboard metrics and weekly progress react to the change.
4. **0:55–1:10 — Search and filters:** search by a keyword, filter by category/status/difficulty, and clear filters.
5. **1:10–1:25 — Editing and persistence:** edit notes, change machine-coding status, refresh the page, and show that the data remains.
6. **1:25–1:30 — Wrap up:** mention the stack and share the repository/live URL.

Record your screen with any recorder available to you. Keep the cursor deliberate and use a browser window at desktop width for the main walkthrough, then optionally resize to mobile to show responsiveness.

## Assumptions and implementation notes

- The app starts with sample questions so the dashboard is populated on first launch. You can edit or delete these examples and add your own.
- Categories are `DSA`, `Git`, and `Technical`; difficulties are `Easy`, `Medium`, and `Hard`; question statuses are `Pending`, `In Progress`, and `Completed`.
- A completed DSA problem is a question whose category is `DSA` and status is `Completed`.
- Completed interview questions count `Git` and `Technical` items marked `Completed`.
- Overall completion is `completed questions / all saved questions × 100`; it is 0% when the tracker is empty.
- Weekly completion counts items newly marked completed during the current Monday–Sunday week. The weekly goal is adjustable.
- This is a client-side practice app. `localStorage` is specific to the browser/device and is not shared between users or devices. Clearing site data removes the saved tracker.
- Authentication, multi-user sync, and a backend API are intentionally out of scope for this assignment.

## Suggested interview explanation

“I built a responsive interview-preparation dashboard with React. The question list is the single source of truth for summary counts and completion progress. Search and filter state is kept separately so the user can narrow the list without deleting data. I persist the tracker, weekly goal, and machine-coding status with `localStorage`, which makes the demo work without a backend. The main trade-off is that browser storage is local to one device; a production version could replace it with an authenticated API and database.”
