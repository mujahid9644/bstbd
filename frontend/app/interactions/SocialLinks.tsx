import { SOCIAL_LINKS } from "./social.config";

type SocialLinksProps = {
  variant: "menu" | "footer";
};

function SocialIcon({ name }: { name: (typeof SOCIAL_LINKS)[number]["name"] }) {
  switch (name) {
    case "Facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.2 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2v2.2H7.4V13h2.7v8h3.1Z" fill="currentColor" />
        </svg>
      );
    case "Instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="17.7" cy="6.7" r="1.1" fill="currentColor" />
        </svg>
      );
    case "YouTube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 7.3a2.8 2.8 0 0 0-2-2c-1.8-.5-7-.5-7-.5s-5.2 0-7 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2.5 12 29 29 0 0 0 3 16.7a2.8 2.8 0 0 0 2 2c1.8.5 7 .5 7 .5s5.2 0 7-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-4.7 29 29 0 0 0-.5-4.7Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="m10 15.5 5-3.5-5-3.5v7Z" fill="currentColor" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.2 8.7H3.4V20h2.8V8.7ZM4.8 3.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20.6 13.5c0-3.4-1.8-5-4.2-5a3.7 3.7 0 0 0-3.3 1.8V8.7h-2.8V20h2.8v-5.6c0-1.5.3-3 2.2-3s2 1.8 2 3.1V20h2.8l.5-6.5Z" fill="currentColor" />
        </svg>
      );
    case "TikTok":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.2 3h3c.2 2.2 1.5 3.8 3.8 4v3a8.3 8.3 0 0 1-3.8-1.2v5.5a6.1 6.1 0 1 1-6.1-6.1c.4 0 .8 0 1.2.1v3.2a3.1 3.1 0 1 0 1.9 2.9V3Z" fill="currentColor" />
        </svg>
      );
  }
}

export default function SocialLinks({ variant }: SocialLinksProps) {
  return (
    <section className={`social-links social-links--${variant}`} aria-label="Follow Us">
      <h2>Follow Us</h2>
      <ul>
        {SOCIAL_LINKS.map((item, index) => (
          <li key={item.name} style={{ "--social-index": index } as React.CSSProperties}>
            <a
              className="social-link"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              data-cursor="link"
              data-magnetic
            >
              <SocialIcon name={item.name} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
