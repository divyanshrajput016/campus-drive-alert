# CampusDrive Tracker Frontend

A modern, high-aesthetic Next.js application built for tracking verified campus placement drives with instant email notifications, following the **BookMAG Design System** (`design.md`).

## Features
- **BookMAG Design System**: Glassmorphism surfaces, soft neumorphic inset inputs and toggles, modern typography (`Funnel Display`, `Plus Jakarta Sans`, `Playwrite US Trad`), and responsive layouts.
- **Light Mode by Default**: Tailored light mode aesthetic with crisp slate/indigo palette, plus seamless dark mode toggle.
- **Database Drives Feed**: Direct connection to PostgreSQL database (`PlacementDrive` table) to display all real campus drives without querying external APIs on page load.
- **User Profile & Notification Slider**: Interactive slider toggle switch that updates `sendNotification = true / false` in the database in real-time.
- **Authentication**: Dedicated Sign In and Sign Up pages with neumorphic inputs, form validation, and session persistence.
- **Search & Filter**: Search drives by company name or location, and filter by status (Open/Closed) or CGPA cutoffs.
- **Drive Details Modal**: Detailed view with eligibility requirements, scheduled dates, deadlines, JD links, and external apply links.

## Local Development

1. Ensure backend is running on `http://localhost:3000`:
   ```bash
   cd server
   npm run dev
   ```

2. Run the Next.js frontend on `http://localhost:3001`:
   ```bash
   cd client
   npm run dev
   ```

3. Open `http://localhost:3001` in your browser.

## Deploying to Vercel

1. Push your repository to GitHub.
2. In Vercel, click **Add New Project** and import your repository.
3. Configure the **Root Directory** as `client`.
4. Add the Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed NestJS server URL (e.g., `https://your-backend.up.railway.app` or `https://your-api.onrender.com`).
5. Click **Deploy**.
