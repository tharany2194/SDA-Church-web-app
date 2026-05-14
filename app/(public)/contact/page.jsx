'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate form submit (integrate with email service as needed)
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSubmitting(false);
  };

  return (
    <div className="py-16">
      <div className="container-custom">
        <h1 className="section-title">Contact Us</h1>
        <p className="section-subtitle">We would love to hear from you. Reach out and we'll respond as soon as possible.</p>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-gray-900">Get in Touch</h2>
            <ul className="space-y-5">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Address</p>
                  <p className="text-gray-600 text-sm">332J+4FP, Varadharajapuram, Poonamallee, Tamil Nadu 600123, India.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <a href="tel:+919876543210" className="text-primary-600 text-sm hover:underline">+91 9962589089</a>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a href="mailto:info@gracechurch.com" className="text-primary-600 text-sm hover:underline">info@varadharajapuramsdachurch.com</a>
                </div>
              </li>
            </ul>

            {/* Service Times */}
            <div className="mt-8 p-5 bg-primary-50 rounded-2xl">
              <h3 className="font-bold text-primary-900 mb-3">Service Times</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex justify-between"><span>Saturday Service</span><span className="font-medium">7:30 AM</span></li>
                <li className="flex justify-between"><span>Friday Prayer</span><span className="font-medium">7:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday Evening Youth Meeting</span><span className="font-medium">6:00 PM</span></li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Send a Message</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                className="input"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="input"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                className="input"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="input resize-none"
                rows={5}
                placeholder="Your message..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full gap-2" disabled={submitting}>
              <Send size={16} />
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
