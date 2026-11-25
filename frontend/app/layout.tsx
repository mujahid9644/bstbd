import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "./components/SiteChrome";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import PageLoader from "./motion/PageLoader";
import "./motion/motion.css";
import ScrollAwareControls from "./scroll-ui/ScrollAwareControls";
import "./scroll-ui/scroll-ui.css";
import Cursor from "./interactions/Cursor";
import Footer from "./interactions/Footer";
import "./interactions/interactions.css";

export const metadata: Metadata = {
  title: "Aurelia Properties — Elevating the Urban Skyline",
  description: "Premium residential and commercial developments shaped for modern living.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SmoothScrollProvider><PageLoader /><SiteHeader />{children}<Footer /><ScrollAwareControls /><Cursor /></SmoothScrollProvider></body></html>;
}
