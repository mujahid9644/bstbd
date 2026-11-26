import Link from "next/link";
import { navigation } from "../../src/data/navigation";
import { contactInfo } from "../../src/data/contact-info";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand-group">
          <Link className="brand" href="/" aria-label="Building Solutions home">
            <span className="brand-mark">B</span>
            <span>BUILDING<br />SOLUTIONS</span>
          </Link>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <h2>Explore</h2>
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
                {item.children?.length ? (
                  <ul>
                    {item.children.map((child) => (
                      <li key={child.href}><Link href={child.href}>{child.label}</Link></li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </nav>
        <SocialLinks variant="footer" />
        <div className="footer-contact">
          <h2>Contact</h2>
          <p>{contactInfo.address}</p>
          <p><a href={`tel:${contactInfo.phone}`}>{contactInfo.phoneDisplay}</a></p>
          <p><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Building Solutions</span>
        <Link href="/privacy-policy">Privacy Policy</Link>
      </div>
    </footer>
  );
}
