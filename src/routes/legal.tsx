import { createFileRoute } from "@tanstack/react-router";
import { PolicyDoc, PolicyHeader } from "@/components/legal";
import { meta } from "@/components/site";
import { policies } from "@/lib/policies";

export const Route = createFileRoute("/legal")({
  head: () => meta("Our Policies & Terms | Hope & HomeKe", "Privacy policy, refund & returns and terms & conditions for Hope & HomeKe customers in Kenya."),
  component: () => (
    <>
      <PolicyHeader />
      <div className="container-x space-y-20 py-16">
        {policies.map((p) => <div key={p.id} id={p.id} className="scroll-mt-32"><PolicyDoc policy={p} /></div>)}
      </div>
    </>
  ),
});
