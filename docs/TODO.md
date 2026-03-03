# Civic Pulse - MVP To-Do List

## 1. Project Setup & Architecture
- [ ] Initialize Next.js project.
- [ ] Set up Vanilla CSS structure (variables for Civic Green, Neutral Gray, Alert Red, Warning Orange, Success Green).
- [ ] Choose and configure backend/database (e.g., Supabase or Node.js + PostgreSQL).
- [ ] Set up cloud storage for image uploads.

## 2. Global UI Components & Navigation
- [ ] Build Global Navigation Bar (sticky, logo, navigation links, auth buttons).
- [ ] Build Civic Metrics Dashboard row (Active Citizens, Open Reports, Resolved, Engagement with % changes).
- [ ] Build horizontal Filter System pills (All, Issue, Improvement, Event, Hazard).

## 3. Interactive Map (Primary View - 70% width)
- [ ] Integrate Map API (OpenStreetMap/Google Maps).
- [ ] Implement pin drop functionality (manual & GPS auto-detect).
- [ ] Design and implement custom pin markers with color coding (Green, Orange, Red).
- [ ] Build side modal/overlay for pin click details (Title, Description, Images, Upvote, Status).

## 4. Community Feed (Secondary View - 30% width)
- [ ] Build tabbed sorting system (Hot, New, Top).
- [ ] Design and implement issue feed cards.
- [ ] Implement Reddit-style upvoting mechanism (real-time updates).
- [ ] Display card header (upvotes, username, time), body (title, preview, category), and footer (comments, share, save).
- [ ] Make feed panel independently scrollable.

## 5. Upload Flow
- [ ] Build map-based entry (Pin drop) trigger.
- [ ] Build navbar "Upload" tab trigger.
- [ ] Build multi-step or single-page form (Location, Title, Description, Category, Image upload).
- [ ] Implement form validation and image preview functionality.
- [ ] Implement loading states on submission.

## 6. User Accounts & Profiles
- [ ] Implement authentication (Email + Google Login).
- [ ] Build User Profile Page (Avatar, Karma score, totals, recent activity feed).

## 7. Admin Interface
- [ ] Build Admin Dashboard view.
- [ ] Implement report moderation queue (approve/reject/flag issues).
- [ ] Implement status update controls for existing issues.

## 8. Layout & Responsiveness
- [ ] Ensure 2-column layout on Desktop (70/30 split).
- [ ] Implement Mobile layout (Top metrics horizontal scroll, Map full width, Feed collapses below map).
- [ ] Implement floating "+ Report" button for smaller screens.
- [ ] Audit for accessibility (WCAG AA contrast, keyboard navigation, a11y labels).
