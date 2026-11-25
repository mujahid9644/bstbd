"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { navigation } from "../../src/data/navigation";
import SlideNav from "./SlideNav";
import useScrollState from "../scroll-ui/useScrollState";
import { SCROLL_UI_CONFIG } from "../scroll-ui/scroll-ui.config";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { y, direction } = useScrollState();
  const isHidden =
    !open &&
    y >= SCROLL_UI_CONFIG.headerAlwaysVisibleBelow &&
    direction === "down";
  const isScrolled = y >= SCROLL_UI_CONFIG.headerAlwaysVisibleBelow;

  const closeMenu = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => menuButtonRef.current?.focus(), 620);
  }, []);

  const searchProjects = useCallback((query: string) => {
    router.push(`/projects?search=${encodeURIComponent(query)}`);
    closeMenu();
  }, [closeMenu, router]);

  return (
    <>
      <header
        className={`site-header${isHidden ? " is-hidden" : ""}${isScrolled ? " is-scrolled" : ""}`}
        data-menu-open={open}
      >
        <Link className="brand" href="/" aria-label="Aurelia Properties home"><span className="brand-mark">A</span><span>AURELIA<br />PROPERTIES</span></Link>
        <button ref={menuButtonRef} className="menu-button" data-cursor="link" data-magnetic onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>MENU <span className="menu-lines"><i /><i /></span></button>
      </header>
      <SlideNav items={navigation} open={open} onClose={closeMenu} onSearch={searchProjects} />
    </>
  );
}
