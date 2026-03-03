# Civic Pulse – Design Document

## 1. Overview

This document defines the UI/UX design system and interaction model for Civic Pulse based on the current dashboard layout.

The interface combines:
- Civic data dashboard (top metrics)
- Interactive issue map (primary canvas)
- Real-time community feed (right panel)

The goal is clarity, transparency, and civic seriousness while maintaining social-platform familiarity.

---

# 2. Design Principles

1. Transparency First – Data is visible and measurable.
2. Map-Centric Experience – Location is the core interaction.
3. Social Validation – Upvotes signal urgency.
4. Clean & Neutral – No political bias in visual tone.
5. Mobile-First Responsive Layout.

---

# 3. Layout Structure

## 3.1 Global Navigation Bar (Top)

Left:
- Logo (Civic Pulse)

Center Navigation:
- Home (Active)
- Explore
- Upload
- Profile
- About

Right:
- Notification icon
- Sign In / Account button

Design Notes:
- Sticky navigation
- Minimal height
- Soft green accent for brand identity

---

# 4. Civic Metrics Dashboard (Top Stats Row)

Four primary metric cards:

1. Active Citizens
2. Open Reports
3. Resolved
4. Engagement

Each card contains:
- Icon
- Primary number
- % change indicator (green/red)

Design Intent:
- Establish trust via visible metrics
- Reinforce civic impact
- Provide quick system health overview

Future Enhancement:
- Clickable drill-down analytics

---

# 5. Filter System

Horizontal filter pills:
- All (default active)
- Issue
- Improvement
- Event
- Hazard

Behavior:
- Filters affect both map and feed
- Active filter highlighted in green
- Multi-select optional (future version)

---

# 6. Main Layout Grid

Two-column layout:

Left (70% width): Interactive Map
Right (30% width): Community Feed

Responsive Behavior:
- On mobile: Map full width, feed collapsible or below
- Feed accessible via bottom tab on smaller screens

---

# 7. Interactive Map Design

Primary Interaction Area

Features:
- Grid-style city map
- Pin markers with color coding
- Hover or click reveals issue details
- “Active reports” indicator

Pin Color System:
- Green = Improvement / Positive civic action
- Orange = General issue
- Red = High urgency / Hazard

Pin Behavior:
- Click → Side modal or overlay with:
  - Title
  - Description
  - Images
  - Upvote button
  - Status tag

Map Enhancements (Future):
- Heatmap mode
- Clustered pins
- Radius-based search
- Location search bar

---

# 8. Community Feed (Right Panel)

Tabbed sorting system:
- Hot (default)
- New
- Top

Feed Card Structure:

Header:
- Upvote count
- Username
- Time posted

Body:
- Title (bold)
- Short description preview
- Category tag (e.g., Safety, Infrastructure)

Footer:
- Comment count
- Share button
- Save button

Design Intent:
- Familiar Reddit-style interaction
- Encourage engagement
- Real-time vote updates

Scrolling:
- Independently scrollable panel
- Sticky sorting tabs

---

# 9. Upload Flow (Implied from Navigation)

Entry Points:
- Upload tab in navbar
- Pin drop from map

Flow:
1. Select location (map or GPS)
2. Add title
3. Add description
4. Select category
5. Upload image(s)
6. Submit

UX Requirements:
- Image preview
- Validation for required fields
- Loading state on submit

---

# 10. Profile Page (Design Direction)

Components:
- User avatar
- Karma score
- Total reports
- Resolved reports count
- Recent activity feed

Future Enhancements:
- Civic impact badge system
- Contribution ranking

---

# 11. Admin Interface (Not Shown, Required)

Admin Dashboard Includes:
- Report moderation queue
- Flagged content list
- Status update controls
- Analytics overview

Permissions:
- Admin
- Moderator

---

# 12. Design System

## 12.1 Color Palette

Primary: Civic Green
Secondary: Neutral Gray
Alert: Red
Warning: Orange
Success: Green

Tone:
- Serious
- Institutional
- Clean

## 12.2 Typography

- Sans-serif modern font
- Clear hierarchy:
  - H1: Section headers
  - H2: Card titles
  - Body: Issue descriptions
  - Caption: Meta info

## 12.3 UI Components

Reusable Components:
- Metric card
- Filter pill
- Issue card
- Pin marker
- Status tag
- Upvote button

---

# 13. Real-Time Behavior

Real-time elements:
- Vote count updates
- New issue appears instantly in feed
- Active users indicator

Technical Suggestion:
- WebSockets or Firebase for real-time sync

---

# 14. Accessibility Requirements

- WCAG AA color contrast compliance
- Keyboard navigable interface
- Alt text for images
- Screen-reader compatible structure

---

# 15. Mobile Responsiveness

Mobile Layout:
- Top metrics collapse into horizontal scroll
- Map full width
- Feed collapses below map
- Floating “+ Report” button

Touch Requirements:
- Larger tap targets
- Pin clustering for small screens

---

# 16. Future Design Enhancements

- Authority response badge
- Resolution timeline view
- Public dashboard for city officials
- Civic heatmap visualization
- Push notifications

---

# 17. Summary

The Civic Pulse design is:
- Map-driven
- Socially validated
- Data-transparent
- Neutral and institutional in tone

It balances civic seriousness with social engagement mechanics to drive retention and accountability.

---

End of Design Document

