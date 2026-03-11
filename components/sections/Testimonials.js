'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        quote: "The photos felt like us—only better.",
        author: "Maya & Jon",
        role: "Wedding clients",
    },
    {
        quote: "Calm, professional, and the edits were stunning.",
        author: "Lena R.",
        role: "Portrait session",
    },
    {
        quote: "Exactly the campaign look we needed.",
        author: "Rowan",
        role: "Brand Lead",
    },
];

export default function Testimonials() {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const cardsRef = useRef(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: 24 },
                {
                    opacity: 1,
                    y: 0,
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

            // Cards animation
            gsap.fromTo(
                cardsRef.current?.children || [],
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.12,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 70%',
                        end: 'top 40%',
                        scrub: true,
                    },
                }
            );
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative z-[80] bg-dark py-[8vh] px-[6vw]"
        >
            {/* Header */}
            <div ref={headerRef} className="text-center mb-12">
                <div className="w-[min(34vw,320px)] amber-line mx-auto mb-6" />
                <h2 className="headline-lg text-white">KIND WORDS</h2>
            </div>

            {/* Testimonial Cards */}
            <div
                ref={cardsRef}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-6 card-hover"
                    >
                        <Quote className="w-8 h-8 text-amber mb-4" />
                        <p className="text-white/90 text-lg leading-relaxed mb-6">
                            "{testimonial.quote}"
                        </p>
                        <div>
                            <p className="text-white font-semibold">{testimonial.author}</p>
                            <p className="text-white/50 text-sm">{testimonial.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
