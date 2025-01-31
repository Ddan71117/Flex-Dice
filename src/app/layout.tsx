import { ReactNode } from "react";
import { robotoMono } from "./fonts";
import NavChange from "./components/NavChange";
import "./globals.css";

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>{/* Add any head elements here */}</head>
      <body
        className={`${robotoMono.className} relative min-h-screen bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: "url('/images/fade_lrc.jpg')",
        }}
      >
        <NavChange />
        {children}
      </body>
    </html>
  );
}
