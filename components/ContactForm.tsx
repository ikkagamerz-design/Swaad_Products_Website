"use client";

import { useState } from "react";
import { sendToWhatsapp } from "@/lib/site";
import { IcWhatsapp } from "@/components/icons";

/** Opens WhatsApp with the visitor's message filled in, addressed to our customer-care number. */
export default function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", topic: "General enquiry", message: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    sendToWhatsapp(
      [
        "*New Message – Swaad Website*",
        "",
        `*Name:* ${f.name}`,
        `*Mobile:* ${f.phone}`,
        `*Topic:* ${f.topic}`,
        `*Message:* ${f.message.trim()}`,
      ].join("\n"),
    );
  };
  return (
    <form className="cform" onSubmit={submit}>
      <label>
        Your name
        <input required value={f.name} onChange={set("name")} autoComplete="name" />
      </label>
      <label>
        Mobile number
        <input required type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" />
      </label>
      <label className="wide">
        Topic
        <select value={f.topic} onChange={set("topic")}>
          <option>General enquiry</option>
          <option>Distribution / bulk order</option>
          <option>Product feedback</option>
          <option>Other</option>
        </select>
      </label>
      <label className="wide">
        Message
        <textarea required rows={4} value={f.message} onChange={set("message")} placeholder="How can we help?" />
      </label>
      <button className="btn btn-wa wide" type="submit">
        <IcWhatsapp className="btn-ic" /> Send on WhatsApp
      </button>
    </form>
  );
}
