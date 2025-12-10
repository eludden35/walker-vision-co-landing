import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import "swiper/css";
import "swiper/css/bundle";

import "../styles/header.css";
import "../styles/footer.css";

// Global styles
import "../styles/style.css";
import "../styles/responsive.css";

// Dark theme
import "../styles/dark-theme.css";

import type { Metadata } from "next";
import { DM_Sans, Exo, Martian_Mono } from "next/font/google";
import GoTop from "@/components/Layout/GoTop";
import CustomCursor from "@/components/Layout/CustomCursor";
import ThemeSwitcherMode from "@/components/Layout/ThemeSwitcherMode";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const exo = Exo({
  variable: "--font-exo",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Walker Vision Co - Expert Renovation Services & Home Construction",
  description:
    "Walker Vision Co is a trusted renovation and construction company offering expert home renovation services, custom design solutions, and professional craftsmanship. Transform your house into your dream home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-dark">
      <body
        className={`${dmSans.variable} ${exo.variable} ${martianMono.variable}`}
      >
        {children}

        <GoTop />

        <CustomCursor />

        <ThemeSwitcherMode />
      </body>
    </html>
  );
}
