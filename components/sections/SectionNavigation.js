'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Menu, X } from 'lucide-react';

const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Process', href: '#process' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' }
];

export default function SectionNavigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        setIsOpen(false);
        const id = href.replace('#', '');
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${scrolled ? 'bg-[#0D0D0D]/90 backdrop-blur-xl border border-white/10' : 'bg-transparent'}`}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C45D3E] to-[#D4A853] flex items-center justify-center">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-semibold text-lg">MN Studios</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} onClick={(e) => scrollToSection(e, link.href)}
                                className="nav-link text-white/70 hover:text-white text-sm font-medium transition-colors">{link.name}</a>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/booking" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#C45D3E]/25 transition-all">
                            Book Session
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden mt-2 p-6 rounded-2xl bg-[#0D0D0D]/95 backdrop-blur-xl border border-white/10">
                        <div className="space-y-4">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} onClick={(e) => scrollToSection(e, link.href)}
                                    className="block text-white/70 hover:text-white font-medium py-2 transition-colors">{link.name}</a>
                            ))}
                            <Link href="/booking" className="block w-full py-3 rounded-full bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white text-center font-medium mt-4">
                                Book Session
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
