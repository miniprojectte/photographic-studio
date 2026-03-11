'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const packages = [
    {
        name: 'Portrait Session',
        price: 'From 450 RS',
        description: 'Perfect for individuals, couples, or small groups',
        features: [
            '1 hour session',
            '15 edited images',
            'Online gallery',
            '2 outfit changes',
        ],
        cta: 'Book',
        highlighted: false,
    },
    {
        name: 'Wedding Day',
        price: 'From 3,200 RS',
        description: 'Complete coverage for your special day',
        features: [
            'Full day coverage',
            '400+ edited images',
            'Engagement mini-session',
            'Online gallery & prints',
            'Second photographer',
        ],
        cta: 'Request date',
        highlighted: true,
    },
    {
        name: 'Brand Campaign',
        price: 'Custom',
        description: 'Tailored for businesses and brands',
        features: [
            'Half or full day',
            'Usage licensing included',
            'Fast 48hr turnaround',
            'Raw files available',
            'Art direction',
        ],
        cta: 'Get a quote',
        highlighted: false,
    },
];

export default function Pricing() {
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

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            ref={sectionRef}
            id="pricing"
            className="relative z-[80] bg-dark py-[8vh] px-[6vw]"
        >
            {/* Header */}
            <div ref={headerRef} className="text-center mb-12">
                <div className="w-[min(34vw,320px)] amber-line mx-auto mb-6" />
                <h2 className="headline-lg text-white mb-4">PACKAGES</h2>
                <p className="text-white/60 text-base max-w-lg mx-auto">
                    Simple options. Add-ons available for travel, albums, and extra hours.
                </p>
            </div>

            {/* Pricing Cards */}
            <div
                ref={cardsRef}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
                {packages.map((pkg, index) => (
                    <div
                        key={index}
                        className={`relative rounded-3xl p-6 card-hover ${pkg.highlighted
                                ? 'bg-white/[0.06] border-t-4 border-amber'
                                : 'bg-white/[0.04] border border-white/[0.08]'
                            }`}
                    >
                        {pkg.highlighted && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber text-dark text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                MOST POPULAR
                            </div>
                        )}

                        <h3 className="text-white font-display font-bold text-xl mb-2">
                            {pkg.name}
                        </h3>
                        <p className="text-amber font-display font-bold text-2xl mb-2">
                            {pkg.price}
                        </p>
                        <p className="text-white/50 text-sm mb-6">{pkg.description}</p>

                        <ul className="space-y-3 mb-8">
                            {pkg.features.map((feature, fIndex) => (
                                <li key={fIndex} className="flex items-center gap-3">
                                    <Check className="w-4 h-4 text-amber flex-shrink-0" />
                                    <span className="text-white/70 text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => scrollToSection('contact')}
                            className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${pkg.highlighted
                                    ? 'bg-amber text-dark hover:shadow-glow'
                                    : 'border border-white/30 text-white hover:border-amber hover:text-amber'
                                }`}
                        >
                            {pkg.cta}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
