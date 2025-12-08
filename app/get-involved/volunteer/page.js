"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function VolunteerPage() {
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Processing Application...");
    setTimeout(() => setStatus("Received! Our volunteer lead will reach out."), 2000);
  };

  return (
    <main className="bg-brand-sand min-h-screen pb-20">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-brand-brown-dark text-white text-center">
        <div className="container mx-auto">
          <h1 className="font-agency text-5xl md:text-7xl uppercase tracking-widest mb-4">Lend a <span className="text-brand-gold">Hand</span></h1>
          <p className="font-lato text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Your skills are your greatest asset. Join a network of professionals and 
            students dedicated to serving the community.
          </p>
        </div>
      </section>

      {/* Grid: Info + Form */}
      <section className="container mx-auto px-6 -mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* Left: Expectations & Opportunities */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl card-shadow border-l-8 border-brand-gold">
            <h2 className="font-agency text-3xl text-brand-brown-dark uppercase mb-4">Why Volunteer?</h2>
            <ul className="space-y-4 font-lato text-brand-brown leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-brand-gold">✔</span> Professional development and networking with leaders.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-gold">✔</span> Direct impact on scholarship student success.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-gold">✔</span> Spiritual growth through dedicated community service.
              </li>
            </ul>
          </div>

          <div className="bg-brand-brown-dark p-8 rounded-3xl text-white shadow-xl">
            <h3 className="font-agency text-2xl text-brand-gold uppercase mb-6">Current Openings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-lato text-sm">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-bold">Digital Tutors</p>
                <p className="text-gray-400">Teach basic IT skills.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-bold">Event Staff</p>
                <p className="text-gray-400">Coordination for graduations.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-bold">Content Creators</p>
                <p className="text-gray-400">Photography & Design.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-bold">Health Liaison</p>
                <p className="text-gray-400">For rural outreach.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Application Form */}
        <div className="bg-white p-8 md:p-12 rounded-3xl card-shadow">
          <h2 className="font-agency text-3xl text-brand-brown-dark uppercase mb-8">Application Form</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-lato text-sm">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-brand-brown-dark">Full Name</label>
                <input type="text" required className="p-4 bg-brand-sand rounded-xl outline-none focus:ring-2 focus:ring-brand-gold" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-brand-brown-dark">Professional Field</label>
                <input type="text" required placeholder="e.g. Healthcare, IT" className="p-4 bg-brand-sand rounded-xl outline-none focus:ring-2 focus:ring-brand-gold" />
              </div>
            </div>

            <div className="flex flex-col gap-2 font-lato text-sm">
              <label className="font-bold text-brand-brown-dark">Preferred Involvement Area</label>
              <select className="p-4 bg-brand-sand rounded-xl outline-none focus:ring-2 focus:ring-brand-gold">
                <option>Tutoring/Mentorship</option>
                <option>Outreach & Logistics</option>
                <option>Administration</option>
                <option>Creative/Media</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 font-lato text-sm">
              <label className="font-bold text-brand-brown-dark">Brief Motivation</label>
              <textarea rows="4" className="p-4 bg-brand-sand rounded-xl outline-none focus:ring-2 focus:ring-brand-gold resize-none" placeholder="Tell us why you want to join..."></textarea>
            </div>

            <button className="w-full bg-brand-gold text-white font-bold font-lato py-4 rounded-full hover:brightness-110 shadow-lg transition-all">
              {status || "Submit Interest"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
