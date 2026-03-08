import { useState, useEffect } from 'react'
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Login() {
    const [isLoginView, setIsLoginView] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        // Check if already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                navigate('/admin')
            }
        })
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            const cleanEmail = email.trim()

            if (isLoginView) {
                // Login Flow
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: cleanEmail,
                    password,
                })
                if (error) {
                    if (error.message.includes('Invalid login credentials')) {
                        throw new Error('Email atau Password salah. Pastikan akun sudah terdaftar dan terverifikasi.')
                    }
                    if (error.message.includes('Email not confirmed')) {
                        throw new Error('Email belum dikonfirmasi! Matikan setting "Confirm Email" di Supabase lalu daftar ulang.')
                    }
                    throw error
                }
                if (data.user) {
                    navigate('/admin')
                }
            } else {
                // Register Flow
                const { data, error } = await supabase.auth.signUp({
                    email: cleanEmail,
                    password,
                })
                if (error) throw error
                setSuccessMessage('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.')
            }
        } catch (err) {
            setError(err.message || 'Terjadi kesalahan saat memproses permintaan Anda.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white py-8 px-4 shadow-2xl shadow-blue-500/10 sm:rounded-3xl sm:px-10 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {isLoginView ? 'Admin Login' : 'Registrasi Admin'}
                        </h2>
                        <p className="text-gray-500 text-sm px-4">
                            {isLoginView
                                ? 'Autentikasi khusus untuk staf pengelola ToolsPro.'
                                : 'Pendaftaran akun rahasia khusus pengelola sistem.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start">
                            <span className="font-semibold block">{error}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider text-[10px]">Email Admin</label>
                            <div className="relative mt-1 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border-transparent rounded-xl text-sm focus:border-transparent focus:ring-0 outline-none"
                                    placeholder="admin@toolspro.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider text-[10px]">Password</label>
                            <div className="relative mt-1 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border-transparent rounded-xl text-sm focus:border-transparent focus:ring-0 outline-none"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3.5 px-4 mt-8 border border-transparent rounded-xl shadow-lg shadow-blue-500/25 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Memproses...</>
                            ) : (
                                <>{isLoginView ? 'Masuk ke Dasbor' : 'Daftar Sekarang'}</>
                            )}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}
