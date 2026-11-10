"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/** Opens the visitor's mail app with the message filled in (no backend needed). */
export default function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", topic: "General enquiry", message: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${f.name}\nMobile: ${f.phone}\nTopic: ${f.topic}\n\n${f.message}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`${f.topic} - ${f.name}`)}&body=${encodeURIComponent(body)}`;
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
      <button className="btn btn-sun wide" type="submit">
        Send message
      </button>
    </form>
  );
}
