'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
    const sectionRef = useRef(null);
    const leftImageRef = useRef(null);
    const centerImageRef = useRef(null);
    const rightImageRef = useRef(null);
    const lineRef = useRef(null);
    const headlineRef = useRef(null);
    const bodyRef = useRef(null);

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
                { x: '-40vw', opacity: 0 },
                { x: 0, opacity: 1, ease: 'none' },
                0
            );

            scrollTl.fromTo(
                centerImageRef.current,
                { y: '-30vh', opacity: 0 },
                { y: 0, opacity: 1, ease: 'none' },
                0
            );

            scrollTl.fromTo(
                rightImageRef.current,
                { x: '40vw', opacity: 0 },
                { x: 0, opacity: 1, ease: 'none' },
                0
            );

            scrollTl.fromTo(
                lineRef.current,
                { scaleX: 0 },
                { scaleX: 1, transformOrigin: 'center', ease: 'none' },
                0.08
            );

            scrollTl.fromTo(
                headlineRef.current,
                { y: '18vh', opacity: 0 },
                { y: 0, opacity: 1, ease: 'none' },
                0.12
            );

            scrollTl.fromTo(
                bodyRef.current,
                { y: '12vh', opacity: 0 },
                { y: 0, opacity: 1, ease: 'none' },
                0.15
            );

            // EXIT (70-100%)
            scrollTl.fromTo(
                [leftImageRef.current, centerImageRef.current, rightImageRef.current],
                { opacity: 1, y: 0 },
                { opacity: 0, y: -10, stagger: 0.01, ease: 'power2.in' },
                0.7
            );

            scrollTl.fromTo(
                lineRef.current,
                { scaleX: 1 },
                { scaleX: 0, transformOrigin: 'center', ease: 'power2.in' },
                0.75
            );

            scrollTl.fromTo(
                headlineRef.current,
                { y: 0, opacity: 1 },
                { y: 12, opacity: 0, ease: 'power2.in' },
                0.7
            );

            scrollTl.fromTo(
                bodyRef.current,
                { y: 0, opacity: 1 },
                { y: 10, opacity: 0, ease: 'power2.in' },
                0.72
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
            className="section-pinned z-[70] flex items-center"
        >
            {/* Left Image */}
            <div
                ref={leftImageRef}
                className="absolute left-[6vw] top-[-20%] w-[26vw] h-[40vh] image-frame"
            >
                <img
                    src="/process_01.jpg"
                    alt="Planning session"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Center Image */}
            <div
                ref={centerImageRef}
                className="absolute left-[37vw] top-[-20%] w-[26vw] h-[40vh] image-frame"
            >
                <img
                    src="/process_02.jpg"
                    alt="Photography session"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right Image */}
            <div
                ref={rightImageRef}
                className="absolute left-[68vw] top-[14vh] w-[26vw] h-[40vh] image-frame"
            >
                <img
                    src="/process_03.jpg"
                    alt="Post-production editing"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Amber Line - Centered */}
            <div
                ref={lineRef}
                className="absolute left-[33vw] top-[58vh] w-[34vw] amber-line"
            />

            {/* Headline */}
            <div
                ref={headlineRef}
                className="absolute left-[33vw] top-[64vh] w-[34vw] text-center"
            >
                <h2 className="headline-lg text-white">HOW WE WORK</h2>
            </div>

            {/* Body + Steps */}
            <div
                ref={bodyRef}
                className="absolute left-[28vw] top-[76vh] w-[44vw] text-center"
            >
                <p className="text-white/70 text-base leading-relaxed mb-6">
                    A calm process designed to protect your time—and your photos.
                </p>
                <div className="flex justify-center gap-8 mb-6">
                    <span className="text-white/60 text-sm">
                        <span className="text-amber font-semibold">1)</span> Book a call
                    </span>
                    <span className="text-white/60 text-sm">
                        <span className="text-amber font-semibold">2)</span> Shoot with direction
                    </span>
                    <span className="text-white/60 text-sm">
                        <span className="text-amber font-semibold">3)</span> Receive refined edits
                    </span>
                </div>
                <button
                    onClick={() => scrollToSection('contact')}
                    className="btn-primary"
                >
                    Book a call
                </button>
            </div>
        </section>
    );
}
