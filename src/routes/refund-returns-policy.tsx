import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/legal";
import { meta } from "@/components/site";

export const Route = createFileRoute("/refund-returns-policy")({
  head: () => meta("Refund & Returns Policy | Hope & HomeKe", "7-day returns, non-returnable items, refunds and exchanges at Hope & HomeKe."),
  component: () => <PolicyPage id="refund" />,
});
