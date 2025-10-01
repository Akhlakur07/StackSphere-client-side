# StackVault

[Live Website](https://stack-web-6def0.web.app/)

## Overview

StackVault (StackSphere) is a modern, community-driven platform for discovering, sharing, and upvoting innovative tech products. Built for developers, by developers, it empowers users to showcase their projects, connect with a global tech community, and stay ahead of the latest trends in software and technology.

## Features

- 🚀 **Product Discovery:** Explore featured, trending, and community-submitted products.
- ⭐ **Upvote System:** Support your favorite products and help them trend.
- 🏆 **Featured & Trending Sections:** Hand-picked and algorithmically trending products.
- 👥 **Community Spotlight:** Highlighting top contributors and community stats.
- 💬 **Reviews & Feedback:** Leave reviews and ratings on products.
- 🛡️ **Role-Based Dashboards:** Separate dashboards for Users, Moderators, and Admins.
- 📝 **Product Submission:** Submit and manage your own products.
- 🎟️ **Coupons & Membership:** Unlock premium features and discounts.
- 🔒 **Authentication:** Secure login/register with email/password and Google.
- 📊 **Admin Analytics:** Platform statistics and user management for admins.
- 🌐 **Responsive Design:** Beautiful, modern UI with full mobile support.

## Tech Stack

- **Frontend:** React 19, Vite, TailwindCSS, DaisyUI
- **Routing:** React Router v7
- **State & Context:** React Context API
- **Animations:** Lottie, Framer Motion
- **Charts:** Chart.js, react-chartjs-2
- **Notifications:** react-toastify, SweetAlert2
- **Payments:** Stripe (for premium membership)
- **Backend:** [StackVault API](https://stack-back-omega.vercel.app) (not included in this repo)
- **Auth:** Firebase Authentication

## Key Pages & Components

- **Home:** Banner, Featured Products, Trending, Community Spotlight, Innovation Hub, Coupons
- **Products:** Search, filter, upvote, and review products
- **Product Details:** Detailed view, upvote, report, and review
- **Dashboards:**
  - User: Profile, My Products, Add/Update Product
  - Moderator: Product Review Queue, Reported Contents
  - Admin: Statistics, Manage Users, Manage Coupons
- **Authentication:** Login, Register (with Google)
- **Community:** Community stats, featured members, and join CTA
- **Footer:** Social links, newsletter, legal, and more

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd stack-front
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Environment Setup:**

   - Configure your Firebase project and Stripe keys in `src/config/stripe.js` and `src/firebase/firebase.init.js`.
   - (Optional) Update API endpoints if your backend differs.

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   # or
   yarn build
   ```

## Usage

- Visit the [live site](https://stack-web-6def0.web.app/) to explore features.
- Register or log in to submit products, upvote, and join the community.
- Admin and moderator features are available based on user roles.

## Folder Structure

```
stack-front/
  ├── src/
  │   ├── components/         # Reusable UI components
  │   ├── context/            # Auth and global context
  │   ├── firebase/           # Firebase config
  │   ├── pages/              # Main pages (Home, Products, Dashboards, etc.)
  │   ├── private/            # Private route components
  │   ├── routes/             # App routing
  │   ├── assets/             # Images, lottie files, etc.
  │   └── config/             # Stripe and other configs
  ├── public/                 # Static assets
  ├── dist/                   # Production build
  ├── package.json            # Project metadata and scripts
  └── README.md               # Project documentation
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

---

> **StackVault** – Where Innovation Meets Community. [Live Demo](https://stack-web-6def0.web.app/)
