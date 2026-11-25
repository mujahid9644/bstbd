"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import type { NavigationItem } from "../../src/data/navigation";
import SocialLinks from "../interactions/SocialLinks";
import "./slide-nav.css";

type SlideNavProps = {
  items: NavigationItem[];
  open: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
};

const TRANSITION_MS = 620;

function ScrollableRegion({
  children,
  className,
  active,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  active: boolean;
  labelledBy?: string;
}) {
  const regionRef = useRef<HTMLDivElement>(null);
  const [hasMoreContent, setHasMoreContent] = useState(false);

  useEffect(() => {
    const region = regionRef.current;
    if (!region || !active) return;

    const updateHint = () => {
      const hasOverflow = region.scrollHeight > region.clientHeight + 1;
      const canScrollFurther =
        region.scrollTop + region.clientHeight < region.scrollHeight - 1;
      setHasMoreContent(hasOverflow && canScrollFurther);
    };

    region.scrollTop = 0;
    const frame = window.requestAnimationFrame(updateHint);
    const observer = new ResizeObserver(updateHint);
    observer.observe(region);
    if (region.firstElementChild) observer.observe(region.firstElementChild);
    region.addEventListener("scroll", updateHint, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      region.removeEventListener("scroll", updateHint);
    };
  }, [active]);

  return (
    <div
      ref={regionRef}
      className={`slide-nav-scroll-region${hasMoreContent ? " has-more-content" : ""}${className ? ` ${className}` : ""}`}
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
      aria-labelledby={labelledBy}
      tabIndex={active ? 0 : -1}
    >
      {children}
    </div>
  );
}

export default function SlideNav({
  items,
  open,
  onClose,
  onSearch,
}: SlideNavProps) {
  const pathname = usePathname();
  const [activeParent, setActiveParent] = useState<NavigationItem | null>(null);
  const [renderedParent, setRenderedParent] = useState<NavigationItem | null>(null);
  const [entrance, setEntrance] = useState(0);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const parentButtonRef = useRef<HTMLButtonElement>(null);
  const mainListRef = useRef<HTMLUListElement>(null);
  const submenuListRef = useRef<HTMLUListElement>(null);
  const activeParentRef = useRef<NavigationItem | null>(null);
  const previousPathRef = useRef(pathname);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submenuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetToMain = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (submenuTimerRef.current) clearTimeout(submenuTimerRef.current);
    setActiveParent(null);
    setRenderedParent(null);
    activeParentRef.current = null;
    setEntrance((value) => value + 1);
  }, []);

  const goBack = useCallback(() => {
    const parentHref = activeParentRef.current?.href;
    activeParentRef.current = null;
    setActiveParent(null);
    setEntrance((value) => value + 1);
    if (submenuTimerRef.current) clearTimeout(submenuTimerRef.current);
    submenuTimerRef.current = setTimeout(() => {
      setRenderedParent(null);
      submenuTimerRef.current = null;
    }, 520);
    window.requestAnimationFrame(() => {
      if (parentHref) parentButtonRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    if (previousPathRef.current === pathname) return;
    previousPathRef.current = pathname;
    resetToMain();
    if (open) onClose();
  }, [onClose, open, pathname, resetToMain]);

  useEffect(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    if (submenuTimerRef.current) {
      clearTimeout(submenuTimerRef.current);
      submenuTimerRef.current = null;
    }

    if (!open) {
      resetTimerRef.current = setTimeout(() => {
        resetToMain();
        resetTimerRef.current = null;
      }, TRANSITION_MS);
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    root.dataset.menuScrollLocked = "true";
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = previousBodyPaddingRight
        ? `calc(${previousBodyPaddingRight} + ${scrollbarWidth}px)`
        : `${scrollbarWidth}px`;
    }
    window.dispatchEvent(new CustomEvent("motion:menu-scroll-lock"));

    const focusFrame = window.requestAnimationFrame(() => {
      setEntrance((value) => value + 1);
      closeRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (activeParentRef.current) {
          goBack();
        } else {
          onClose();
        }
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const activeRegion = activeParentRef.current
          ? submenuListRef.current
          : mainListRef.current;
        const currentTarget = event.target;
        if (
          !activeRegion ||
          !(currentTarget instanceof HTMLElement) ||
          !activeRegion.contains(currentTarget)
        ) {
          return;
        }

        const links = Array.from(
          activeRegion.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
        ).filter((element) => element.getClientRects().length > 0);
        const currentIndex = links.indexOf(currentTarget);
        if (currentIndex < 0 || links.length === 0) return;

        event.preventDefault();
        const increment = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = (currentIndex + increment + links.length) % links.length;
        links[nextIndex].focus();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]',
        ),
      ).filter(
        (element) =>
          element.getClientRects().length > 0 &&
          !element.closest("[aria-hidden='true']") &&
          !element.closest("[inert]"),
      );

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
      root.style.overflow = previousRootOverflow;
      delete root.dataset.menuScrollLocked;
      window.dispatchEvent(new CustomEvent("motion:menu-scroll-unlock"));
    };
  }, [goBack, onClose, open, resetToMain]);

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (submenuTimerRef.current) clearTimeout(submenuTimerRef.current);
      delete document.documentElement.dataset.menuScrollLocked;
      window.dispatchEvent(new CustomEvent("motion:menu-scroll-unlock"));
    },
    [],
  );

  const closeMenu = () => {
    onClose();
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("project-search") ?? "").trim();
    if (query) onSearch(query);
  };

  const openSubmenu = (item: NavigationItem) => {
    activeParentRef.current = item;
    setActiveParent(item);
    setRenderedParent(item);
    setEntrance((value) => value + 1);
    window.requestAnimationFrame(() => backRef.current?.focus());
  };

  return (
    <>
      <button
        className={`slide-nav-backdrop${open ? " is-open" : ""}`}
        type="button"
        aria-label="Close navigation menu"
        tabIndex={open ? 0 : -1}
        onClick={closeMenu}
      />
      <aside
        ref={panelRef}
        className={`slide-nav-panel${open ? " is-open" : ""}`}
        aria-label="Site navigation"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="slide-nav-toolbar">
          <div className="slide-nav-toolbar-start">
            {activeParent && (
              <button
                ref={backRef}
                className="slide-nav-back"
                type="button"
                data-cursor="link"
                data-magnetic
                onClick={goBack}
              >
                <span aria-hidden="true">‹</span> BACK
              </button>
            )}
          </div>
          <button
            ref={closeRef}
            className="slide-nav-close"
            type="button"
            data-cursor="link"
            data-magnetic
            onClick={closeMenu}
          >
            <span>CLOSE</span>
            <span className="slide-nav-close-icon" aria-hidden="true">×</span>
          </button>
        </div>

        <div className="slide-nav-level-stack">
          <div
            className={`slide-nav-level slide-nav-main${activeParent ? "" : " is-active"}`}
            aria-hidden={Boolean(activeParent)}
            inert={Boolean(activeParent)}
          >
            <form
              className="slide-nav-search"
              role="search"
              onSubmit={submitSearch}
              key={`search-${entrance}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="7.5" />
                <path d="m16.4 16.4 4.3 4.3" />
              </svg>
              <input name="project-search" type="search" placeholder="Search Projects" />
            </form>

            <ScrollableRegion
              className="slide-nav-main-scroll"
              active={open && !activeParent}
              labelledBy="slide-nav-main-label"
            >
              <nav aria-label="Main navigation">
                <span id="slide-nav-main-label" className="sr-only">Main navigation</span>
                <ul className="slide-nav-list" key={`main-${entrance}`} ref={mainListRef}>
                  <li style={{ "--item-index": 0 } as CSSProperties}>
                    <Link href="/" data-cursor="link" onClick={closeMenu}>Home</Link>
                  </li>
                  {items.map((item, index) => (
                    <li
                      key={item.href}
                      style={{ "--item-index": index + 1 } as CSSProperties}
                    >
                      {item.children?.length ? (
                        <button
                          ref={parentButtonRef}
                          type="button"
                          className="slide-nav-item-button"
                          data-parent-href={item.href}
                          aria-expanded={activeParent?.href === item.href}
                          data-cursor="link"
                          data-magnetic
                          onClick={() => openSubmenu(item)}
                        >
                          <span>{item.label}</span>
                          <span className="slide-nav-chevron" aria-hidden="true">›</span>
                        </button>
                      ) : (
                        <Link href={item.href} data-cursor="link" onClick={closeMenu}>
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                  <li
                    key="/privacy-policy"
                    style={{ "--item-index": items.length + 1 } as CSSProperties}
                  >
                    <Link href="/privacy-policy" data-cursor="link" onClick={closeMenu}>
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </nav>
            </ScrollableRegion>
          </div>

          <div
            className={`slide-nav-level slide-nav-submenu${activeParent ? " is-active" : ""}`}
            aria-hidden={!activeParent}
            inert={!activeParent}
          >
            {renderedParent && (
              <ScrollableRegion
                className="slide-nav-submenu-scroll"
                active={open && Boolean(activeParent)}
                labelledBy="slide-nav-submenu-label"
              >
                <nav aria-label={`${renderedParent.label} navigation`}>
                  <span id="slide-nav-submenu-label" className="sr-only">
                    {renderedParent.label} navigation
                  </span>
                  <Link
                    className="slide-nav-parent-link"
                    href={renderedParent.href}
                    data-cursor="link"
                    onClick={closeMenu}
                  >
                    {renderedParent.label}
                  </Link>
                  <ul className="slide-nav-list slide-nav-child-list" ref={submenuListRef}>
                    {renderedParent.children?.map((child, index) => (
                      <li
                        key={child.href}
                        style={{ "--item-index": index } as CSSProperties}
                      >
                        <Link href={child.href} data-cursor="link" onClick={closeMenu}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </ScrollableRegion>
            )}
          </div>
        </div>

        <SocialLinks variant="menu" />
      </aside>
    </>
  );
}
