'use client';

import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Clock, Send, Instagram } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
    const sectionRef = useRef(null);
    const leftRef = useRef(null);
    const formRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            // Left column animation
            gsap.fromTo(
                leftRef.current,
                { opacity: 0, x: -40 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'top 55%',
                        scrub: true,
                    },
                }
            );

            // Form animation
            gsap.fromTo(
                formRef.current,
                { opacity: 0, x: 40 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'top 55%',
                        scrub: true,
                    },
                }
            );
        }, section);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', date: '', message: '' });
                }, 3000);
            } else {
                setError(result.error || 'Failed to send message. Please try again.');
            }
        } catch (err) {
            console.error('Submit error:', err);
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="relative z-[80] bg-dark-100 py-[8vh] px-[6vw]"
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <div ref={leftRef}>
                        <div className="w-[min(34vw,320px)] amber-line mb-6" />
                        <h2 className="headline-lg text-white mb-6">
                            LET'S CREATE SOMETHING TIMELESS.
                        </h2>
                        <p className="text-white/70 text-base leading-relaxed mb-10">
                            Tell us what you're planning. We'll reply within 2 business days.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-amber" />
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm">Email</p>
                                    <p className="text-white">hello@nmstudios.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-amber" />
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm">Location</p>
                                    <p className="text-white">Based in india </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-amber" />
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm">Response Time</p>
                                    <p className="text-white">Typical response: 1–2 days</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div
                        ref={formRef}
                        className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8"
                    >
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-amber/20 flex items-center justify-center mb-4">
                                    <Send className="w-8 h-8 text-amber" />
                                </div>
                                <h3 className="text-white font-display font-bold text-2xl mb-2">
                                    Message Sent!
                                </h3>
                                <p className="text-white/60">
                                    We'll get back to you within 2 business days.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}
                                
                                <div>
                                    <label className="block text-white/50 text-sm mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/50 text-sm mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/50 text-sm mb-2">
                                        Event Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/50 text-sm mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber transition-colors resize-none"
                                        placeholder="Tell us about your event..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Send inquiry
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">
                        © NM Studios. All rights reserved.
                    </p>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/60 hover:text-amber transition-colors"
                    >
                        <Instagram className="w-5 h-5" />
                        <span className="text-sm">Follow us on Instagram</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
