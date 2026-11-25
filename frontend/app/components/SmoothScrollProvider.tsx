"use client";

import useSmoothScroll from "../motion/useSmoothScroll";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useSmoothScroll();
  return <>{children}</>;
}
