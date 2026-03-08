import { useState, useEffect } from 'react'
import { ShoppingCart, LogOut, ReceiptText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Navbar({ user, onOpenDashboard }) {
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-blue-500/5 py-2.5'
                : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <span onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
                    <img
                        src="/images/icon.webp"
                        alt="Logo ToolsPro"
                        className="w-8 h-8 object-contain cursor-pointer"
                        onDoubleClick={() => navigate('/login')} // Admin trapdoor
                    />
                </span>

                {/* CTA & Dashboard */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Admin Logged in indicators */}
                    {user && (
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded">Admin: {user.email?.split('@')[0]}</div>
                            <button
                                onClick={() => supabase.auth.signOut()}
                                className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg text-xs font-semibold transition-all duration-300 border border-transparent hover:border-red-100"
                                title="Keluar"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Keluar</span>
                            </button>
                        </div>
                    )}

                    <button
                        onClick={onOpenDashboard}
                        className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                        title="Cek Status Pembayaran Anda"
                    >
                        <ReceiptText className="w-4 h-4 text-blue-500" />
                        <span>Cek Invoice</span>
                    </button>
                    <button
                        onClick={onOpenDashboard}
                        className="sm:hidden w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200"
                        title="Cek Invoice"
                    >
                        <ReceiptText className="w-4 h-4 text-blue-600" />
                    </button>

                    <div className="w-px h-6 bg-gray-200 hidden sm:block" />

                    <a
                        href="#pricing"
                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs font-semibold rounded-full shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Beli Sekarang
                    </a>
                </div>
            </div>
        </nav>
    )
}
