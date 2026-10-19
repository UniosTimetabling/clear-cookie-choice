export type PolicySection = { title: string; text?: string; items?: string[] };
export type Policy = {
  id: "privacy" | "refund" | "terms";
  tab: string;
  eyebrow: string;
  title: string;
  effective?: string;
  intro: string;
  sections: PolicySection[];
  contactTitle: string;
};

export const policyContact = { hotline: "+254119126551", location: "Benjoe House, Tsavo Road, Nairobi" };

export const policies: Policy[] = [
  {
    id: "privacy",
    tab: "Privacy Policy",
    eyebrow: "Privacy Policy",
    title: "Your Privacy Matters",
    effective: "October 11, 2025",
    intro:
      'Hope & Home ("we," "our," "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our store, website, or engage with our services.',
    sections: [
      { title: "Information We Collect", items: [
        "Personal details such as name, phone number, email, and delivery address.",
        "Payment information processed securely through our payment partners.",
        "Non-identifiable data such as browsing behavior and preferences for service improvement.",
      ] },
      { title: "How We Use Your Information", items: [
        "To process and deliver orders across Kenya.",
        "To communicate order updates, promotions, or service information.",
        "To improve customer experience and store operations.",
      ] },
      { title: "Information Sharing", text: "We do not sell or rent your personal data. Information may be shared with trusted partners such as delivery couriers and payment processors, strictly for service fulfillment." },
      { title: "Data Protection", text: "We use secure systems to protect personal information against unauthorized access, misuse, or disclosure." },
      { title: "Your Rights", items: [
        "Access or request correction of your data.",
        "Opt out of marketing communications at any time.",
        "Request deletion of your personal data, subject to legal and business requirements.",
      ] },
    ],
    contactTitle: "Privacy Inquiries",
  },
  {
    id: "refund",
    tab: "Refund & Returns",
    eyebrow: "Returns Policy",
    title: "Refund & Returns",
    intro: "At Hope & Home, we value customer satisfaction. This Refund and Returns Policy outlines how returns are managed.",
    sections: [
      { title: "Eligibility for Returns", items: [
        "Products can be returned within 7 days of purchase if unused, undamaged, and in original packaging.",
        "Proof of purchase (receipt or invoice) is required.",
      ] },
      { title: "Non-Returnable Items", items: [
        "Custom-made or cut-to-size products (e.g., wall-to-wall carpets, curtains tailored to size).",
        "Clearance or discounted items.",
        "Bedding products (duvets, bedsheets, mattress protectors) once unsealed, for hygiene reasons.",
      ] },
      { title: "Refunds", items: [
        "Approved refunds are processed within 7–14 working days via the original payment method.",
        "Delivery fees are non-refundable.",
      ] },
      { title: "Exchanges", text: "If a product is defective or delivered incorrectly, we will exchange it at no extra cost." },
    ],
    contactTitle: "Return & Exchange Requests",
  },
  {
    id: "terms",
    tab: "Terms & Conditions",
    eyebrow: "Terms & Conditions",
    title: "Terms of Service",
    effective: "October 11, 2025",
    intro: "These Terms and Conditions govern your use of Hope & Home services, products, and deliveries. By shopping with us, you agree to the following:",
    sections: [
      { title: "General", text: "Hope & Home provides interior décor products including carpets, curtains, blinds, bedding, and accessories. Products are subject to availability and pricing as displayed at our shop or on our platforms." },
      { title: "Orders and Payments", items: [
        "Orders are confirmed once payment has been made (unless otherwise agreed).",
        "We accept payments through cash, mobile money, or approved banking channels.",
        "Delivery is available nationwide at a fee, payable by the customer.",
      ] },
      { title: "Delivery", items: [
        "Deliveries are fulfilled within the agreed timeline depending on destination.",
        "We are not liable for delays caused by courier services or factors beyond our control.",
      ] },
      { title: "Product Quality", text: "We ensure all products are new, genuine, and inspected before delivery. Variations in color, texture, or size may occur due to manufacturing or screen differences." },
      { title: "Liability", text: "Hope & Home is not responsible for damages caused by misuse, poor maintenance, or unauthorized installation of products." },
    ],
    contactTitle: "Questions About Our Terms?",
  },
];
