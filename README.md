# ADI Loan Deed PDF Generator

This is a [Next.js](https://nextjs.org) application for generating, managing, and exporting loan deed PDFs in Bangla for Alternative Development Initiative (ADI). The app supports multi-step deed creation, editing, and PDF preview, with data stored in Supabase.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Multi-step form for creating new loan deeds
- Edit and update existing deeds
- PDF preview and download (Bangla support)
- Authentication (NextAuth.js + Supabase)
- Responsive UI with Tailwind CSS
- Data stored in Supabase (Postgres)
- Role-based access for branches/regions/zones

---

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Supabase](https://supabase.com/) (Database & Auth)
- [NextAuth.js](https://next-auth.js.org/) (Authentication)
- [Tailwind CSS](https://tailwindcss.com/) (Styling)
- [react-to-pdf](https://www.npmjs.com/package/react-to-pdf) (PDF Generation)
- [Lucide Icons](https://lucide.dev/) (Icons)

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/your-org/adi-loan-deed.git
cd adi-loan-deed
```

### 2. Install dependencies

```sh
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase and NextAuth credentials.  
See [Environment Variables](#environment-variables) for details.

### 4. Run the development server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

The following variables must be set in your `.env.local` file:

- `NEXT_PUBLIC_SUPABASE_URL` – Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon public key
- `SUPABASE_SERVICE_ROLE_KEY` – Supabase service role key (server-side only)
- `SUPABASE_JWT_SECRET` – Supabase JWT secret
- `NEXTAUTH_URL` – Your app URL (e.g., `http://localhost:3000`)
- `NEXTAUTH_SECRET` – Secret for NextAuth.js

Optional (for direct DB access):

- `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`

---

## Project Structure

```
.
├── app/                # Next.js app directory (routes, pages, API)
│   ├── deeds/          # Deed creation, editing, viewing
│   ├── login/          # Authentication pages
│   └── ...             # Other app routes
├── components/         # Reusable React components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (Supabase, auth, helpers)
├── public/             # Static assets (images, icons)
├── styles/             # Global and component styles
├── types/              # TypeScript types
├── .env.local          # Environment variables (not committed)
├── package.json        # Project metadata and scripts
└── ...
```

---

## Usage

### Creating a New Deed

1. Log in with your branch credentials.
2. Click "Create New Deed".
3. Fill out the multi-step form:
   - Personal Information
   - Address Information
   - ADI Representative
   - Loan Information
   - Checks
   - Interest Bank Information
   - Nominees
   - Witnesses
4. Save the deed. You will be redirected to the deed details page.

### Editing a Deed

- Navigate to an existing deed and click "Edit".
- Update the information as needed and save.

### Downloading PDF

- On the deed details page, click "Download PDF" to generate and download a Bangla PDF of the deed.

---

## Development

- **Linting:**  
  ```sh
  npm run lint
  ```
- **Formatting:**  
  ```sh
  npm run format
  ```
- **Build:**  
  ```sh
  npm run build
  ```
- **Test:**  
  (Add your test command if tests are set up.)

---

## Deployment

The easiest way to deploy is via [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

For custom deployments, see [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## License

[MIT](LICENSE)

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
