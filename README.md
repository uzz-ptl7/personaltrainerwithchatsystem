# Welcome to your Personal Trainer Website Project

## Project info

A responsive, modern personal trainer website with **authentication, role-based dashboards, and a real-time chat system**.  
Clients can privately chat with the trainer, while the trainer (admin) can manage all client chats in one place.

---

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies for both frontend and backend.
npm install

# Step 5: Start the development servers.
npm run dev

```

## What technologies are used for this project?

This project is built with:

- **React** (frontend)
- **Node.js + Express** (backend APIs if needed)
- **Supabase** (database, auth, and realtime chat)
- **Tailwind CSS** (styling)

---

## Project Features

- Fully responsive landing page with trainer bio, services, and testimonials.
- Hamburger menu for small/medium screens.
- **Authentication:** Login & Signup with role-based access (client vs admin).
- **Dashboards:**
  - Client → Sees only their own chat with trainer.
  - Admin → List of all clients + ability to chat with each.
- **Chat system:** Real-time one-to-one messaging with Supabase Realtime.
- Back button on dashboards → returns to main site.
