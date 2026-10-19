import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/legal";
import { meta } from "@/components/site";

export const Route = createFileRoute("/privacy")({
  head: () => meta("Privacy Policy | Hope & HomeKe", "How Hope & HomeKe collects, uses and protects your personal information."),
  component: () => <PolicyPage id="privacy" />,
});
