import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const item = z.object({
  name: z.string().min(1).max(200),
  variant: z.string().max(200),
  color: z.string().max(100).optional(),
  size: z.string().max(100).optional(),
  qty: z.number().int().min(1).max(1000),
  price: z.number().min(0),
  total: z.number().min(0),
  image: z.string().url().max(2000),
});

const input = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(30),
  email: z.string().trim().email().max(200),
  address: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(1000).optional(),
  items: z.array(item).min(1).max(100),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendOrderEmails } = await import("./order-email.server");
    const total = data.items.reduce((s, i) => s + i.qty * i.price, 0);
    const orderNumber = `HH-${Date.now().toString(36).toUpperCase()}`;

    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: data.name,
        customer_phone: data.phone,
        customer_email: data.email,
        delivery_location: data.address || null,
        notes: data.notes || null,
        items: data.items,
        subtotal: total,
        total,
      })
      .select("id")
      .single();
    if (error) throw new Error("Could not save your order. Please try again.");

    const res = await sendOrderEmails({ orderNumber, ...data, total });
    await supabaseAdmin
      .from("orders")
      .update({ customer_email_sent: res.customer.sent, company_email_sent: res.company.sent })
      .eq("id", row.id);

    return { orderNumber };
  });
