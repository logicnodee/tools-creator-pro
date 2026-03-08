import { useEffect, useRef, useState } from 'react'
import { Check, X, ArrowRight, MessageCircle, CircleDollarSign, Lock, Zap, HeadphonesIcon, ShieldCheck, Star } from 'lucide-react'

const packages = [
    {
        name: 'Starter',
        price: '29K',
        originalPrice: '50K',
        period: '/akun',
        color: 'from-blue-400 to-blue-600',
        shadow: 'shadow-blue-500/20',
        popular: false,
        features: [
            { name: 'Gemini Pro', included: true },
            { name: 'Google Flow', included: true },
            { name: 'Google Drive 300GB', included: true },
            { name: 'Canva Pro', included: false },
            { name: 'CapCut Pro', included: false },
        ],
        cta: 'Pilih Starter',
        whatsappMsg: 'Halo, saya ingin membeli paket Starter 29K (Gemini, Google Flow, Google Drive 300GB)',
    },
    {
        name: 'Professional',
        price: '39K',
        originalPrice: '80K',
        period: '/akun',
        color: 'from-blue-500 to-indigo-600',
        shadow: 'shadow-blue-600/30',
        popular: true,
        features: [
            { name: 'Gemini Pro', included: true },
            { name: 'Google Flow', included: true },
            { name: 'Google Drive 300GB', included: true },
            { name: 'Canva Pro', included: true },
            { name: 'CapCut Pro', included: false },
        ],
        cta: 'Pilih Professional',
        whatsappMsg: 'Halo, saya ingin membeli paket Professional 39K (Gemini, Google Flow, Google Drive 300GB, Canva Pro)',
    },
    {
        name: 'Ultimate',
        price: '69K',
        originalPrice: '120K',
        period: '/akun',
        color: 'from-indigo-500 to-purple-600',
        shadow: 'shadow-indigo-500/30',
        popular: false,
        features: [
            { name: 'Gemini Pro', included: true },
            { name: 'Google Flow', included: true },
            { name: 'Google Drive 300GB', included: true },
            { name: 'Canva Pro', included: true },
            { name: 'CapCut Pro', included: true },
        ],
        cta: 'Pilih Ultimate',
        whatsappMsg: 'Halo, saya ingin membeli paket Ultimate 69K (Gemini, Google Flow, Google Drive 300GB, Canva Pro, CapCut Pro)',
    },
]

function PricingCard({ pkg, index, onSelectPlan }) {
    const cardRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true)
            },
            { threshold: 0.15 }
        )
        if (cardRef.current) observer.observe(cardRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={cardRef}
            className={`relative rounded-3xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            {/* Popular badge */}
            {pkg.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="popular-badge flex items-center gap-1 sm:gap-1.5 px-2 sm:px-5 py-1 sm:py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[8px] sm:text-xs font-bold rounded-full shadow-lg shadow-blue-500/30 uppercase tracking-wider whitespace-nowrap">
                        <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" fill="white" />
                        Populer
                    </div>
                </div>
            )}

            <div
                className={`relative overflow-hidden rounded-xl sm:rounded-3xl border sm:border-2 transition-all duration-300 h-full
          ${pkg.popular
                        ? 'border-blue-400 bg-gradient-to-b from-blue-50/80 to-white shadow-2xl shadow-blue-500/15 scale-[1.02]'
                        : 'border-gray-100 bg-white shadow-lg hover:shadow-xl hover:border-blue-200'
                    }
        `}
            >
                {/* Top gradient */}
                <div className={`h-1 sm:h-1.5 w-full bg-gradient-to-r ${pkg.color}`} />

                <div className="p-2.5 sm:p-7">
                    {/* Package name */}
                    <div className="text-center mb-2 sm:mb-6">
                        <h3 className="text-[10px] sm:text-lg font-bold text-gray-800 mb-1 sm:mb-3">{pkg.name}</h3>

                        {/* Price */}

                        <div className="flex items-baseline justify-center gap-0.5 sm:gap-1">
                            <span className="text-[8px] sm:text-sm text-gray-400 font-medium">Rp</span>
                            <span className={`text-2xl sm:text-5xl font-black bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent`}>
                                {pkg.price}
                            </span>
                            <span className="text-[7px] sm:text-sm text-gray-400 font-medium">{pkg.period}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-2 sm:mb-6" />

                    {/* Features */}
                    <ul className="space-y-1.5 sm:space-y-3 mb-3 sm:mb-8">
                        {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-1.5 sm:gap-3">
                                {feature.included ? (
                                    <div className="w-3.5 h-3.5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <Check className="w-2 h-2 sm:w-3.5 sm:h-3.5 text-white" strokeWidth={3} />
                                    </div>
                                ) : (
                                    <div className="w-3.5 h-3.5 sm:w-6 sm:h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <X className="w-2 h-2 sm:w-3.5 sm:h-3.5 text-gray-300" strokeWidth={3} />
                                    </div>
                                )}
                                <span
                                    className={`text-[9px] sm:text-sm font-medium ${feature.included ? 'text-gray-700' : 'text-gray-300'
                                        }`}
                                >
                                    {feature.name}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <button
                        onClick={() => onSelectPlan(pkg)}
                        className={`group w-full flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-4 rounded-lg sm:rounded-2xl font-bold text-[9px] sm:text-base transition-all duration-300 outline-none
              ${pkg.popular
                                ? `bg-gradient-to-r ${pkg.color} text-white shadow-xl ${pkg.shadow} hover:shadow-2xl hover:scale-[1.02] animate-pulse-glow`
                                : 'bg-gray-50 text-gray-700 border sm:border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'
                            }
            `}
                    >
                        <MessageCircle className="w-3 h-3 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">{pkg.cta}</span>
                        <span className="sm:hidden">Pilih</span>
                        <ArrowRight className="w-2.5 h-2.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function PricingSection({ onSelectPlan }) {
    const sectionRef = useRef(null)
    const [headerVisible, setHeaderVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setHeaderVisible(true)
            },
            { threshold: 0.1 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section id="pricing" className="relative py-20 px-4" ref={sectionRef}>
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 pointer-events-none" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Section header */}
                <div className={`text-center mb-14 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                        Pilih Paket{' '}
                        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                            Terbaik Anda
                        </span>
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">
                        Semua paket sudah termasuk akses premium. Pilih yang sesuai dengan kebutuhan Anda.
                    </p>
                </div>

                {/* Pricing cards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-5 mx-auto items-start">
                    {packages.map((pkg, index) => (
                        <PricingCard key={pkg.name} pkg={pkg} index={index} onSelectPlan={onSelectPlan} />
                    ))}
                </div>

                {/* Trust badges */}
                <div className={`mt-14 text-center transition-all duration-700 delay-300 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <div className="flex items-center justify-between w-full gap-1 sm:gap-10 px-1 sm:px-0">
                        {[
                            { icon: Lock, text: 'Pembayaran Aman' },
                            { icon: Zap, text: 'Aktivasi Instan' },
                            { icon: HeadphonesIcon, text: 'Support 24/7' },
                            { icon: ShieldCheck, text: 'Garansi 100%' },
                        ].map((badge, i) => (
                            <div key={i} className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center text-gray-500">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                    <badge.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                                </div>
                                <span className="text-[8px] sm:text-sm font-semibold whitespace-nowrap">{badge.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
