import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/image.png';
import { Button } from '@/components/ui/button';

export default function Gallery() {
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?q=80&w=800&auto=format&fit=crop",
      alt: "Portrait Photography",
      category: "Portrait"
    },
    {
      src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800&auto=format&fit=crop",
      alt: "Wedding Photography",
      category: "Wedding"
    },
    {
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
      alt: "Family Photography",
      category: "Family"
    },
    {
      src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=800&auto=format&fit=crop",
      alt: "Event Photography",
      category: "Event"
    },
    {
      src: "https://images.unsplash.com/photo-1554048612-b6a482b224ce?q=80&w=800&auto=format&fit=crop",
      alt: "Commercial Photography",
      category: "Commercial"
    },
    {
      src: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
      alt: "Studio Portrait",
      category: "Portrait"
    },
    {
      src: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?q=80&w=800&auto=format&fit=crop",
      alt: "Wedding Couple",
      category: "Wedding"
    },
    {
      src: "https://images.unsplash.com/photo-1511895426328-dc8714efa8bb?q=80&w=800&auto=format&fit=crop",
      alt: "Family Portrait",
      category: "Family"
    },
    {
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
      alt: "Corporate Event",
      category: "Event"
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
          <Link href="/gallery" className="hover:text-white transition text-white">Gallery</Link>
          <Link href="/services" className="hover:text-white transition">Services</Link>
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
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Gallery</h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            Explore our portfolio of captured moments and artistic visions
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="px-6 py-3 bg-amber-600 text-white rounded-full font-medium transition hover:bg-amber-700">
            All
          </button>
          <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium transition hover:bg-white/20">
            Portrait
          </button>
          <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium transition hover:bg-white/20">
            Wedding
          </button>
          <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium transition hover:bg-white/20">
            Family
          </button>
          <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium transition hover:bg-white/20">
            Event
          </button>
          <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium transition hover:bg-white/20">
            Commercial
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl">
              <Image
                src={image.src}
                alt={image.alt}
                width={400}
                height={500}
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{image.alt}</h3>
                  <span className="px-3 py-1 bg-amber-600 text-xs rounded-full">
                    {image.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 space-y-6">
          <h2 className="text-3xl font-bold">Love What You See?</h2>
          <p className="text-neutral-300 max-w-2xl mx-auto">
            Ready to create beautiful memories together? Let's discuss your photography needs and bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link href="/contact">
                Book a Session
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-700">
              <Link href="/services">
                View Services
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}