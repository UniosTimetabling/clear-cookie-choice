import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/legal";
import { meta } from "@/components/site";

export const Route = createFileRoute("/terms")({
  head: () => meta("Terms & Conditions | Hope & HomeKe", "Terms for orders, payments, delivery, product quality and liability at Hope & HomeKe."),
  component: () => <PolicyPage id="terms" />,
});
