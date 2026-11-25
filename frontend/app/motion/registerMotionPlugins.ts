import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

let registered = false;

export function registerMotionPlugins() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}
