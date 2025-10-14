import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/image.png';
import { Button } from '@/components/ui/button';
export default function Home() {
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
          <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
          <Link href="/admin" className="hover:text-white transition">Admin</Link>
          <Link href="/dashboard/gallery" className="hover:text-white transition">Gallery</Link>
          <Link href="/button-examples" className="hover:text-white transition">UI Components</Link>
          <Link href="/login-demo" className="hover:text-white transition">Login Demo</Link>
          <Link href="/login" className="hover:text-white transition">Login</Link>
        </nav>
        <Button asChild className="ml-6 bg-amber-600 hover:bg-amber-700">
          <Link href="/login">
            LOGIN
          </Link>
        </Button>
      </header>

      <section className="relative mx-auto max-w-7xl px-6 pt-8 pb-24 md:pb-32">
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <p className="uppercase tracking-widest text-white-500 text-xs">Creative Photography</p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              PHOTOGRAPHY
              <br />
              MAKE US HAPPY
              <br />
              TAKE A SHOT.
            </h1>
            <div>
              <Button asChild size="lg" className="bg-red-500 hover:bg-red-400">
                <Link href="#portfolio">
                  WATCH PORTFOLIO
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rotate-2 rounded-2xl bg-gradient-to-b from-neutral-900 to-black opacity-70"></div>
            <Image
              src="https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?q=80&w=1400&auto=format&fit=crop"
              alt="Portrait"
              width={900}
              height={1100}
              priority
              className="w-full h-[520px] md:h-[640px] object-cover rounded-2xl grayscale"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 text-neutral-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div className="md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">HOW WE MAKE</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">USER EXPERIENCES</h3>
          </div>
          <div className="space-y-4 text-sm leading-6">
            <p>You can’t use up creativity. The more you use, the more you have in your significant mind.</p>
            <div className="pt-4">
              <p className="font-semibold text-white">Milind Nandoskar</p>
              <p className="text-neutral-400">Digital Artist</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
