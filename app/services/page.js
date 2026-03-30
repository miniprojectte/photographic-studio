'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Heart, Briefcase, PartyPopper, User, Check, Sparkles } from 'lucide-react';

const services = [
  {
    icon: User,
    title: "Portrait Sessions",
    description: "Professional headshots and personal branding photography that capture your unique personality.",
    features: ["Indoor & outdoor options", "Professional retouching", "Multiple outfit changes", "Digital gallery delivery"],
    price: "From ₹199",
    popular: false
  },
  {
    icon: Heart,
    title: "Wedding Photography",
    description: "Comprehensive wedding coverage that tells the story of your special day from start to finish.",
    features: ["Full day coverage", "Two photographers", "Engagement session", "Premium album", "Online gallery"],
    price: "From ₹2,499",
    popular: true
  },
  {
    icon: Camera,
    title: "Family Portraits",
    description: "Beautiful family sessions that capture the love and connection between your loved ones.",
    features: ["Outdoor locations", "All family sizes", "Print packages", "Quick turnaround"],
    price: "From ₹299",
    popular: false
  },
  {
    icon: PartyPopper,
    title: "Event Coverage",
    description: "Professional coverage for corporate events, parties, and special occasions.",
    features: ["Corporate events", "Birthday parties", "Milestone celebrations", "Same-day previews"],
    price: "From ₹399",
    popular: false
  },
  {
    icon: Briefcase,
    title: "Commercial Photography",
    description: "High-quality commercial imagery for businesses, products, and marketing materials.",
    features: ["Product photography", "Brand imagery", "Marketing materials", "Commercial licensing"],
    price: "Custom Quote",
    popular: false
  },
  {
    icon: Sparkles,
    title: "Special Sessions",
    description: "Unique photography experiences including maternity, newborn, and themed shoots.",
    features: ["Maternity sessions", "Newborn photography", "Themed shoots", "Seasonal specials"],
    price: "From ₹249",
    popular: false
  }
];

export default function Services() {
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
            <span className="inline-block px-4 py-1.5 bg-[#D4A853]/10 border border-[#D4A853]/20 rounded-full text-[#D4A853] text-sm font-medium mb-6">
              What We Offer
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">Our </span>
              <span className="text-gradient-gold">Services</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Professional photography services tailored to capture your most precious moments
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className={`relative p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-2 ${service.popular
                    ? 'bg-gradient-to-b from-[#C45D3E]/10 to-[#161616] border-[#C45D3E]/30'
                    : 'bg-[#161616] border-white/5 hover:border-[#C45D3E]/20'
                  }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Popular badge */}
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${service.popular
                    ? 'bg-gradient-to-br from-[#C45D3E] to-[#A04A2F]'
                    : 'bg-white/5'
                  }`}>
                  <service.icon className={`w-7 h-7 ${service.popular ? 'text-white' : 'text-[#C45D3E]'}`} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-white/50 mb-6 leading-relaxed">{service.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                      <div className="w-5 h-5 rounded-full bg-[#C45D3E]/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#C45D3E]" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div>
                    <p className="text-2xl font-bold text-gradient-warm">{service.price}</p>
                  </div>
                  <Link
                    href="/booking"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${service.popular
                        ? 'bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white hover:shadow-lg hover:shadow-[#C45D3E]/20'
                        : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-[#C45D3E]/10 border border-[#C45D3E]/20 rounded-full text-[#C45D3E] text-sm font-medium mb-6">
              How It Works
            </span>
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-white">Our </span>
              <span className="text-gradient-warm">Process</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Simple, straightforward, and designed around your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", desc: "Discuss your vision and requirements" },
              { step: "02", title: "Planning", desc: "Schedule and prepare for your session" },
              { step: "03", title: "Session", desc: "Capture your perfect moments" },
              { step: "04", title: "Delivery", desc: "Receive your edited photos" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#C45D3E]/20 to-[#D4A853]/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gradient-warm">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>

                {/* Connector line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#C45D3E]/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-[#D4A853]/10 border border-[#D4A853]/20 rounded-full text-[#D4A853] text-sm font-medium mb-6">
              FAQ
            </span>
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-white">Common </span>
              <span className="text-gradient-gold">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: "How far in advance should I book?", a: "We recommend booking 2-4 weeks in advance for regular sessions and 6-12 months for weddings." },
              { q: "What is your cancellation policy?", a: "Full refund if cancelled 48 hours before the session. 50% refund if cancelled within 48 hours." },
              { q: "How long until I receive my photos?", a: "Standard delivery is 1-2 weeks for regular sessions and 4-6 weeks for weddings." },
              { q: "Do you travel for shoots?", a: "Yes! We cover locations within 50 miles free of charge. Travel fees apply beyond that." }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-[#161616] border border-white/5 hover:border-[#C45D3E]/20 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-white/50">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
              Book your session today and let's create something beautiful together.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white rounded-full font-medium shadow-lg shadow-[#C45D3E]/25 hover:shadow-[#C45D3E]/40 hover:-translate-y-1 transition-all duration-300 group"
            >
              Book Your Session
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}