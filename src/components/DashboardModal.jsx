import { useState, useEffect } from 'react'
import { X, Clock, CheckCircle2, XCircle, Receipt, Loader2, Search, Key } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function DashboardModal({ isOpen, onClose, initialSearchQuery = '' }) {
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [hasSearched, setHasSearched] = useState(false)

    // Reset status ketika modal dibuka/ditutup
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('')
            setInvoices([])
            setHasSearched(false)
            setError(null)
        }
    }, [isOpen])

    // Auto-search jika dibuka dari tombol Cek Status invoice
    useEffect(() => {
        if (isOpen && initialSearchQuery) {
            setSearchQuery(initialSearchQuery)
            doSearch(initialSearchQuery)
        }
    }, [isOpen, initialSearchQuery])

    const doSearch = async (query) => {
        const q = query || searchQuery
        if (!q.trim()) {
            setError('Silakan masukkan Email, No WhatsApp, atau No Invoice.')
            return
        }

        setLoading(true)
        setError(null)
        setHasSearched(true)
        setInvoices([])

        try {
            const { data, error } = await supabase
                .from('pembayaran')
                .select('*')
                .or(`email.eq.${q},no_wa.eq.${q},invoice_id.eq.${q}`)
                .order('created_at', { ascending: false })

            if (error) throw error
            setInvoices(data || [])
        } catch (err) {
            console.error('Error fetching invoices:', err)
            setError('Gagal memuat data riwayat transaksi.')
        } finally {
            setLoading(false)
        }
    }

    const fetchInvoices = async (e) => {
        e.preventDefault()
        doSearch()
    }

    if (!isOpen) return null

    const getStatusBadge = (status) => {
        const currentStatus = status || 'pending'

        switch (currentStatus.toLowerCase()) {
            case 'lunas':
            case 'sukses':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SUKSES
                    </span>
                )
            case 'batal':
            case 'ditolak':
            case 'gagal':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        <XCircle className="w-3.5 h-3.5" /> BATAL
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5" /> PENDING
                    </span>
                )
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full h-[100dvh] sm:h-[100dvh] bg-white shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">

                {/* Header Container */}
                <div className="bg-white border-b border-gray-100 sticky top-0 z-10 flex flex-col">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                                <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-xl font-bold text-gray-900">Cek Status Pembayaran</h3>
                                <p className="text-[10px] sm:text-xs text-gray-500">Lacak riwayat transaksi / pesanan Anda</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Search Form inside Header so it stays put */}
                    <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 bg-gradient-to-b from-white to-gray-50/50">
                        <form onSubmit={fetchInvoices} className="flex gap-2 sm:gap-3">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors outline-none shadow-sm"
                                    placeholder="Email, No WA, atau No Invoice..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !searchQuery.trim()}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cari Data'}
                            </button>
                        </form>
                        {error && <p className="text-xs text-red-500 mt-2 ml-1">{error}</p>}
                    </div>
                </div>

                {/* Main Content Area (Scrollable) */}
                <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar bg-gray-50/50 flex-1">
                    {!hasSearched && !loading ? (
                        <div className="text-center py-10 sm:py-16">
                            <Receipt className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Cek Riwayat Pesanan Anda</h4>
                            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                                Masukkan alamat email, nomor WhatsApp, atau nomor invoice (misal: INV-110536) untuk melacak status pesanan Tools Anda.
                            </p>
                        </div>
                    ) : loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                            <p className="text-sm text-gray-500">Mencari data transaksi ...</p>
                        </div>
                    ) : invoices.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="text-base font-bold text-gray-900 mb-1">Data Tidak Ditemukan</h4>
                            <p className="text-xs sm:text-sm text-gray-500 max-w-xs mx-auto">
                                Tidak ada transaksi yang cocok dengan "{searchQuery}". Pastikan Email atau No WhatsApp sudah benar.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {invoices.map((invoice) => (
                                <div key={invoice.id} className="bg-white text-left border border-gray-200 rounded-2xl p-3.5 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                                    {/* Header: Nama Paket + Status + Tanggal */}
                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h4 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">{invoice.paket_pilihan || 'Paket Tools'}</h4>
                                                {getStatusBadge(invoice.status)}
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-gray-400 font-mono">
                                                INV-{invoice.id.split('-')[0].toUpperCase()} • {new Date(invoice.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="h-px w-full bg-gray-100 my-3" />

                                    {/* Info Grid: Pemesan + Metode + Tipe */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                                        <div className="col-span-2 sm:col-span-1">
                                            <p className="text-gray-400 mb-0.5 text-[10px] uppercase font-bold tracking-wider">Pemesan</p>
                                            <p className="font-semibold text-gray-900 text-sm">{invoice.nama}</p>
                                            <p className="text-gray-500 text-xs truncate">{invoice.email}</p>
                                            <p className="text-gray-500 text-xs">{invoice.no_wa}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 mb-0.5 text-[10px] uppercase font-bold tracking-wider">Pembayaran</p>
                                            <p className="font-semibold text-gray-900 text-xs sm:text-sm">{invoice.metode_pembayaran || 'Transfer Manual'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 mb-0.5 text-[10px] uppercase font-bold tracking-wider">Tipe Layanan</p>
                                            <p className="font-black text-xs sm:text-sm text-blue-600">Akses Premium</p>
                                        </div>
                                    </div>

                                    {(invoice.akses_gemini || invoice.akses_canva || invoice.akses_capcut) && (
                                        <div className="mt-4 bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 sm:p-4">
                                            <h5 className="text-xs sm:text-sm font-bold text-indigo-900 mb-2.5 flex items-center gap-2">
                                                <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 shrink-0" /> Kredensial Akses Premium Anda
                                            </h5>
                                            <div className="space-y-2.5">
                                                {invoice.akses_gemini && (
                                                    <div className="bg-white border text-left border-indigo-50 rounded-lg p-2.5 sm:p-3">
                                                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">Gemini / Flow / Drive</span>
                                                        <p className="text-gray-800 text-xs sm:text-sm whitespace-pre-wrap font-mono break-all">{invoice.akses_gemini}</p>
                                                    </div>
                                                )}
                                                {invoice.akses_canva && (
                                                    <div className="bg-white border text-left border-indigo-50 rounded-lg p-2.5 sm:p-3">
                                                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">Akses Canva</span>
                                                        <p className="text-gray-800 text-xs sm:text-sm whitespace-pre-wrap font-mono break-all">{invoice.akses_canva}</p>
                                                    </div>
                                                )}
                                                {invoice.akses_capcut && (
                                                    <div className="bg-white border text-left border-indigo-50 rounded-lg p-2.5 sm:p-3">
                                                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">Akses CapCut</span>
                                                        <p className="text-gray-800 text-xs sm:text-sm whitespace-pre-wrap font-mono break-all">{invoice.akses_capcut}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}


                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-[10px] sm:text-xs text-gray-500 border border-gray-200 px-2 py-1.5 rounded-md bg-gray-50">
                                            {invoice.status?.toLowerCase() === 'lunas' || invoice.status?.toLowerCase() === 'sukses'
                                                ? 'Pembayaran telah dikonfirmasi.'
                                                : 'Admin sedang melakukan pengecekan bukti transfer Anda.'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
