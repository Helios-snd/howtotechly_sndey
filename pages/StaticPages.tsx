import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">About HowToTechly</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          We are a collective of senior engineers dedicated to documenting the hard-earned lessons of software development.
        </p>
      </div>

      <div className="prose prose-lg prose-slate mx-auto">
        <p>
          Founded in 2024, HowToTechly was born out of frustration with surface-level tutorials. We believe that real engineering mastery comes from understanding the "why" and "how", not just copy-pasting code.
        </p>
        <p>
          Our content is rigorously reviewed for technical accuracy and production readiness. We don't just show you how to build a Hello World app; we show you how to scale it, secure it, and maintain it.
        </p>
        <h3>Our Values</h3>
        <ul>
          <li><strong>Depth over Breadth:</strong> We prefer one comprehensive guide over ten shallow ones.</li>
          <li><strong>Production First:</strong> Code examples should be secure and scalable by default.</li>
          <li><strong>No Hype:</strong> We evaluate technology based on merit, not trends.</li>
        </ul>
      </div>
    </div>
  );
};

export const Contact: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Get in Touch</h1>
        <p className="text-slate-600">Have a suggestion or want to contribute? We'd love to hear from you.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
             <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
               <option>General Inquiry</option>
               <option>Content Suggestion</option>
               <option>Report a Bug</option>
               <option>Partnership</option>
             </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
            <textarea rows={5} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};