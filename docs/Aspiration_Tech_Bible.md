# ASPIRATION ARCHITECT: TECH BIBLE
> **Version:** v0.1.0
> **Last Updated:** 12-31-2025
> **Status:** LIVE PROTOCOL (Deployed via GitHub Actions)

## 1. PROJECT IDENTITY
* **Name:** Aspiration Architect
* **Type:** Personal Life Operating System (PWA)
* **User:** "The Architect" (Web Designer, Caregiver).
* **Persona:** "Guardian Angel" (Strategic, compassionate, proactive).
* **Core Philosophy:** "Drafting the future, one day at a time."

## 2. THE TECH STACK
* **Core:** React 18 (Vite Build Tool)
* **Styling:** Tailwind CSS (Utility-first)
* **Icons:** Lucide React (Unified icon set)
* **Routing:** React Router DOM (Client-side routing)
* **Backend:** Google Firebase (Authentication & Firestore)
* **CI/CD:** GitHub Actions -> Hostinger FTP

## 3. OFFICIAL DIRECTORY MAP
*The System must maintain this structure. This is the "Floor Plan".*

```text
/ (ROOT)
├── /.github/
│   └── /workflows/
│       └── deploy.yml         <-- The Deployment Robot (Do not touch)
├── /docs/                     <-- THE BRAIN
│   ├── DESIGN_SYSTEM.md       <-- Visual Constitution
│   ├── PROJECT_MANIFEST.md    <-- Core Philosophy
│   ├── Aspiration_Tech_Bible.md
│   └── MEMORY_CORE.md         <-- Session Save State
├── /public/
│   └── .htaccess              <-- Routing Shield (Required for React Router)
├── /src/
│   ├── /components/           <-- REUSABLE UI
│   │   ├── ArcGauge.jsx       <-- Locked Design Component
│   │   └── Sidebar.jsx        <-- Navigation
│   ├── /hooks/
│   │   └── useLocalStorage.js <-- Data persistence
│   ├── /pages/                <-- ROUTE LOGIC
│   │   ├── Dashboard.jsx      <-- Command Center
│   │   ├── History.jsx        <-- Analytics
│   │   ├── Journal.jsx        <-- Input Stream
│   │   ├── Login.jsx          <-- Auth Gate
│   │   └── Settings.jsx       <-- Config
│   ├── App.jsx                <-- Router Definition
│   ├── constants.js           <-- Version & Date Truth
│   ├── main.jsx               <-- Entry Point
│   └── firebase.js            <-- Google Connection
├── index.html
├── tailwind.config.js
└── vite.config.js
