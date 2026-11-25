import type { Metadata } from "next";
import MotionDemo from "../motion/MotionDemo";

export const metadata: Metadata = {
  title: "Motion System Demo | Building Solutions",
  description: "A live demo of the Building Solutions editorial motion system.",
};

export default function MotionDemoPage() {
  return <MotionDemo />;
}
