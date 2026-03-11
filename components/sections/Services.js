'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, User, Briefcase, PartyPopper } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
    { icon: Heart, text: 'Weddings & elopements' },
    { icon: User, text: 'Portraits & headshots' },
    { icon: Briefcase, text: 'Editorial & brand campaigns' },
    { icon: PartyPopper, text: 'Events & celebrations' },
];

export default function Services() {
    const sectionRef = useRef(null);
    const imageRef = useRef(null);
    const lineRef = useRef(null);
    const headlineRef = useRef(null);
    const listRef = useRef(null);
    const ctaRef = useRef(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=130%',
                    pin: true,
                    scrub: 0.6,
                },
            });

            // ENTRANCE (0-30%)
            scrollTl.fromTo(
                imageRef.current,
                { x: '-60vw', opacity: 0 },
                { x: 0, opacity: 1, ease: 'none' },
                0
            );

            scrollTl.fromTo(
                lineRef.current,
                { scaleX: 0 },
                { scaleX: 1, transformOrigin: 'left', ease: 'none' },
                0.05
            );

            scrollTl.fromTo(
                headlineRef.current,
                { x: '18vw', opacity: 0 },
                { x: 0, opacity: 1, ease: 'none' },
                0.1
            );

            scrollTl.fromTo(
                listRef.current?.children || [],
                { x: '10vw', opacity: 0 },
                { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
                0.12
            );

            scrollTl.fromTo(
                ctaRef.current,
                { y: 20, opacity: 0, scale: 0.98 },
                { y: 0, opacity: 1, scale: 1, ease: 'none' },
                0.18
            );

            // SETTLE (30-70%): Elements hold position

            // EXIT (70-100%)
            scrollTl.fromTo(
                imageRef.current,
                { x: 0, opacity: 1 },
                { x: '-18vw', opacity: 0, ease: 'power2.in' },
                0.7
            );

            scrollTl.fromTo(
                lineRef.current,
                { scaleX: 1 },
                { scaleX: 0, transformOrigin: 'left', ease: 'power2.in' },
                0.7
            );

            scrollTl.fromTo(
                headlineRef.current,
                { x: 0, opacity: 1 },
                { x: '10vw', opacity: 0, ease: 'power2.in' },
                0.7
            );

            scrollTl.fromTo(
                listRef.current?.children || [],
                { y: 0, opacity: 1 },
                { y: -10, opacity: 0, stagger: 0.01, ease: 'power2.in' },
                0.72
            );

            scrollTl.fromTo(
                ctaRef.current,
                { y: 0, opacity: 1 },
                { y: 12, opacity: 0, ease: 'power2.in' },
                0.75
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
            id="services"
            className="section-pinned z-20 flex items-center"
        >
            {/* Left Image */}
            <div
                ref={imageRef}
                className="absolute left-[6vw] top-[16vh] w-[44vw] h-[68vh] image-frame"
            >
                <img
                    src="/services_portrait_04.jpg"
                    alt="Portrait photography"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Amber Line */}
            <div
                ref={lineRef}
                className="absolute left-[54vw] top-[16vh] w-[34vw] amber-line"
            />

            {/* Headline */}
            <div
                ref={headlineRef}
                className="absolute left-[54vw] top-[22vh] w-[38vw]"
            >
                <h2 className="headline-lg text-white mb-4">WHAT WE DO</h2>
                <p className="text-white/70 text-base leading-relaxed">
                    We photograph people at their most real—then refine every frame so it feels effortless.
                </p>
            </div>

            {/* Services List */}
            <div
                ref={listRef}
                className="absolute left-[54vw] top-[42vh] w-[38vw] space-y-5"
            >
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 group"
                    >
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-amber group-hover:bg-amber/10 transition-all duration-300">
                            <service.icon className="w-5 h-5 text-white/70 group-hover:text-amber transition-colors" />
                        </div>
                        <span className="text-white/90 text-lg font-medium">
                            {service.text}
                        </span>
                    </div>
                ))}
            </div>

            {/* CTA Button */}
            <button
                ref={ctaRef}
                onClick={() => scrollToSection('pricing')}
                className="absolute left-[54vw] top-[74vh] btn-primary"
            >
                See packages
            </button>
        </section>
    );
}
