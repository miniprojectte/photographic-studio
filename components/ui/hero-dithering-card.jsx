'use client';

import { ArrowRight, Sparkles } from "lucide-react"
import { useState, Suspense, lazy } from "react"

const Dithering = lazy(() =>
    import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
)

export function HeroDitheringCard() {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <section className="min-h-screen w-full flex justify-center items-center px-4 md:px-6 pt-24 pb-12">
            <div
                className="w-full max-w-7xl relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative overflow-hidden rounded-[48px] border border-white/10 bg-[#161616] shadow-2xl shadow-black/50 min-h-[600px] md:min-h-[700px] flex flex-col items-center justify-center duration-500">
                    <Suspense fallback={<div className="absolute inset-0 bg-[#161616]" />}>
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen">
                            <Dithering
                                colorBack="#00000000" // Transparent
                                colorFront="#C45D3E"  // Mn Studio Accent Orange
                                shape="warp"
                                type="4x4"
                                speed={isHovered ? 0.6 : 0.2}
                                className="size-full"
                                minPixelRatio={1}
                            />
                        </div>
                    </Suspense>

                    <div className="relative z-10 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">

                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#C45D3E]/20 bg-[#C45D3E]/10 px-4 py-1.5 text-sm font-medium text-[#C45D3E] backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C45D3E] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C45D3E]"></span>
                            </span>
                            MN Studio Photography
                        </div>

                        {/* Headline */}
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-8 leading-[1.05]">
                            Your moments, <br />
                            <span className="text-white/80">captured perfectly.</span>
                        </h1>

                        {/* Description */}
                        <p className="text-white/60 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
                            Join 500+ happy clients using the only photography studio that truly understands the nuance of your vision.
                            Clean, artistic, and uniquely yours.
                        </p>

                        {/* Button */}
                        <a href="/booking" className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] px-12 text-base font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-[#C45D3E]/25">
                            <span className="relative z-10">Book Your Session</span>
                            <ArrowRight className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
