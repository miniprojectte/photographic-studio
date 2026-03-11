'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioEditorial() {
    const sectionRef = useRef(null);
    const leftImageRef = useRef(null);
    const topRightImageRef = useRef(null);
    const bottomRightImageRef = useRef(null);
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
                topRightImageRef.current,
                { x: '60vw', opacity: 0 },
                { x: 0, opacity: 1, ease: 'none' },
                0
            );

            scrollTl.fromTo(
                bottomRightImageRef.current,
                { x: '60vw', opacity: 0 },
                { x: 0, opacity: 1, ease: 'none' },
                0.06
            );

            scrollTl.fromTo(
                headlineRef.current,
                { x: '-10vw', opacity: 0 },
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
                { x: '-14vw', opacity: 0, ease: 'power2.in' },
                0.7
            );

            scrollTl.fromTo(
                topRightImageRef.current,
                { x: 0, opacity: 1 },
                { x: '18vw', opacity: 0, ease: 'power2.in' },
                0.7
            );

            scrollTl.fromTo(
                bottomRightImageRef.current,
                { x: 0, opacity: 1 },
                { x: '18vw', opacity: 0, ease: 'power2.in' },
                0.72
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

    return (
        <section
            ref={sectionRef}
            className="section-pinned z-50 flex items-center"
        >
            {/* Left Tall Image */}
            <div
                ref={leftImageRef}
                className="absolute left-[6vw] top-[14vh] w-[30vw] h-[74vh] image-frame"
            >
                <img
                    src="/editorial_tall_10.jpg"
                    alt="Fashion editorial portrait"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Top Right Image */}
            <div
                ref={topRightImageRef}
                className="absolute left-[40vw] top-[14vh] w-[54vw] h-[34vh] image-frame"
            >
                <img
                    src="/editorial_top_11.jpg"
                    alt="Brand lifestyle scene"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Bottom Right Image */}
            <div
                ref={bottomRightImageRef}
                className="absolute left-[40vw] top-[54vh] w-[54vw] h-[34vh] image-frame"
            >
                <img
                    src="/editorial_bottom_12.jpg"
                    alt="Team campaign scene"
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
                className="absolute left-[10vw] top-[56vh] w-[36vw]"
                style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
            >
                <h2 className="headline-lg text-white mb-4">EDITORIAL</h2>
                <p className="text-white/80 text-base leading-relaxed mb-6">
                    Campaign-ready imagery with a consistent, refined grade.
                </p>
                <button className="flex items-center gap-2 text-amber font-medium hover:gap-4 transition-all duration-300">
                    View brand work
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
}
