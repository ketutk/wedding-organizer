"use client";

import { useState } from "react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const encodedMessage = encodeURIComponent(`Hi, my name is ${name}.\n\n${message}`);
    const whatsappUrl = `${process.env.NEXT_PUBLIC_WA_URL}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500" />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Your Message
        </label>
        <textarea id="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"></textarea>
      </div>
      <button type="submit" className="w-full px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors font-medium">
        Send Inquiry
      </button>
    </form>
  );
}
