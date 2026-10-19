// Order emails — sent after an order is saved.
//
// WHERE TO PUT THE SETTINGS (added later as Lovable Cloud secrets, never in code):
//   COMPANY_ORDER_EMAIL  -> the company inbox that receives a copy of every order
//   Email sending itself is turned on once your sender domain is set up in
//   Cloud -> Emails; then `deliver()` below is switched to the app email sender.
//
// Until then, emails are skipped (the order is still saved) and the order row
// records customer_email_sent / company_email_sent = false.

export type OrderItem = {
  name: string;
  variant: string;
  color?: string | undefined;
  size?: string | undefined;
  qty: number;
  price: number;
  total: number;
  image: string;
};

export type OrderForEmail = {
  orderNumber: string;
  name: string;
  phone: string;
  email: string;
  address?: string | undefined;
  notes?: string | undefined;
  items: OrderItem[];
  total: number;
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const ksh = (n: number) => `KSh ${n.toLocaleString("en-KE")}`;

export function orderEmailHtml(o: OrderForEmail, forCompany: boolean) {
  const rows = o.items
    .map(
      (i) => `<tr>
<td style="padding:8px"><img src="${esc(i.image)}" width="64" height="64" style="border-radius:8px;object-fit:cover" alt=""/></td>
<td style="padding:8px">${esc(i.name)}${i.variant ? `<br/><small>${esc(i.variant)}</small>` : ""}</td>
<td style="padding:8px">× ${i.qty}</td>
<td style="padding:8px;text-align:right">${ksh(i.total)}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Arial,sans-serif;background:#ffffff;padding:20px">
<h2>${forCompany ? "New order received" : "Thank you for your order"} — ${esc(o.orderNumber)}</h2>
<p>Customer: ${esc(o.name)}<br/>Phone: ${esc(o.phone)}<br/>Email: ${esc(o.email)}${o.address ? `<br/>Delivery: ${esc(o.address)}` : ""}</p>
<table style="border-collapse:collapse;width:100%">${rows}</table>
<p><strong>Total: ${ksh(o.total)}</strong><br/>Delivery cost agreed on WhatsApp.</p>
${o.notes ? `<p>Notes: ${esc(o.notes)}</p>` : ""}
<p>Hope &amp; HomeKe</p></div>`;
}

type SendResult = { sent: boolean; reason?: string };

async function deliver(to: string, subject: string, _html: string): Promise<SendResult> {
  // TODO: replace with the real email sender once the sender domain is set up.
  console.log(`[order-email] not configured yet — skipped "${subject}" to ${to}`);
  return { sent: false, reason: "not_configured" };
}

export async function sendOrderEmails(o: OrderForEmail) {
  const company = process.env["COMPANY_ORDER_EMAIL"];
  const customer = await deliver(o.email, `Your Hope & HomeKe order ${o.orderNumber}`, orderEmailHtml(o, false)).catch(
    (e) => ({ sent: false, reason: String(e) }),
  );
  const companyRes: SendResult = company
    ? await deliver(company, `New order ${o.orderNumber} — ${o.name}`, orderEmailHtml(o, true)).catch((e) => ({
        sent: false,
        reason: String(e),
      }))
    : { sent: false, reason: "COMPANY_ORDER_EMAIL not set" };
  return { customer, company: companyRes };
}
