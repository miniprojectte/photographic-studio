'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for the Perfect Portrait Session",
    excerpt: "Learn how to prepare for your portrait session and get the most out of your photography experience.",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
    category: "Tips & Tricks",
    author: "Michael Nash",
    date: "Dec 15, 2024",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Wedding Photography: Capturing Your Special Day",
    excerpt: "A comprehensive guide to planning your wedding photography and creating memories that last forever.",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800&auto=format&fit=crop",
    category: "Wedding",
    author: "Sarah Chen",
    date: "Dec 10, 2024",
    readTime: "8 min read"
  },
  {
    id: 3,
    title: "The Art of Natural Light Photography",
    excerpt: "Discover the secrets of using natural light to create stunning, professional photographs.",
    image: "https://images.unsplash.com/photo-1554048612-b6a482b224ce?q=80&w=800&auto=format&fit=crop",
    category: "Techniques",
    author: "David Kumar",
    date: "Dec 5, 2024",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Family Portrait Ideas for the Holiday Season",
    excerpt: "Creative ideas and inspiration for memorable family portraits that capture the festive spirit.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714efa8bb?q=80&w=800&auto=format&fit=crop",
    category: "Family",
    author: "Michael Nash",
    date: "Nov 28, 2024",
    readTime: "4 min read"
  },
  {
    id: 5,
    title: "Behind the Lens: Our Studio Setup",
    excerpt: "Take a tour of our professional studio and learn about the equipment we use to create stunning images.",
    image: "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?q=80&w=800&auto=format&fit=crop",
    category: "Behind the Scenes",
    author: "Sarah Chen",
    date: "Nov 20, 2024",
    readTime: "7 min read"
  },
  {
    id: 6,
    title: "How to Choose the Right Photographer",
    excerpt: "Essential factors to consider when selecting a photographer for your next project or event.",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=800&auto=format&fit=crop",
    category: "Guides",
    author: "David Kumar",
    date: "Nov 15, 2024",
    readTime: "5 min read"
  }
];

const categories = ['All', 'Tips & Tricks', 'Wedding', 'Techniques', 'Family', 'Behind the Scenes', 'Guides'];

export default function Blog() {
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <main className="min-h-screen text-white relative bg-[#0D0D0D]">

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-[#D4A853]/10 border border-[#D4A853]/20 rounded-full text-[#D4A853] text-sm font-medium mb-6">
              Stories & Insights
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">Our </span>
              <span className="text-gradient-gold">Blog</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Photography tips, behind-the-scenes stories, and inspiration for your next session
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${activeCategory === category
                    ? 'bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white shadow-lg shadow-[#C45D3E]/20'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">

          {/* Featured Post */}
          {activeCategory === 'All' && (
            <motion.article
              className="mb-12 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link href={`/blog/${blogPosts[0].id}`} className="block">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 rounded-3xl bg-[#161616] border border-white/5 hover:border-[#C45D3E]/20 transition-all duration-500">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <Image
                      src={blogPosts[0].image}
                      alt={blogPosts[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#C45D3E] rounded-full text-white text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="inline-block px-3 py-1 bg-[#D4A853]/10 border border-[#D4A853]/20 rounded-full text-[#D4A853] text-xs font-medium mb-4 w-fit">
                      {blogPosts[0].category}
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-[#C45D3E] transition-colors">
                      {blogPosts[0].title}
                    </h2>
                    <p className="text-white/50 text-lg mb-6 leading-relaxed">
                      {blogPosts[0].excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-white/40">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {blogPosts[0].author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {blogPosts[0].date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {blogPosts[0].readTime}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          )}

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeCategory === 'All' ? filteredPosts.slice(1) : filteredPosts).map((post, index) => (
              <motion.article
                key={post.id}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.id}`} className="block h-full">
                  <div className="h-full rounded-2xl bg-[#161616] border border-white/5 overflow-hidden hover:border-[#C45D3E]/20 transition-all duration-500 hover:-translate-y-2">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent" />
                    </div>
                    <div className="p-6">
                      <span className="inline-block px-3 py-1 bg-[#D4A853]/10 border border-[#D4A853]/20 rounded-full text-[#D4A853] text-xs font-medium mb-4">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#C45D3E] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-white/50 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-white/40 pt-4 border-t border-white/5">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-white/50 mb-8">
              Subscribe to our newsletter for photography tips, exclusive offers, and behind-the-scenes content.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl shadow-lg shadow-[#C45D3E]/20 hover:shadow-[#C45D3E]/30 transition-all flex items-center justify-center gap-2"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}