# Animation Inventory

## Observed and planned patterns
- GSAP page-load reveal for navigation and large page titles.
- Hero image entrance using a restrained scale-down or clip-path reveal.
- ScrollTrigger text reveals, image masks and parallax image movement.
- Project and news card hover image scaling with minimal rotation.
- Full-screen menu transition with staggered navigation links.
- Project and gallery Swiper navigation, touch behavior and keyboard support.
- Lenis smooth scrolling synchronized with GSAP ScrollTrigger; disabled for reduced motion.
- Footer reveal and final call-to-action entrances.

## Implementation rules
- No animation runs without a clear visible purpose.
- GSAP contexts and ScrollTriggers are cleaned up on route changes.
- Motion remains below 600 ms for interface transitions.
- Large editorial transitions use 800–1200 ms durations.
- Reduced-motion users receive static, fully accessible content.
