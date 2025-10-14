'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen text-white overflow-x-hidden relative" style={{ backgroundColor: '#1B263B' }}>
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0" style={{ backgroundColor: '#1B263B' }}></div>
        
        {/* Purple Gradient Blob Top Left */}
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600/30 to-blue-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        {/* Orange/Red Circle Top Right */}
        <motion.div 
          className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-red-500/15 rounded-full blur-2xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-40 w-full px-6 py-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white">
            MN Studio
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Home', 'About', 'Service', 'Features', 'Testimonial'].map((item) => (
              <Link 
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                className="text-white/80 hover:text-white transition-colors duration-300 font-medium"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Book Now Button */}
          <Button 
            asChild 
            className="bg-transparent border border-white/30 text-white px-6 py-2 rounded-full hover:bg-white/10 transition-all duration-300"
          >
            <Link href="/contact">
              Book Now
            </Link>
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-30 min-h-screen flex items-center px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge */}
            <span className="text-purple-400 text-sm font-medium">
              Capture Moments
            </span>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
              Image Your<br />
              Legacy
            </h1>

            {/* Description */}
            <p className="text-white/70 text-lg leading-relaxed max-w-lg">
              Elevate your brand with professional imagery. Let&apos;s create 
              visuals that tell your story and captivate your audience.
            </p>

            {/* CTA Button */}
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              <Link href="/contact">
                Book Now
              </Link>
            </Button>
          </motion.div>

          {/* Right Side - Professional Portrait */}
          <motion.div 
            className="relative flex justify-center items-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Background Circle - Orange/Red Gradient */}
            <motion.div 
              className="absolute top-16 right-8 w-80 h-80 bg-gradient-to-br from-orange-500 to-red-500 rounded-full z-10"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            {/* Professional Portrait */}
            <div className="relative z-20 w-96 h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
                alt="Professional Portrait"
                width={400}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Geometric Elements */}
            <motion.div 
              className="absolute bottom-20 left-8 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-xl"
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <motion.div 
              className="absolute top-32 left-12 w-16 h-16 bg-gradient-to-br from-purple-500/40 to-pink-500/30 rounded-full blur-lg"
              animate={{
                y: [0, 15, 0],
                x: [0, 10, 0],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
