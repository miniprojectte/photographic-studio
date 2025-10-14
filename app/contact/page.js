import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/image.png';
import { Button } from '@/components/ui/button';

export default function Contact() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <header className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between bg-sky-950">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image className="h-9 w-9 rounded-full bg-red-600 grid place-items-center text-xs font-bold" src={logo} alt="logo"></Image>
            <span className="text-lg font-semibold tracking-wide">MN Studio</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-300 ">
          <Link href="/about" className="hover:text-white transition">About</Link>
          <Link href="/gallery" className="hover:text-white transition">Gallery</Link>
          <Link href="/services" className="hover:text-white transition">Services</Link>
          <Link href="/blog" className="hover:text-white transition">Blog</Link>
          <Link href="/contact" className="hover:text-white transition text-white">Contact</Link>
        </nav>
        <Button asChild className="ml-6 bg-amber-600 hover:bg-amber-700">
          <Link href="/login">
            LOGIN
          </Link>
        </Button>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            Ready to capture your special moments? Let's discuss your photography needs and create something beautiful together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-2">
                  Service Interested In
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value="" className="text-gray-800">Select a service</option>
                  <option value="portrait" className="text-gray-800">Portrait Photography</option>
                  <option value="wedding" className="text-gray-800">Wedding Photography</option>
                  <option value="family" className="text-gray-800">Family Photography</option>
                  <option value="event" className="text-gray-800">Event Photography</option>
                  <option value="commercial" className="text-gray-800">Commercial Photography</option>
                  <option value="custom" className="text-gray-800">Custom Package</option>
                </select>
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Tell us about your photography needs, vision, or any specific requirements..."
                  required
                ></textarea>
              </div>

              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 py-4">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-neutral-300 leading-relaxed mb-8">
                We'd love to hear about your photography needs and help bring your vision to life. 
                Reach out to us through any of the methods below, and we'll get back to you as soon as possible.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Studio Address</h3>
                  <p className="text-neutral-300 text-sm">
                    123 Photography Lane<br />
                    Creative District, CD 12345<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-neutral-300 text-sm">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✉️</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-neutral-300 text-sm">hello@mnstudio.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⏰</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Studio Hours</h3>
                  <p className="text-neutral-300 text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: By Appointment Only
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-white/20">
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <span className="text-xl">📘</span>
                </button>
                <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <span className="text-xl">📷</span>
                </button>
                <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <span className="text-xl">🐦</span>
                </button>
                <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <span className="text-xl">💼</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-semibold mb-3">How far in advance should I book?</h3>
              <p className="text-neutral-300 text-sm">
                We recommend booking 4-6 weeks in advance for regular sessions and 6-12 months for weddings to ensure availability.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-semibold mb-3">What should I wear for my session?</h3>
              <p className="text-neutral-300 text-sm">
                We provide a detailed style guide after booking, but generally recommend solid colors and avoiding busy patterns.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-semibold mb-3">How long until I receive my photos?</h3>
              <p className="text-neutral-300 text-sm">
                Most sessions are delivered within 1-2 weeks. Wedding galleries typically take 4-6 weeks for full delivery.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-semibold mb-3">Do you travel for sessions?</h3>
              <p className="text-neutral-300 text-sm">
                Yes! We offer on-location sessions within 50 miles of our studio. Travel fees may apply for longer distances.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}