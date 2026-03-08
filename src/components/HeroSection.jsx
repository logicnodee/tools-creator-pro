import { useEffect, useRef } from 'react'
import { ArrowRight, ArrowDown, Users, Wrench, Headphones } from 'lucide-react'

export default function HeroSection() {
    const heroRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in-up')
                    }
                })
            },
            { threshold: 0.1 }
        )

        const elements = heroRef.current?.querySelectorAll('.reveal')
        elements?.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16 pb-10 px-5"
        >
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-300/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="relative z-10 text-center max-w-xl mx-auto">
                {/* Main heading */}
                <h1
                    className="reveal opacity-0 text-3xl sm:text-5xl font-extrabold leading-tight mb-4"
                >
                    <span className="text-gray-900">Selamat Datang di</span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800 bg-clip-text text-transparent gradient-animate">
                        Tools Creator Pro
                    </span>
                </h1>

                {/* Subtitle */}
                <p
                    className="reveal opacity-0 text-gray-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-7"
                    style={{ animationDelay: '0.15s' }}
                >
                    Dapatkan akses premium ke berbagai tools digital terbaik dengan harga terjangkau. Tingkatkan produktivitas Anda sekarang!
                </p>

                {/* CTA Buttons */}
                <div
                    className="reveal opacity-0 flex gap-3 justify-center"
                    style={{ animationDelay: '0.3s' }}
                >
                    <a
                        href="#pricing"
                        className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 text-sm overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Lihat Paket
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 animate-shimmer" />
                    </a>

                    <a
                        href="#tools"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl border border-blue-200 hover:border-blue-400 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-300 text-sm"
                    >
                        <Wrench className="w-4 h-4" />
                        Pelajari Tools
                    </a>
                </div>

                {/* Stats */}
                <div
                    className="reveal opacity-0 mt-12 flex items-center justify-center gap-2 sm:gap-6 w-full max-w-2xl mx-auto px-1 sm:px-0"
                    style={{ animationDelay: '0.45s' }}
                >
                    {[
                        { value: '500+', label: 'Pengguna', icon: Users },
                        { value: '5+', label: 'Tools', icon: Wrench },
                        { value: '24/7', label: 'Support', icon: Headphones },
                    ].map((stat, i) => (
                        <div key={i} className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 py-3 px-1 sm:px-4 bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:border-blue-200 rounded-2xl sm:rounded-3xl transition-all hover:-translate-y-1 group">
                            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="text-[13px] sm:text-xl font-black text-gray-900 leading-tight mb-0.5">{stat.value}</div>
                                <div className="text-[8px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
