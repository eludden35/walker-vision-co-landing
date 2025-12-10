# Walker Vision Co - Renovation Homepage

A Next.js 15 project featuring the Renovation homepage variant from the Edifico component library, customized for Walker Vision Co.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add the logo file:
   - Place your Walker Vision Co logo at `public/images/logo.png`
   - The logo should be a gold W (color: #b49e6c) with no wording
   - Recommended dimensions: 120x40px (or maintain aspect ratio)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` - Next.js App Router pages
- `src/components/` - React components
  - `Layout/` - Site-wide layout components (Navbar, Footer, etc.)
  - `Common/` - Reusable common components
  - `HomeRenovation/` - Homepage-specific components
- `src/styles/` - CSS stylesheets
- `public/images/` - Image assets

## Technologies

- Next.js 15.5.2
- React 19.1.0
- TypeScript 5.x
- Bootstrap 5.3.8
- Swiper 11.2.10
- Remixicon 4.6.0

## Features

- Fully responsive design
- Dark theme support
- Modern UI with smooth animations
- Optimized images via Next.js Image component
- TypeScript for type safety
