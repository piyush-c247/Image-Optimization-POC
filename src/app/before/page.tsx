import type { Metadata } from "next";
import { DemoPage } from "@/modules/demo";

export const metadata: Metadata = { title: "Before — plain <img>" };

export default function BeforePage() {
  return <DemoPage mode="before" />;
}
