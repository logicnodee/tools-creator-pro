import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Package } from 'lucide-react'

const tools = [
    {
        name: 'Canva',
        iconImg: '/images/canva-logo.png',
        color: 'from-teal-500 to-cyan-600',
        lightBg: 'bg-teal-50',
        lightBorder: 'border-teal-100',
        iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-600',
        description:
            'Canva adalah platform desain grafis online yang memudahkan siapa saja untuk membuat desain tanpa perlu keahlian profesional.',
        details: [
            {
                label: 'Fungsi',
                text: 'Membuat poster, presentasi, logo, hingga konten media sosial menggunakan sistem drag-and-drop.',
            },
            {
                label: 'Kelebihan',
                text: 'Menyediakan ribuan elemen visual dan template gratis yang siap pakai.',
            },
        ],
    },
    {
        name: 'Gemini Pro',
        iconImg: '/images/gemini-logo.png',
        color: 'from-blue-500 to-indigo-600',
        lightBg: 'bg-blue-50',
        lightBorder: 'border-blue-100',
        iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        description:
            'Gemini Pro adalah model kecerdasan buatan (AI) tingkat menengah dari Google yang dirancang untuk menangani berbagai tugas kompleks secara efisien.',
        details: [
            {
                label: 'Fungsi',
                text: 'Memahami teks, kode, gambar, dan video secara bersamaan (multimodal).',
            },
            {
                label: 'Kelebihan',
                text: 'Sangat cepat dan mampu melakukan penalaran yang lebih baik dibandingkan model dasar, sering digunakan dalam integrasi aplikasi melalui API.',
            },
        ],
    },
    {
        name: 'Google Flow',
        subtitle: '(Labs.google/flow)',
        iconImg: '/images/dataflow-logo.png',
        color: 'from-gray-800 to-black',
        lightBg: 'bg-gray-50',
        lightBorder: 'border-gray-200',
        iconBg: 'bg-gradient-to-br from-gray-800 to-black',
        description:
            'Google Flow adalah sarana bereksperimen dari Google yang dirancang untuk AI generasi video, kreativitas, dan bercerita yang interaktif.',
        details: [
            {
                label: 'Fungsi',
                text: 'Membuat video dengan kualitas tinggi, animasi, dan storytelling hanya dengan prompt teks atau gambar (AI Video Generation).',
            },
            {
                label: 'Kegunaan',
                text: 'Membantu konten kreator, sutradara, dan marketer untuk menciptakan visual yang sangat nyata dalam hitungan menit.',
            },
        ],
    },
    {
        name: 'Google Drive',
        iconImg: '/images/drive-logo.png',
        color: 'from-green-500 to-teal-600',
        lightBg: 'bg-green-50',
        lightBorder: 'border-green-100',
        iconBg: 'bg-gradient-to-br from-green-500 to-teal-600',
        description:
            'Google Drive adalah layanan penyimpanan berbasis awan (cloud storage) milik Google.',
        details: [
            {
                label: 'Fungsi',
                text: 'Menyimpan, berbagi, dan mengakses file di mana saja selama ada koneksi internet.',
            },
            {
                label: 'Integrasi',
                text: 'Terhubung langsung dengan Google Docs, Sheets, dan Slides, sehingga memudahkan kolaborasi dokumen secara real-time.',
            },
        ],
    },
    {
        name: 'CapCut',
        iconImg: '/images/capcut-logo.png',
        color: 'from-purple-500 to-pink-600',
        lightBg: 'bg-purple-50',
        lightBorder: 'border-purple-100',
        iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
        description:
            'CapCut adalah aplikasi penyuntingan video yang dikembangkan oleh ByteDance (perusahaan yang sama dengan TikTok).',
        details: [
            {
                label: 'Fungsi',
                text: 'Mengedit video dengan cepat menggunakan berbagai template, filter, transisi, dan musik yang sedang tren.',
            },
            {
                label: 'Kelebihan',
                text: 'Antarmukanya sangat ramah pengguna, populer untuk pembuatan konten media sosial (Reels, TikTok) baik di HP maupun PC.',
            },
        ],
    },
]

function ToolCard({ tool, index }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const cardRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.15 }
        )

        if (cardRef.current) observer.observe(cardRef.current)
        return () => observer.disconnect()
    }, [])



    return (
        <div
            ref={cardRef}
            className={`group relative overflow-hidden rounded-3xl border transition-all duration-500 cursor-pointer
        ${isExpanded ? `${tool.lightBg} ${tool.lightBorder} shadow-xl` : 'bg-white border-gray-100 shadow-md hover:shadow-xl'}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
            style={{ transitionDelay: `${index * 100}ms` }}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Top gradient line */}
            <div className={`h-1 w-full bg-gradient-to-r ${tool.color}`} />

            <div className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden border border-gray-100">
                        <img src={tool.iconImg} alt={tool.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                    {tool.name}
                                </h3>
                                {tool.subtitle && (
                                    <span className="text-sm text-gray-400 font-medium">{tool.subtitle}</span>
                                )}
                            </div>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-2
                  ${isExpanded ? 'bg-blue-500 text-white rotate-180' : 'bg-gray-100 text-gray-400'}
                `}
                            >
                                <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                            {tool.description}
                        </p>
                    </div>
                </div>

                {/* Expandable details */}
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 mt-5 opacity-100' : 'max-h-0 mt-0 opacity-0'
                        }`}
                >
                    <div className="space-y-3 pl-[4.5rem]">
                        {tool.details.map((detail, i) => (
                            <div
                                key={i}
                                className="bg-white/80 rounded-xl p-4 border border-gray-100/50"
                            >
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${tool.color} text-white mb-2`}>
                                    {detail.label}
                                </span>
                                <p className="text-sm text-gray-600 leading-relaxed">{detail.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ToolsSection() {
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
        <section id="tools" className="relative py-20 px-4" ref={sectionRef}>
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-0 w-64 h-64 bg-indigo-100/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
                {/* Section header */}
                <div className={`text-center mb-12 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                        Tools yang{' '}
                        <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                            Kami Sediakan
                        </span>
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">
                        Koleksi tools premium terbaik untuk meningkatkan produktivitas dan kreativitas Anda
                    </p>
                </div>

                {/* Tools list */}
                <div className="space-y-4">
                    {tools.map((tool, index) => (
                        <ToolCard key={tool.name} tool={tool} index={index} />
                    ))}
                </div>
            </div>
        </section >
    )
}
