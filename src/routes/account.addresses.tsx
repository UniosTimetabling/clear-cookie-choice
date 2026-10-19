import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import { meta } from "@/components/site";

export const Route = createFileRoute("/account/addresses")({
  head: () => meta("My Addresses | Hope & HomeKe", "Manage your saved delivery addresses."),
  component: Addresses,
});

function Addresses() {
  const [list, setList] = useState([{ label: "Home", line: "Argwings Kodhek Rd, Kilimani, Nairobi" }]);
  const [label, setLabel] = useState("");
  const [line, setLine] = useState("");
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Addresses</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {list.map((a, i) => (
          <div key={i} className="card flex gap-4 p-5 sm:p-6"><MapPin className="h-5 w-5 text-accent" /><div className="flex-1"><p className="font-semibold">{a.label}</p><p className="text-sm text-muted-foreground">{a.line}</p></div>
            <button onClick={() => setList(list.filter((_, j) => j !== i))} aria-label="Delete"><Trash2 className="h-4 w-4 text-muted-foreground" /></button></div>
        ))}
      </div>
      <form className="card mt-8 grid gap-3 p-5 sm:gap-4 sm:p-6 sm:grid-cols-[160px_1fr_auto]" onSubmit={(e) => { e.preventDefault(); setList([...list, { label, line }]); setLabel(""); setLine(""); }}>
        <input required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" className="field" />
        <input required value={line} onChange={(e) => setLine(e.target.value)} placeholder="Full address" className="field" />
        <button className="btn-primary">Add</button>
      </form>
    </div>
  );
}
