# MASTER PROJECT PROMPT
# Premium Real Estate Website — High-Fidelity Shanta Holdings Reference Recreation

Act as a Senior Full-Stack Developer, Creative Frontend Engineer, UI/UX Designer, Django Architect and Website Animation Specialist.

Your task is to build a complete, production-quality premium real estate corporate website.

REFERENCE WEBSITE:
https://shantaholdings.com/

IMPORTANT GOAL:

I want a highly detailed visual and functional recreation inspired by the reference website.

The new website should achieve a very similar premium visual experience, including:
- Overall layout and section composition
- Typography hierarchy
- Spacing and proportions
- Navigation behavior
- Image presentation
- Scroll animations
- Page transitions
- Hover interactions
- Cinematic visual effects
- Responsive behavior

Do not create a generic real estate template.

Do not use the original company's logo, proprietary text, copyrighted photographs or videos without permission. Use original branding and appropriately licensed stock assets.

==================================================
1. TECHNOLOGY STACK
==================================================

FRONTEND:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- GSAP
- GSAP ScrollTrigger
- Lenis Smooth Scroll
- Motion
- Swiper.js
- Lucide React

BACKEND:
- Python
- Django
- Django REST Framework
- PostgreSQL
- Django Jazzmin

MEDIA:
- Django Local Media Storage
- Pillow for image processing
- Local VPS storage
- Nginx media serving

HOSTING:
- Hostinger VPS
- Ubuntu
- Nginx
- Gunicorn
- Node.js
- PostgreSQL
- SSL/HTTPS

Do not require paid animation libraries, paid templates or paid UI components.

==================================================
2. REFERENCE WEBSITE ANALYSIS
==================================================

Before coding, thoroughly inspect:

https://shantaholdings.com/

Analyze all accessible pages and sections.

Study:
- Header and navigation
- Homepage hero
- Hero typography
- Background images and videos
- Image overlays
- Scroll behavior
- Section transitions
- Project presentation
- Image galleries
- About sections
- Corporate information
- Footer
- Mobile navigation
- Hover interactions
- Page transitions

Use browser inspection and screenshots wherever available.

Create a detailed reference analysis document.

Record:
- Section order
- Approximate section heights
- Typography sizes
- Container widths
- Background colors
- Image aspect ratios
- Animation triggers
- Animation durations
- Transition styles

If a page cannot be inspected, do not invent its exact design. Document the limitation and create a consistent implementation based on accessible references.

==================================================
3. VISUAL DESIGN REQUIREMENTS
==================================================

Create a premium luxury real estate aesthetic.

Design principles:
- Sophisticated typography
- Large architectural photography
- Generous whitespace
- Elegant color palette
- Premium editorial layout
- Full-screen visual sections
- Clean navigation
- Strong visual hierarchy
- Carefully balanced compositions

Avoid:
- Generic dashboard-like website design
- Excessive rounded cards
- Unnecessary gradients
- Too many colors
- Excessive shadows
- Generic AI-generated layouts

The desktop experience must be visually impressive.

Mobile design must also be carefully optimized.

==================================================
4. ADVANCED ANIMATION SYSTEM
==================================================

Use free animation libraries.

GSAP + ScrollTrigger:
- Scroll-triggered reveals
- Parallax image movement
- Pinned sections where appropriate
- Animated headings
- Staggered text
- Image masking
- Section entrance animations
- Horizontal project showcases
- Animated counters
- Smooth reveal transitions

Lenis:
- Smooth scrolling
- Proper GSAP ScrollTrigger integration
- Responsive behavior
- No scroll conflicts

Motion:
- Navigation animations
- Hover interactions
- Menu transitions
- Modal animations
- Small UI transitions

Swiper:
- Project carousels
- Image galleries
- Touch-enabled sliders

IMPORTANT:
Do not animate everything unnecessarily.

Animations must feel elegant, smooth, cinematic and professional.

Support prefers-reduced-motion accessibility settings.

Optimize animation performance and avoid layout shifts.

==================================================
5. WEBSITE PAGES
==================================================

Create these pages:

1. Homepage
2. About Us
3. Projects
4. Project Details
5. Our Businesses
6. Gallery
7. Team
8. Contact Us
9. Privacy Policy

HOMEPAGE:

Include:
- Premium navigation
- Cinematic hero image/video
- Animated headline
- Company introduction
- Featured projects
- Business overview
- Architectural image sections
- Company achievements
- Gallery
- Contact CTA
- Professional footer

PROJECTS PAGE:

Include:
- Project listing
- Project categories
- Location filtering
- Project status filtering
- Large image cards
- Hover animations
- Pagination

PROJECT DETAILS:

Include:
- Project title
- Location
- Project status
- Large hero image
- Image gallery
- Project description
- Features
- Amenities
- Specifications
- Related projects
- Enquiry form

==================================================
6. IMAGE AND VIDEO MANAGEMENT
==================================================

IMPORTANT: DO NOT USE CLOUDINARY OR OTHER PAID IMAGE HOSTING SERVICES.

Use Django local media storage.

Media directory:

backend/media/
    projects/
    homepage/
    gallery/
    team/
    banners/
    videos/

Images and videos should be stored on the VPS.

Image sources:
- Pexels
- Unsplash
- Pixabay
- Other appropriately licensed sources

Video sources:
- Pexels Videos
- Pixabay Videos
- Other properly licensed stock footage

Search for relevant assets:
- Luxury architecture
- Modern skyscrapers
- Premium apartments
- Building exteriors
- Interior architecture
- Urban aerial footage
- Cinematic city footage
- Architectural drone videos

Asset rules:
1. Prefer high-quality landscape images.
2. Use original image files stored locally.
3. Download only assets permitted by their licenses.
4. Save asset source and license information in a documentation file.
5. Do not hotlink third-party images.
6. Do not scrape copyrighted images from Google.
7. Optimize images before production.
8. Use responsive image sizes.
9. Use optimized video formats such as MP4/WebM.
10. Add poster images for background videos.
11. Lazy-load non-critical media.

If automatic downloading is unavailable, create an asset checklist with exact image requirements and filenames. Never use fake image URLs.

==================================================
7. COMPLETE DJANGO ADMIN PANEL
==================================================

Use Django Jazzmin to create a professional and organized administration interface.

Admin sidebar:

DASHBOARD
- Overview
- Total Projects
- Published Projects
- Total Enquiries
- Recent Activities

PROJECT MANAGEMENT
- Add Project
- Edit Project
- Delete Project
- Project Categories
- Project Locations
- Project Images
- Project Status

WEBSITE CONTENT
- Homepage Settings
- Hero Content
- About Page
- Business Sections
- Services
- Team Members
- Testimonials
- Gallery
- Footer Settings

MEDIA MANAGEMENT
- Image Upload
- Image Preview
- Replace Image
- Delete Image
- Reorder Images
- Video Upload
- Video Management

CONTACT MANAGEMENT
- Contact Information
- Enquiries
- Messages
- Contact Submissions

SEO MANAGEMENT
- Meta Title
- Meta Description
- Open Graph Image
- Sitemap Settings

SYSTEM SETTINGS
- Website Name
- Logo
- Favicon
- Primary Colors
- Typography Settings
- Social Media Links
- Navigation Menu

USER MANAGEMENT
- Admin
- Editor
- Permissions

All important website content must be editable from the admin panel without editing source code.

==================================================
8. DATABASE DESIGN
==================================================

Create clean Django models for:

- Project
- ProjectCategory
- ProjectImage
- ProjectLocation
- HomepageSettings
- PageContent
- Business
- TeamMember
- Testimonial
- GalleryImage
- WebsiteSettings
- NavigationItem
- ContactInformation
- Enquiry
- SEOSettings

Use:
- Proper relationships
- Slugs
- Timestamps
- Ordering fields
- Published/Draft status
- Image fields
- Validation
- Database indexes where useful

Use Django migrations.

==================================================
9. ADMIN IMAGE MANAGEMENT
==================================================

The admin must support:

- Upload multiple images
- Image preview
- Replace existing image
- Delete image
- Change image order
- Set featured image
- Manage image alt text
- Upload video
- Replace hero video
- Change gallery images

Deleting a database record must safely handle its associated media file.

Avoid deleting shared files that are referenced elsewhere.

==================================================
10. API DEVELOPMENT
==================================================

Create REST APIs for:

- Projects
- Project Details
- Project Categories
- Homepage Content
- About Content
- Businesses
- Gallery
- Team Members
- Testimonials
- Contact Information
- Enquiries
- SEO Metadata

Use:
- Serializers
- ViewSets where appropriate
- Pagination
- Filtering
- Validation
- Permissions
- Authentication
- Secure API configuration

Public APIs should expose only published content.

Protect all admin operations.

==================================================
11. ENVIRONMENT CONFIGURATION
==================================================

Create separate environment files:

backend/.env.example
frontend/.env.example

Support configurable:

- Website name
- Website domain
- Django secret key
- Database URL
- Debug mode
- Allowed hosts
- CORS origins
- CSRF trusted origins
- Frontend API URL
- Email settings
- Media root
- Media URL

Never hardcode production credentials.

Never commit actual .env files to GitHub.

Use environment-specific settings for development and production.

==================================================
12. PROFESSIONAL PROJECT STRUCTURE
==================================================

Keep frontend and backend organized in one Git repository.

Frontend:

frontend/
    src/
        app/
        components/
        features/
        hooks/
        lib/
        animations/
        styles/
        types/
    public/
    package.json
    .env.example

Backend:

backend/
    config/
    apps/
        accounts/
        projects/
        pages/
        media/
        enquiries/
        seo/
        website_settings/
    media/
    static/
    requirements/
    manage.py
    .env.example

Deployment:

deployment/
    nginx/
    scripts/
    systemd/
    README.md

Also create:
- README.md
- .gitignore
- DEVELOPMENT.md
- DEPLOYMENT.md
- ASSET_SOURCES.md

==================================================
13. HOSTINGER VPS DEPLOYMENT
==================================================

Prepare complete production deployment.

Use:

- Ubuntu VPS
- Nginx
- Gunicorn
- Next.js production server
- PostgreSQL
- Python virtual environment
- SSL certificate
- Firewall
- Environment variables
- Static file configuration
- Media file configuration

URL structure:

example.com          → Next.js website
example.com/admin/   → Django Admin
example.com/api/     → Django REST API
example.com/media/   → Media files

Use Nginx reverse proxy.

Configure secure HTTPS.

Provide deployment commands and setup instructions.

Do not assume the user already has a configured VPS.

==================================================
14. PERFORMANCE AND SECURITY
==================================================

Optimize:
- Core Web Vitals
- Image loading
- Video loading
- Font loading
- API response times
- Database queries
- Frontend bundle size

Implement:
- Authentication
- CSRF protection
- Secure cookies
- Permission checks
- File upload validation
- File size limits
- Safe media handling
- Production security settings

Do not expose secret keys or admin credentials.

==================================================
15. DEVELOPMENT EXECUTION RULES
==================================================

IMPORTANT:

Do not generate the entire application in one giant file.

Do not create unnecessary components.

Do not use placeholder content when real implementation is required.

Do not leave broken buttons or non-functional navigation.

Do not ignore mobile responsiveness.

Do not skip testing.

Work in clearly defined phases:

PHASE 1:
Reference analysis and architecture.

PHASE 2:
Project setup and folder structure.

PHASE 3:
Design system and homepage.

PHASE 4:
Animation implementation.

PHASE 5:
All internal pages.

PHASE 6:
Django backend and database.

PHASE 7:
Django Admin and media management.

PHASE 8:
Frontend-backend integration.

PHASE 9:
Testing and optimization.

PHASE 10:
Hostinger VPS deployment.

After each phase:
- Run the application.
- Check for errors.
- Test existing functionality.
- Fix issues before proceeding.

Do not stop after creating a plan.

Start implementing the actual project after the architecture is established.

Keep a PROJECT_PROGRESS.md file to track completed and remaining work.

The final result must be a professional, maintainable, responsive, production-ready premium real estate website with a fully functional Django administration system.

## Implementation Status — 2026-11-25

### Completed
- [x] Phase 1 — reference analysis and original-brand architecture direction.
- [x] Phase 2 — Next.js frontend and Django backend structure created.
- [x] Phase 3 — premium responsive homepage design implemented.
- [x] Initial licensed Unsplash architectural assets downloaded locally.
- [x] Django models, migrations, Jazzmin-ready admin, REST API, media configuration, and CORS created.
- [x] Frontend development server is running on port 3000.
- [x] Django development server is running on port 8000.
- [x] Next.js production build and Django system checks pass.

### Frontend reconstruction — 2026-11-25
- [x] Inspected and inventoried every supplied reference URL; all routes returned HTTP 200.
- [x] Created reference audit, page, animation, component, asset and visual-QA documentation.
- [x] Added local project, news, career, team, business, navigation and site data.
- [x] Implemented global navigation, fullscreen menu and footer.
- [x] Implemented all core routes, nested About routes, project listing/details, career listing/detail, news listing/details, contact and privacy routes.
- [x] Implemented query-based Our Businesses filtering.
- [x] Integrated Lenis, GSAP and ScrollTrigger infrastructure with reduced-motion handling.
- [x] Verified 34 generated pages/routes with a successful Next.js production build.

### Slide-in navigation — 2026-11-25
- [x] Replaced the previous full-screen menu with an accessible right-side slide panel.
- [x] Added main/submenu transitions, staggered entrance, focus handling, Escape/back behavior, scroll locking and reduced-motion support.
- [x] Connected the panel to the existing navigation data and made project search open filtered project results.
- [x] Verified open, submenu, Escape/back, close, scroll unlock, and the production build.

### Reusable motion system — 2026-11-25
- [x] Added reusable GSAP/ScrollTrigger text and image reveals, counters, generic fade-up hook, Lenis smooth-scroll integration, and the coordinated page loader.
- [x] Added the `/motion-demo` route with a hero sequence, scroll-highlight statement, parallax image, counters, and staggered gallery.
- [x] Added reduced-motion/mobile handling and setup guidance in `frontend/MOTION_SETUP.md`.
- [x] Fixed the hero's initial CSS-hidden state so individual letters remain visible as their staggered entrance finishes.
- [x] Replaced animated letter-spacing with per-character transforms to preserve the headline's reserved layout size.
- [x] Browser-checked hero timing, scroll-highlight progression, image reveals, mobile overflow, and reduced-motion final state.
- [x] Verified the production build, TypeScript, and targeted ESLint checks.

### Remaining
- [ ] Refine route-specific visual compositions from browser screenshots.
- [ ] Build all internal routes and project detail pages.
- [ ] Expand the Django content model to categories, locations, galleries, businesses, team, testimonials, SEO, and navigation.
- [ ] Connect frontend content to Django REST APIs.
- [ ] Add Motion and Swiper interactions where appropriate; Lenis and GSAP are integrated.
- [ ] Add enquiry form submission UI and API error handling.
- [ ] Add complete automated tests and asset optimization.
- [ ] Create production deployment scripts and VPS documentation.
