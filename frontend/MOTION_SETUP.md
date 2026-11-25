# Motion system setup

The motion system lives in `app/motion/` and is demonstrated at `/motion-demo`.
It uses the project's existing GSAP, ScrollTrigger, and Lenis dependencies.

## Dependencies

Already installed in this project:

```bash
npm install gsap lenis
```

For a fresh project, install React and the framework first, then add these
packages. No additional animation library is required.

## Files and integration

- `app/motion/motion.config.ts` — shared timings, easing, breakpoints, and strip counts.
- `app/motion/SplitText.tsx` — accessible line, word, character, and highlight text.
- `app/motion/RevealImage.tsx` — clip, strip, and parallax image reveals.
- `app/motion/PageLoader.tsx` — font/hero-image readiness loader.
- `app/motion/useSmoothScroll.ts` — Lenis and ScrollTrigger synchronization.
- `app/motion/useReveal.ts` — generic scroll-triggered fade-up hook.
- `app/motion/motion.css` — shared motion and demo styles.
- `app/motion-demo/page.tsx` and `app/motion/MotionDemo.tsx` — working example.

`app/layout.tsx` imports the motion stylesheet, mounts `PageLoader`, and wraps
the application in `SmoothScrollProvider`. Keep that setup in the root layout
when using the shared smooth-scroll behavior. The provider pauses Lenis while
the loader or slide navigation is open.

## Examples

```tsx
<SplitText as="h2" text="A considered point of view." animation="lines" />
```

```tsx
<RevealImage
  src="/images/project.jpg"
  alt="Contemporary residential architecture"
  variant="parallax"
  aspectRatio="4 / 5"
/>
```

```tsx
const ref = useReveal<HTMLElement>();
return <section ref={ref}>Content fades up on entry.</section>;
```

`SplitText` accepts `split="lines" | "words" | "chars"` and
`animation="lines" | "chars" | "words" | "highlight"`. Use
`trigger="external"` when a parent timeline controls the text.
`RevealImage` accepts `variant="clip" | "strips" | "parallax"` and supports
`aspectRatio`, `sizes`, `priority`, `hover`, and `parallax` options.

`PageLoader` and the hero sequence are already wired in the demo; use
`/motion-demo` to review the coordinated loader, hero intro, scroll reveals,
parallax image, counters, and image grid. Reduced-motion preferences render
content in its final state and disable Lenis and parallax.
