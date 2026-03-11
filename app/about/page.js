'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Users, Award, Camera, Clock } from 'lucide-react';

export default function About() {
  const features = [
    "Professional equipment and studio facilities",
    "Personalized approach to every client",
    "Quick turnaround and high-quality editing",
    "Affordable pricing for all occasions"
  ];

  const stats = [
    { number: "500+", label: "Happy Clients", icon: Users },
    { number: "10+", label: "Years Experience", icon: Award },
    { number: "1000+", label: "Photos Captured", icon: Camera }
  ];

  const team = [
    {
      name: "Michael Nash",
      role: "Lead Photographer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
      bio: "15+ years capturing life's beautiful moments"
    },
    {
      name: "Sarah Chen",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
      bio: "Award-winning visual storyteller"
    },
    {
      name: "David Kumar",
      role: "Senior Photographer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      bio: "Specialist in wedding and event photography"
    }
  ];

  return (
    <main className="min-h-screen text-white relative bg-[#0D0D0D]">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-[#C45D3E]/10 border border-[#C45D3E]/20 rounded-full text-[#C45D3E] text-sm font-medium mb-6">
              Our Story
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">About </span>
              <span className="text-gradient-warm">MN Studio</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Capturing life's precious moments with artistic vision and professional expertise since 2014
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Content */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold">
                <span className="text-gradient-gold">Our Story</span>
              </h2>
              <p className="text-white/60 leading-relaxed text-lg">
                MN Studio was founded with a passion for capturing the beauty in every moment.
                With over a decade of experience in photography, we specialize in creating
                timeless images that tell your unique story.
              </p>
              <p className="text-white/60 leading-relaxed text-lg">
                From intimate portraits to grand celebrations, we believe every photograph
                should be a work of art. Our approach combines technical excellence with
                creative vision to deliver images that exceed expectations.
              </p>

              <div className="space-y-4 pt-6">
                <h3 className="text-xl font-semibold text-white">What Sets Us Apart</h3>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <motion.li
                      key={feature}
                      className="flex items-center gap-3 text-white/70"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={14} className="text-white" />
                      </div>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-[#C45D3E]/10 to-[#D4A853]/10 rounded-3xl transform rotate-2 blur-xl" />
              <div className="relative rounded-3xl overflow-hidden border border-white/5">
                <Image
                  src="https://images.unsplash.com/photo-1554048612-b6a482b224ce?q=80&w=800&auto=format&fit=crop"
                  alt="Photography Studio"
                  width={600}
                  height={700}
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-60" />
              </div>

              {/* Experience badge */}
              <motion.div
                className="absolute -bottom-6 -left-6 p-6 bg-[#161616] border border-white/5 rounded-2xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4A853] to-[#B8923E] flex items-center justify-center">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">10+</p>
                    <p className="text-white/50 text-sm">Years of Excellence</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-8 rounded-2xl bg-[#161616] border border-white/5 hover:border-[#C45D3E]/20 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#C45D3E]/20 to-[#D4A853]/20 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-[#C45D3E]" />
                </div>
                <div className="text-5xl font-bold text-gradient-warm mb-2">
                  {stat.number}
                </div>
                <div className="text-white/50 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-[#D4A853]/10 border border-[#D4A853]/20 rounded-full text-[#D4A853] text-sm font-medium mb-6">
              Our Team
            </span>
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-white">Meet the </span>
              <span className="text-gradient-gold">Artists</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              A team of passionate photographers dedicated to capturing your most precious moments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="group relative rounded-2xl overflow-hidden bg-[#161616] border border-white/5 hover:border-[#C45D3E]/20 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={400}
                    height={533}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="px-3 py-1 bg-[#C45D3E] text-white text-xs font-medium rounded-full inline-block mb-3">
                    {member.role}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-white/50 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center p-12 rounded-3xl bg-gradient-to-br from-[#C45D3E]/10 via-[#161616] to-[#D4A853]/10 border border-white/5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
              Let's create something beautiful. Get in touch to discuss your photography needs.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white rounded-full font-medium shadow-lg shadow-[#C45D3E]/25 hover:shadow-[#C45D3E]/40 hover:-translate-y-1 transition-all duration-300 group"
            >
              Get In Touch
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}