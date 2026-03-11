import { Outfit, Playfair_Display, Montserrat, Inter } from "next/font/google";
import "./globals.css";
import NotificationProvider from "./components/NotificationProvider";
import BackgroundWrapper from "@/components/BackgroundWrapper";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "MN Studio | Professional Photography",
  description: "Capture life's precious moments with artistic vision and professional expertise. Award-winning photography studio specializing in portraits, weddings, and events.",
  keywords: "photography, studio, portraits, wedding photography, event photography, professional photographer",
  openGraph: {
    title: "MN Studio | Professional Photography",
    description: "Capture life's precious moments with artistic vision",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${playfair.variable} ${montserrat.variable} ${inter.variable} font-sans antialiased bg-[#0D0D0D] text-white`}>
        <NotificationProvider>
          <BackgroundWrapper>
            {children}
          </BackgroundWrapper>
        </NotificationProvider>
      </body>
    </html>
  );
}
