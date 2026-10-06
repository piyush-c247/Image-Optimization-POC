import type { Metadata } from "next";
import { DemoPage } from "@/modules/demo";

export const metadata: Metadata = { title: "After — next/image" };

export default function AfterPage() {
  return <DemoPage mode="after" />;
}
