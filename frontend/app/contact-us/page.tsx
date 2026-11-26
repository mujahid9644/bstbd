import { PageHero } from "../components/PageSections";
import ContactExperience from "./ContactExperience";
import { contactInfo } from "../../src/data/contact-info";
import "./contact-us.css";

const localBusinessData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: contactInfo.companyName,
  telephone: contactInfo.phone,
  email: contactInfo.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: contactInfo.addressParts.streetAddress,
    addressLocality: contactInfo.addressParts.addressLocality,
    postalCode: contactInfo.addressParts.postalCode,
    addressCountry: contactInfo.addressParts.addressCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: contactInfo.coordinates.lat,
    longitude: contactInfo.coordinates.lng,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: contactInfo.hours.schemaDays.map(
        (day) => `https://schema.org/${day}`,
      ),
      opens: contactInfo.hours.opensAt,
      closes: contactInfo.hours.closesAt,
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHero
        title="Contact Us"
        eyebrow="Let’s connect"
        image="/images/Dusk.png"
      />
      <section className="editorial contact-editorial contact-page">
        <div className="editorial-grid contact-editorial-grid">
          <div className="contact-intro">
            <p className="eyebrow">ENQUIRIES</p>
            <h2>Let&apos;s talk, or come see us.</h2>
            <p className="contact-subtext">
              Skip the forms. Call us now or visit our office and talk to our
              team in person.
            </p>
          </div>
          <ContactExperience />
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
    </>
  );
}
