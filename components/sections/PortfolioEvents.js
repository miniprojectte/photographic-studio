'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioEvents() {
    const sectionRef = useRef(null);
    const leftImageRef = useRef(null);
    const rightImageRef = useRef(null);
    const headlineRef = useRef(null);
    const lineRef = useRef(null);

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
                leftImageRef.current,
                { x: '-60vw', opacity: 0 },
                { x: 0, opacity: 1, ease: 'none' },
                0
            );

            scrollTl.fromTo(
                rightImageRef.current,
                { x: '60vw', opacity: 0 },
                { x: 0, opacity: 1, ease: 'none' },
                0
            );

            scrollTl.fromTo(
                headlineRef.current,
                { x: '18vw', opacity: 0 },
                { x: 0, opacity: 1, ease: 'none' },
                0.12
            );

            scrollTl.fromTo(
                lineRef.current,
                { scaleX: 0 },
                { scaleX: 1, transformOrigin: 'left', ease: 'none' },
                0.08
            );

            // EXIT (70-100%)
            scrollTl.fromTo(
                leftImageRef.current,
                { x: 0, opacity: 1 },
                { x: '-18vw', opacity: 0, ease: 'power2.in' },
                0.7
            );

            scrollTl.fromTo(
                rightImageRef.current,
                { x: 0, opacity: 1 },
                { x: '18vw', opacity: 0, ease: 'power2.in' },
                0.7
            );

            scrollTl.fromTo(
                headlineRef.current,
                { y: 0, opacity: 1 },
                { y: 12, opacity: 0, ease: 'power2.in' },
                0.7
            );

            scrollTl.fromTo(
                lineRef.current,
                { scaleX: 1 },
                { scaleX: 0, transformOrigin: 'left', ease: 'power2.in' },
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
            className="section-pinned z-[60] flex items-center"
        >
            {/* Left Large Image */}
            <div
                ref={leftImageRef}
                className="absolute left-[6vw] top-[1vh] w-[44vw] h-[74vh] image-frame"
            >
                <img
                    src="/events_left_13.jpg"
                    alt="Event celebration moment"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Amber Line */}
            <div
                ref={lineRef}
                className="absolute left-[6vw] top-[90vh] w-[34vw] amber-line"
            />

            {/* Headline Block */}
            <div
                ref={headlineRef}
                className="absolute left-[58vw] top-[56vh] w-[34vw]"
                style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
            >
                <h2 className="headline-lg text-white mb-4">EVENTS</h2>
                <p className="text-white/80 text-base leading-relaxed mb-6">
                    Speeches, celebrations, and the moments in between—captured discreetly.
                </p>
                <button
                    onClick={() => scrollToSection('contact')}
                    className="flex items-center gap-2 text-amber font-medium hover:gap-4 transition-all duration-300"
                >
                    Plan event coverage
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
}
