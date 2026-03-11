'use client';

import { useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const sectionRef = useRef(null);
    const collageRef = useRef(null);
    const imageARef = useRef(null);
    const imageBRef = useRef(null);
    const imageCRef = useRef(null);
    const lineRef = useRef(null);
    const textRef = useRef(null);

    // Auto-play entrance animation on load
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

            // Collage wrap entrance
            tl.fromTo(
                collageRef.current,
                { opacity: 0, scale: 0.96, y: 18 },
                { opacity: 1, scale: 1, y: 0, duration: 0.8 },
                0
            );

            // Images entrance with stagger
            tl.fromTo(
                [imageARef.current, imageBRef.current, imageCRef.current],
                { opacity: 0, x: -40, rotate: -1 },
                { opacity: 1, x: 0, rotate: 0, duration: 0.7, stagger: 0.08 },
                0.1
            );

            // Amber line entrance
            tl.fromTo(
                lineRef.current,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.8, transformOrigin: 'left' },
                0.3
            );

            // Text block entrance
            tl.fromTo(
                textRef.current?.children || [],
                { opacity: 0, x: 60 },
                { opacity: 1, x: 0, duration: 0.6, stagger: 0.06 },
                0.2
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Scroll-driven exit animation
    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=120%',
                    pin: true,
                    scrub: 0.6,
                    onLeaveBack: () => {
                        // Reset to visible when scrolling back to top
                        gsap.set(collageRef.current, { x: 0, opacity: 1 });
                        gsap.set(textRef.current, { x: 0, opacity: 1 });
                        gsap.set(lineRef.current, { scaleX: 1 });
                    },
                },
            });

            // ENTRANCE (0-30%): Hold at fully visible (already animated on load)
            // SETTLE (30-70%): Static

            // EXIT (70-100%)
            scrollTl.fromTo(
                collageRef.current,
                { x: 0, opacity: 1 },
                { x: '-18vw', opacity: 0, ease: 'power2.in' },
                0.7
            );

            scrollTl.fromTo(
                textRef.current,
                { x: 0, opacity: 1 },
                { x: '10vw', opacity: 0, ease: 'power2.in' },
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
            id="hero"
            className="section-pinned z-10 flex items-center"
        >
            {/* Collage Container */}
            <div
                ref={collageRef}
                className="absolute left-[6vw] top-[18vh] w-[52vw] h-[64vh]"
            >
                {/* Image A - Top Left */}
                <div
                    ref={imageARef}
                    className="absolute left-0 top-0 w-[58%] h-[46%] image-frame"
                >
                    <img
                        src="/hero_couple_01.jpg"
                        alt="Wedding couple portrait"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Image B - Bottom Left */}
                <div
                    ref={imageBRef}
                    className="absolute left-0 top-[10%] w-[58%] h-[46%] image-frame"
                >
                    <img
                        src="/hero_detail_02.jpg"
                        alt="Wedding detail shot"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Image C - Right Tall */}
                <div
                    ref={imageCRef}
                    className="absolute left-[62%] top-[-91%] w-[38%] h-full image-frame"
                >
                    <img
                        src="/hero_scene_03.jpg"
                        alt="Wedding scene"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Amber Line */}
            <div
                ref={lineRef}
                className="absolute left-[6vw] top-[86vh] w-[34vw] amber-line"
            />

            {/* Text Block */}
            <div
                ref={textRef}
                className="absolute left-[62vw] top-[30vh] w-[32vw]"
            >
                <span className="label-small block mb-4">NM STUDIOS</span>
                <h1 className="headline-xl text-white mb-2">
                    TIMELESS
                </h1>
                <h1 className="headline-xl text-white mb-6">
                    STORIES
                </h1>
                <p className="text-white/70 text-base leading-relaxed mb-8 max-w-[28vw]">
                    Wedding, portrait & editorial photography—crafted with calm and intention.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => scrollToSection('portfolio')}
                        className="btn-primary"
                    >
                        View selected work
                    </button>
                    <button
                        onClick={() => scrollToSection('contact')}
                        className="btn-secondary"
                    >
                        Request a date
                    </button>
                </div>
            </div>
        </section>
    );
}
