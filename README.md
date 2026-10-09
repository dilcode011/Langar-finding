# Langar Finder 🍲

Welcome to **Langar Finder**! A global platform dedicated to helping people discover verified Gurudwaras, community kitchens, and live Langar (free community meal) timings near them.

🌐 **Live Demo:** [https://langar-finding.vercel.app/](https://langar-finding.vercel.app/)

## Features

- 🗺️ **Interactive Global Map**: Discover Langar locations around the world using the interactive Leaflet map.
- 📍 **Location Detection**: Automatically detect your location to find the nearest free meals.
- ✅ **Verification System**: Community-driven listings with Admin approvals and verification badges (Blue Check) for trusted Gurudwaras.
- 🌍 **Multilingual Support**: Support for English, Punjabi, and Hindi to serve a diverse community.
- 📱 **Fully Responsive**: Beautiful, mobile-friendly interface built with Tailwind CSS.
- 🔐 **Secure & Scalable**: Authentication and database powered securely by Supabase.

## Tech Stack

This project is built using modern web development technologies:

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), React
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Maps**: [Leaflet](https://leafletjs.com/) & `react-leaflet`
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Icons & Alerts**: [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

Follow these steps to run the project locally on your machine:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/langar-finding.git
cd langar-finding
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root of the directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Database Setup (Supabase)

Make sure you have the Supabase CLI installed, and apply the database migrations and seed data:

```bash
npx supabase db push
```

*(This will set up all required tables, Row Level Security (RLS) policies, and sample Langar data).*

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [https://langar-finding.vercel.app/](https://langar-finding.vercel.app/) with your browser to see the result.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

The application relies on Supabase Row Level Security (RLS) to protect data integrity. Strict HTTP security headers are enforced via `next.config.js` to protect against cross-site scripting (XSS) and clickjacking.

## License

Distributed under the MIT License.
