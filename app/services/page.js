import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/image.png';
import { Button } from '@/components/ui/button';

export default function Services() {
  const services = [
    {
      title: "Portrait Photography",
      description: "Professional headshots and personal portraits that capture your unique personality",
      features: [
        "Professional studio lighting",
        "Multiple outfit changes",
        "High-resolution edited images",
        "Online gallery delivery"
      ],
      price: "Starting at $200",
      image: "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Wedding Photography",
      description: "Complete wedding day coverage capturing every precious moment of your special day",
      features: [
        "Full day coverage (8+ hours)",
        "Engagement session included",
        "500+ edited high-resolution photos",
        "Online gallery with download rights",
        "Print release included"
      ],
      price: "Starting at $1,500",
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Family Photography",
      description: "Beautiful family portraits that preserve memories for generations to come",
      features: [
        "1-hour photo session",
        "Multiple family combinations",
        "50+ edited images",
        "Print-ready files",
        "Location or studio options"
      ],
      price: "Starting at $300",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Event Photography",
      description: "Professional coverage for corporate events, parties, and special occasions",
      features: [
        "Event coverage (2-6 hours)",
        "Candid and posed shots",
        "Same-day preview gallery",
        "Professional editing",
        "Commercial usage rights"
      ],
      price: "Starting at $500",
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Commercial Photography",
      description: "High-quality images for businesses, products, and marketing materials",
      features: [
        "Product photography",
        "Corporate headshots",
        "Marketing materials",
        "Commercial licensing",
        "Rush delivery available"
      ],
      price: "Starting at $400",
      image: "https://images.unsplash.com/photo-1554048612-b6a482b224ce?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Custom Packages",
      description: "Tailored photography solutions designed specifically for your unique needs",
      features: [
        "Consultation included",
        "Flexible scheduling",
        "Custom editing style",
        "Multiple delivery options",
        "Ongoing support"
      ],
      price: "Quote on request",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=600&auto=format&fit=crop"
    }
  ];

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
          <Link href="/services" className="hover:text-white transition text-white">Services</Link>
          <Link href="/blog" className="hover:text-white transition">Blog</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
        </nav>
        <Button asChild className="ml-6 bg-amber-600 hover:bg-amber-700">
          <Link href="/login">
            LOGIN
          </Link>
        </Button>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            Professional photography services tailored to capture your most important moments
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <Image
                src={service.image}
                alt={service.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-neutral-300 text-sm mb-4">{service.description}</p>
                
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      <span className="text-neutral-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-amber-400">{service.price}</span>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-20 bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">What's Included</h2>
            <p className="text-neutral-300">Every photography session includes these professional touches</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📸</span>
              </div>
              <h4 className="font-semibold mb-2">Professional Equipment</h4>
              <p className="text-sm text-neutral-300">High-end cameras and lighting for perfect shots</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✨</span>
              </div>
              <h4 className="font-semibold mb-2">Professional Editing</h4>
              <p className="text-sm text-neutral-300">Expert post-processing for stunning results</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold mb-2">Quick Turnaround</h4>
              <p className="text-sm text-neutral-300">Receive your photos within 1-2 weeks</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">☁️</span>
              </div>
              <h4 className="font-semibold mb-2">Online Gallery</h4>
              <p className="text-sm text-neutral-300">Easy sharing and downloading for all clients</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-neutral-300 max-w-2xl mx-auto">
            Contact us today to discuss your photography needs and book your session. We're excited to work with you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-700">
              <Link href="/gallery">
                View Portfolio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}