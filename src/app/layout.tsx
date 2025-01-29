
import { ReactNode } from "react";
import Nav from "./components/Nav";
import { robotoMono } from "./fonts";

import "./globals.css";

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${robotoMono.className} relative min-h-screen bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: "url('/images/fade_lrc.jpg')",
        }}
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}
