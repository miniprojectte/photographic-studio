import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/image.png';
import { Button } from '@/components/ui/button';

export default function Blog() {
  const blogPosts = [
    {
      title: "10 Tips for Perfect Portrait Photography",
      excerpt: "Discover the essential techniques that will transform your portrait photography and help you capture stunning, professional-looking images.",
      date: "October 12, 2025",
      category: "Photography Tips",
      image: "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?q=80&w=600&auto=format&fit=crop",
      readTime: "5 min read"
    },
    {
      title: "Wedding Photography Trends for 2025",
      excerpt: "Explore the latest trends in wedding photography, from candid storytelling to innovative lighting techniques that create magical moments.",
      date: "October 8, 2025",
      category: "Wedding",
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=600&auto=format&fit=crop",
      readTime: "7 min read"
    },
    {
      title: "How to Prepare for Your Family Photo Session",
      excerpt: "A comprehensive guide to help families prepare for their photo session, ensuring everyone looks their best and feels comfortable.",
      date: "October 5, 2025",
      category: "Family Photography",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
      readTime: "6 min read"
    },
    {
      title: "The Art of Natural Light Photography",
      excerpt: "Learn how to harness the power of natural light to create stunning photographs that showcase the beauty of your subjects.",
      date: "October 1, 2025",
      category: "Photography Tips",
      image: "https://images.unsplash.com/photo-1554048612-b6a482b224ce?q=80&w=600&auto=format&fit=crop",
      readTime: "8 min read"
    },
    {
      title: "Behind the Scenes: Corporate Event Photography",
      excerpt: "Get an inside look at what goes into capturing professional corporate events, from planning to execution.",
      date: "September 28, 2025",
      category: "Commercial",
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=600&auto=format&fit=crop",
      readTime: "4 min read"
    },
    {
      title: "Choosing the Perfect Location for Your Shoot",
      excerpt: "Discover how to select the ideal location that complements your vision and enhances the overall impact of your photographs.",
      date: "September 25, 2025",
      category: "Photography Tips",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=600&auto=format&fit=crop",
      readTime: "6 min read"
    }
  ];

  const categories = ["All", "Photography Tips", "Wedding", "Family Photography", "Commercial"];

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
          <Link href="/blog" className="hover:text-white transition text-white">Blog</Link>
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
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Blog</h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            Photography insights, tips, and behind-the-scenes stories from our studio
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button 
              key={category}
              className={`px-6 py-3 rounded-full font-medium transition ${
                category === "All" 
                  ? "bg-amber-600 text-white hover:bg-amber-700" 
                  : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-16 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-amber-600 text-xs font-semibold rounded-full mb-4 w-fit">
                Featured
              </span>
              <h2 className="text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
              <p className="text-neutral-300 mb-6 leading-relaxed">{blogPosts[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-neutral-400 mb-6">
                <span>{blogPosts[0].date}</span>
                <span>•</span>
                <span>{blogPosts[0].readTime}</span>
              </div>
              <Button className="bg-amber-600 hover:bg-amber-700 w-fit">
                Read More
              </Button>
            </div>
            <Image
              src={blogPosts[0].image}
              alt={blogPosts[0].title}
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, index) => (
            <article key={index} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <Image
                src={post.image}
                alt={post.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-amber-600/20 text-amber-300 text-xs rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-neutral-400">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-neutral-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">{post.date}</span>
                  <Button size="sm" variant="ghost" className="text-amber-400 hover:text-amber-300">
                    Read More →
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-20 bg-gradient-to-r from-amber-600/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest photography tips, behind-the-scenes content, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button className="bg-amber-600 hover:bg-amber-700 px-8">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 space-y-6">
          <h2 className="text-3xl font-bold">Ready to Create Something Amazing?</h2>
          <p className="text-neutral-300 max-w-2xl mx-auto">
            Let's bring your vision to life with professional photography that tells your unique story.
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