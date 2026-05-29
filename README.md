# Order Vital Records System

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white)

A modern, responsive, and secure web application for submitting and managing vital record requests (Birth, Marriage, Divorce, and Death certificates). The platform features an interactive checkout flow, automated high-quality PDF receipt generation, and a secure internal database dashboard.

---

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (Version 18.x or higher is recommended)
- `npm` or `yarn`

### Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd Order-Vital-Records-Test-Page
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Run the local development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the homepage.
   - **Form Flow:** [http://localhost:3000/form-flow](http://localhost:3000/form-flow)
   - **Admin Dashboard:** [http://localhost:3000/admin/submissions](http://localhost:3000/admin/submissions)

> **Note on Database and PDFs**: The SQLite database (`database.sqlite`) and the generated PDFs (under `public/submissions/`) are automatically created upon the first successful submission. No manual database setup is required!

---

## 🏗️ Architecture Decisions

The system is built on a modern stack to ensure robust performance, rapid development, and high maintainability:

- **Next.js 16 (App Router):** We utilized the new App Router to tightly couple our frontend UI and backend API routes. This provides seamless hydration, excellent SEO, and highly secure server-side PDF generation natively within the same codebase.
- **Tailwind CSS v4:** Chosen for styling the entire application. It allows us to build a rich, glassmorphic, and fully responsive UI using purely utility classes without writing massive custom CSS files.
- **Embedded SQLite:** We integrated `sqlite3` to store form submissions locally. For an application handling structured data that requires extreme read/write speeds with zero network latency, embedded SQLite provides a lightning-fast persistence layer without the overhead of maintaining an external database cluster.
- **Puppeteer for PDF Generation:** Instead of using low-level drawing APIs (like PDFKit) which make designing layouts painful, we opted to use headless Chrome via Puppeteer. This allows us to design our PDF receipts using standard HTML/CSS and generate pixel-perfect, premium documents.

---

## ⚖️ Tradeoffs

While the current architecture enables incredibly fast development and a premium user experience, there are a few intentional tradeoffs:

1. **Filesystem vs. Cloud Storage**
   - *Tradeoff:* The generated PDFs are currently saved directly to the local disk (`public/submissions/`). 
   - *Impact:* While this works flawlessly on VPS environments or local testing, it prevents seamless horizontal scaling on serverless edge platforms (like Vercel) where the filesystem is read-only or ephemeral.
   - *Future Fix:* Migrating to an S3-compatible cloud bucket (e.g., AWS S3, Cloudflare R2) for persistent media hosting.

2. **SQLite vs. External RDBMS (PostgreSQL)**
   - *Tradeoff:* SQLite writes to a local `.sqlite` file.
   - *Impact:* Similar to the PDF storage tradeoff, the database file cannot persist natively across stateless serverless functions if deployed to Vercel. However, it requires absolutely zero configuration and no cloud costs for local and dedicated-server environments.
   - *Future Fix:* Using a service like Turso (SQLite on the edge) or migrating to PostgreSQL (via Prisma/Drizzle).

3. **Puppeteer Bundle Size**
   - *Tradeoff:* Puppeteer installs a full headless chromium binary.
   - *Impact:* The `node_modules` size is significantly larger, and cold-booting a browser instance inside an API route consumes more RAM than a lightweight text-based PDF generator.
   - *Advantage:* The benefit of writing our PDFs in HTML/CSS and generating identical, responsive, high-end designs massively outweighed the performance cost of the Chromium binary.
