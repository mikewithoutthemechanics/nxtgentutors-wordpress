import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import AIChatWidget from "@/components/AIChatWidget";
import NotificationProvider from "@/components/NotificationProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "NextGen Tutors | AI-Powered Private Tutoring with AR",
  description: "South Africa's premier AI-enhanced tutoring platform. Live video sessions, AR subject labs, AI study assistants, and personalized learning — all in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <NotificationProvider />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <AIChatWidget />
      </body>
    </html>
  );
}
