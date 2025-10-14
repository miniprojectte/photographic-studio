import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/image.png';
import { Button } from '@/components/ui/button';

export default function About() {
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
          <Link href="/about" className="hover:text-white transition text-white">About</Link>
          <Link href="/gallery" className="hover:text-white transition">Gallery</Link>
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
          <h1 className="text-5xl md:text-7xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            Capturing life's precious moments with artistic vision and professional expertise
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-neutral-300 leading-relaxed">
              MN Studio was founded with a passion for capturing the beauty in every moment. 
              With over a decade of experience in photography, we specialize in creating 
              timeless images that tell your unique story.
            </p>
            <p className="text-neutral-300 leading-relaxed">
              From intimate portraits to grand celebrations, we believe every photograph 
              should be a work of art. Our approach combines technical excellence with 
              creative vision to deliver images that exceed expectations.
            </p>
            
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-semibold">What Sets Us Apart</h3>
              <ul className="space-y-2 text-neutral-300">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Professional equipment and studio facilities
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Personalized approach to every client
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Quick turnaround and high-quality editing
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Affordable pricing for all occasions
                </li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-600/20 to-red-600/20 rounded-2xl transform rotate-2"></div>
            <Image
              src="https://images.unsplash.com/photo-1554048612-b6a482b224ce?q=80&w=1400&auto=format&fit=crop"
              alt="Photography Studio"
              width={600}
              height={700}
              className="relative w-full h-[500px] object-cover rounded-2xl"
            />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="text-4xl font-bold text-amber-500 mb-2">500+</div>
            <div className="text-neutral-300">Happy Clients</div>
          </div>
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="text-4xl font-bold text-amber-500 mb-2">10+</div>
            <div className="text-neutral-300">Years Experience</div>
          </div>
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="text-4xl font-bold text-amber-500 mb-2">1000+</div>
            <div className="text-neutral-300">Photos Captured</div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
            <Link href="/contact">
              Get In Touch
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}