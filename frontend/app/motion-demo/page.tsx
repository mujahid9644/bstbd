import type { Metadata } from "next";
import MotionDemo from "../motion/MotionDemo";

export const metadata: Metadata = {
  title: "Motion System Demo | Aurelia Properties",
  description: "A live demo of the Aurelia editorial motion system.",
};

export default function MotionDemoPage() {
  return <MotionDemo />;
}
