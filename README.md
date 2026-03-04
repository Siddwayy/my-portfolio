# Portfolio Website

Responsive, multi-page portfolio showcasing game development, 3D work, and coding projects.

[View Live Site](https://siddwayy.github.io/my-portfolio/)

---
<img width="1164" height="1230" alt="image" src="https://github.com/user-attachments/assets/e8d6fff2-f85d-4691-9897-8f1fe7c6ceca" />


## Overview

A personal portfolio built with vanilla HTML, CSS, and JavaScript — no frameworks or build step. Five pages cover an about section with education and experience, game projects (Unreal Engine, Godot, Java), coding projects (web apps, data science), 3D work, and a contact form. The site supports dark/light theming, project filtering by category, page transitions, and cursor-reactive visual effects.

---

| Feature                | Description                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| Multi-page layout      | About, Game Projects, Coding Projects, 3D Work, Contact                                             |
| Dark / light theme     | Toggle with persistence via `localStorage`                                                           |
| Project filtering      | Filter by category (Games, Level Design, Design Docs; Web Dev, Data Science; 3D Props/Environment)   |
| Page transitions       | Loading spinner and smooth overlay on navigation                                                     |
| Responsive design      | Flexible grid layout, mobile-friendly breakpoints                                                    |
| Cursor orbs            | Floating, cursor-reactive orbs and spotlight effect (reduced-motion aware)                           |
| Tilt cards             | Subtle 3D tilt on project cards on hover                                                             |
| Accessibility          | Semantic HTML, `aria` attributes, visible focus states, lazy-loaded images                           |
| Click-to-copy          | Phone number copies to clipboard on click                                                            |
| Contact form           | Formspree-powered form with name, email, and message fields                                          |

---

## Pages

- **About** — Profile photo, bio, education (Memorial University, B.Sc. Computer Science), work experience, expertise grid, tech stack visual, gaming achievements
- **Game Projects** — Filterable cards for TowerEcho, Kivi Board Game, TO-DO List App, Zombie Mayhem, Pit2 (GDD)
- **Coding Projects** — Metrobus Redesign, Portfolio Website, Habbitto
- **3D Work** — 3D modeling and environment art gallery
- **Contact** — Embedded Google Map (St. John's, NL) and Formspree contact form

---

## Tech stack

| Layer     | Tech                                                           |
| --------- | -------------------------------------------------------------- |
| Markup    | HTML5                                                          |
| Styling   | CSS3 (custom properties, Grid, Flexbox)                        |
| Scripting | Vanilla JavaScript (ES modules not required, no build step)    |
| Fonts     | Nunito & Fredoka (Google Fonts)                                |
| Icons     | Font Awesome 6.5                                               |

No build tools, package manager, or bundler — plain static files served via GitHub Pages.

---

## Design & UX

- Dark-themed by default with a one-click light mode toggle; preference persisted in `localStorage`
- Cursor-reactive floating orbs and spotlight for ambient visual depth (respects `prefers-reduced-motion`)
- Project cards with subtle 3D tilt on hover and category filtering with smooth transitions
- Loading spinner and page-transition overlay for seamless multi-page navigation
- Responsive layout with flexible grids and mobile-friendly breakpoints
- Consistent typography (Fredoka headings, Nunito body) and accent-color system via CSS custom properties

---

## Challenges & learnings

- **Theme persistence** — Inline script in `<head>` sets `data-theme` before first paint to avoid a flash of the wrong theme
- **Performance** — Lazy-loaded images, deferred Font Awesome, `requestIdleCallback` for decorative effects (orbs, tilt) so critical rendering is never blocked
- **Filtering UX** — Category filter toggles with smooth card entrance/exit animations without a framework; maintaining accessible focus states across filter changes
- **Static multi-page architecture** — Keeping shared nav, theme, and transition logic consistent across five HTML files without a component system or build step
