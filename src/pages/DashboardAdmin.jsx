import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, ArrowLeft, Users, Activity, Loader2, CheckCircle2, XCircle, Key, Search } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function DashboardAdmin() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedRow, setExpandedRow] = useState(null)
    const [accessData, setAccessData] = useState({
        akses_gemini: '',
        akses_canva: '',
        akses_capcut: ''
    })
    const [savingAccess, setSavingAccess] = useState(false)
    const [searchAdmin, setSearchAdmin] = useState('')

    // Filter invoices berdasarkan search
    const filteredInvoices = invoices.filter(inv => {
        if (!searchAdmin.trim()) return true
        const q = searchAdmin.toLowerCase()
        return (
            (inv.nama || '').toLowerCase().includes(q) ||
            (inv.email || '').toLowerCase().includes(q) ||
            (inv.no_wa || '').toLowerCase().includes(q) ||
            (inv.invoice_id || '').toLowerCase().includes(q) ||
            (inv.id || '').toLowerCase().includes(q) ||
            (inv.paket_pilihan || '').toLowerCase().includes(q) ||
            (inv.status || '').toLowerCase().includes(q)
        )
    })

    useEffect(() => {
        // Cek login session khusus Admin
        const fetchSessionAndData = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.user) {
                navigate('/login') // Tendang ke login jika belum masuk
                return
            }
            setUser(session.user)
            await fetchAllTransactions()
        }

        fetchSessionAndData()
    }, [navigate])

    const fetchAllTransactions = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('pembayaran')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setInvoices(data || [])
        } catch (error) {
            console.error('Error memuat semua transaksi', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const { data, error } = await supabase
                .from('pembayaran')
                .update({ status: newStatus })
                .eq('id', id)
                .select()

            if (error) throw error

            if (!data || data.length === 0) {
                alert('⚠️ Update gagal! Kemungkinan tabel memiliki Row Level Security (RLS) yang aktif. Silakan jalankan perintah SQL berikut di Supabase:\n\nALTER TABLE pembayaran DISABLE ROW LEVEL SECURITY;')
                return
            }

            // Perbarui state lokal agar UI berubah seketika tanpa perlu reload
            setInvoices(invoices.map(inv =>
                inv.id === id ? { ...inv, status: newStatus } : inv
            ))
        } catch (error) {
            console.error('Error saat update status:', error)
            alert(`Gagal mengubah status pesanan: ${error.message}`)
        }
    }

    const handleOpenAccess = (inv) => {
        if (expandedRow === inv.id) {
            setExpandedRow(null)
        } else {
            setExpandedRow(inv.id)
            setAccessData({
                akses_gemini: inv.akses_gemini || '',
                akses_canva: inv.akses_canva || '',
                akses_capcut: inv.akses_capcut || ''
            })
        }
    }

    const handleSaveAccess = async (id) => {
        setSavingAccess(true)
        try {
            const { data, error } = await supabase
                .from('pembayaran')
                .update({
                    akses_gemini: accessData.akses_gemini,
                    akses_canva: accessData.akses_canva,
                    akses_capcut: accessData.akses_capcut
                })
                .eq('id', id)
                .select()

            if (error) throw error

            if (!data || data.length === 0) {
                alert('⚠️ Update gagal! Row Level Security (RLS) aktif.\n\nJalankan SQL ini di Supabase:\nALTER TABLE pembayaran DISABLE ROW LEVEL SECURITY;')
                return
            }

            setInvoices(invoices.map(inv =>
                inv.id === id ? { ...inv, ...accessData } : inv
            ))
            alert('✅ Akses berhasil ditambahkan/diperbarui!')
            setExpandedRow(null)
        } catch (error) {
            console.error('Error update access:', error)
            alert(`Gagal memperbarui akses: ${error.message}`)
        } finally {
            setSavingAccess(false)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Memuat Data Dashboard...</p>
                </div>
            </div>
        )
    }



    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            {/* Navbar khusus Admin */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 leading-tight">Admin<span className="text-blue-600">Terpadu</span></h1>
                                <p className="text-[10px] sm:text-xs text-gray-500 font-mono tracking-wider">Control Panel</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="hidden sm:flex text-sm text-gray-500 hover:text-blue-600 font-medium items-center transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1.5" /> Lihat Web Publik
                            </button>

                            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                            <div className="hidden sm:flex items-center gap-2">
                                <div className="text-right leading-tight">
                                    <p className="text-sm font-bold text-gray-900">{user?.email}</p>
                                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Superadmin</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold text-sm rounded-xl transition-colors border border-red-100"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Pesanan Pelanggan */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gray-50/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-gray-400" />
                                    Daftar Pesanan
                                    <span className="text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">{filteredInvoices.length}{searchAdmin.trim() ? ` / ${invoices.length}` : ''}</span>
                                </h2>
                                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                    Kelola pesanan dan kirim akses premium ke pelanggan.
                                </p>
                            </div>
                            <div className="relative w-full sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchAdmin}
                                    onChange={(e) => setSearchAdmin(e.target.value)}
                                    className="block w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors outline-none shadow-sm"
                                    placeholder="Cari nama, email, WA, invoice..."
                                />
                            </div>
                        </div>
                    </div>

                    {invoices.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500">Belum ada pesanan masuk.</div>
                    ) : (
                        <>
                            {/* MOBILE CARD LAYOUT */}
                            <div className="md:hidden divide-y divide-gray-100">
                                {filteredInvoices.map((inv) => (
                                    <div key={inv.id} className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <span className="font-mono font-medium text-gray-900 border border-gray-200 bg-gray-50 px-1.5 py-0.5 rounded text-[10px] inline-block mb-1">{inv.invoice_id || `INV-${inv.id.substring(0, 5).toUpperCase()}`}</span>
                                                <p className="font-bold text-sm text-gray-900">{inv.nama}</p>
                                                <p className="text-[11px] text-gray-500">{inv.email}</p>
                                                <p className="text-[11px] text-gray-500">{inv.no_wa}</p>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-1">
                                                {inv.status?.toLowerCase() === 'lunas' || inv.status?.toLowerCase() === 'sukses' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3" /> Lunas</span>
                                                ) : inv.status?.toLowerCase() === 'ditolak' || inv.status?.toLowerCase() === 'batal' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700"><XCircle className="w-3 h-3" /> Ditolak</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-yellow-100 text-yellow-800"><Activity className="w-3 h-3" /> Pending</span>
                                                )}
                                                <span className="text-[10px] text-gray-400">{new Date(inv.created_at).toLocaleDateString('id-ID')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-blue-600">{inv.paket_pilihan || 'Premium'}</span>
                                                {inv.bukti_transfer && (<a href={inv.bukti_transfer} target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Bukti</a>)}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={() => handleOpenAccess(inv)} className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 ${inv.akses_gemini || inv.akses_canva || inv.akses_capcut ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}><Key className="w-3 h-3" /> Auth</button>
                                                {inv.status?.toLowerCase() !== 'lunas' && inv.status?.toLowerCase() !== 'sukses' && (<button onClick={() => handleUpdateStatus(inv.id, 'lunas')} className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded">Lunas</button>)}
                                                {inv.status?.toLowerCase() !== 'ditolak' && inv.status?.toLowerCase() !== 'batal' && (<button onClick={() => handleUpdateStatus(inv.id, 'ditolak')} className="px-2 py-1 bg-white border border-gray-300 text-gray-600 text-[10px] font-bold rounded">Tolak</button>)}
                                            </div>
                                        </div>
                                        {expandedRow === inv.id && (
                                            <div className="mt-3 bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 animate-fade-in-up">
                                                <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-indigo-500" /> Kredensial: <span className="text-blue-600">{inv.paket_pilihan}</span></h4>
                                                <div className="space-y-2 mb-3">
                                                    <div><label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Gemini / Flow / Drive</label><textarea className="w-full border border-gray-200 rounded-lg p-2 text-xs h-16 outline-none focus:border-indigo-400 text-gray-700" placeholder="Link / Email / Pass" value={accessData.akses_gemini} onChange={(e) => setAccessData({ ...accessData, akses_gemini: e.target.value })} /></div>
                                                    <div><label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Akses Canva</label><textarea className="w-full border border-gray-200 rounded-lg p-2 text-xs h-16 outline-none focus:border-indigo-400 text-gray-700" placeholder="Link / Email / Pass" value={accessData.akses_canva} onChange={(e) => setAccessData({ ...accessData, akses_canva: e.target.value })} /></div>
                                                    <div><label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Akses CapCut</label><textarea className="w-full border border-gray-200 rounded-lg p-2 text-xs h-16 outline-none focus:border-indigo-400 text-gray-700" placeholder="Email / Pass" value={accessData.akses_capcut} onChange={(e) => setAccessData({ ...accessData, akses_capcut: e.target.value })} /></div>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setExpandedRow(null)} className="px-3 py-1.5 text-[10px] font-bold text-gray-600 bg-gray-100 rounded-lg">Batal</button>
                                                    <button onClick={() => handleSaveAccess(inv.id)} disabled={savingAccess} className="px-3 py-1.5 text-[10px] font-bold text-white bg-indigo-600 rounded-lg flex items-center gap-1.5 disabled:opacity-70">{savingAccess && <Loader2 className="w-3 h-3 animate-spin" />} Simpan</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* DESKTOP TABLE */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Waktu & ID</th>
                                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Pelanggan</th>
                                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Paket</th>
                                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Bukti</th>
                                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px] text-center">Status</th>
                                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px] text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredInvoices.map((inv) => (
                                            <React.Fragment key={inv.id}>
                                                <tr className="hover:bg-blue-50/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-mono font-medium text-gray-900 border border-gray-200 bg-gray-50 px-1.5 py-0.5 rounded text-xs inline-block mb-1">{inv.invoice_id || `INV-${inv.id.substring(0, 5).toUpperCase()}`}</span>
                                                        <br /><span className="text-xs text-gray-500">{new Date(inv.created_at).toLocaleDateString('id-ID')}</span>
                                                        <br /><span className="text-[10px] text-gray-400">{new Date(inv.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </td>
                                                    <td className="px-6 py-4"><span className="font-bold text-gray-900">{inv.nama}</span><br /><span className="text-xs text-gray-500">{inv.email}</span><br /><span className="text-xs text-gray-500">{inv.no_wa}</span></td>
                                                    <td className="px-6 py-4 whitespace-nowrap"><span className="font-semibold text-blue-600">{inv.paket_pilihan || 'Premium'}</span></td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{inv.bukti_transfer ? (<a href={inv.bukti_transfer} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 inline-block">Lihat Bukti</a>) : (<span className="text-xs text-gray-400 italic">Kosong</span>)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        {inv.status?.toLowerCase() === 'lunas' || inv.status?.toLowerCase() === 'sukses' ? (<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 border border-green-200"><CheckCircle2 className="w-3.5 h-3.5" /> Lunas</span>)
                                                            : inv.status?.toLowerCase() === 'ditolak' || inv.status?.toLowerCase() === 'batal' ? (<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200"><XCircle className="w-3.5 h-3.5" /> Ditolak</span>)
                                                                : (<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200"><Activity className="w-3.5 h-3.5" /> Tertunda</span>)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleOpenAccess(inv)} className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 ${inv.akses_gemini || inv.akses_canva || inv.akses_capcut ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}><Key className="w-3.5 h-3.5" /> Data Auth</button>
                                                            {inv.status?.toLowerCase() !== 'lunas' && inv.status?.toLowerCase() !== 'sukses' && (<button onClick={() => handleUpdateStatus(inv.id, 'lunas')} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg shadow-sm">Set Lunas</button>)}
                                                            {inv.status?.toLowerCase() !== 'ditolak' && inv.status?.toLowerCase() !== 'batal' && (<button onClick={() => handleUpdateStatus(inv.id, 'ditolak')} className="px-3 py-1.5 bg-white border border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 text-gray-700 text-xs font-semibold rounded-lg shadow-sm">Tolak</button>)}
                                                        </div>
                                                    </td>
                                                </tr>
                                                {expandedRow === inv.id && (
                                                    <tr className="bg-indigo-50/50"><td colSpan="6" className="px-6 py-4">
                                                        <div className="bg-white rounded-xl border border-indigo-100 p-4 shadow-sm">
                                                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Key className="w-4 h-4 text-indigo-500" /> Kredensial: <span className="text-blue-600">{inv.paket_pilihan}</span></h4>
                                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                                <div><label className="block text-xs font-semibold text-gray-700 mb-1">Gemini / Flow / Drive</label><textarea className="w-full border border-gray-200 rounded-lg p-2 text-xs h-20 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-gray-700" placeholder="Link / Email / Pass" value={accessData.akses_gemini} onChange={(e) => setAccessData({ ...accessData, akses_gemini: e.target.value })} /></div>
                                                                <div><label className="block text-xs font-semibold text-gray-700 mb-1">Akses Canva</label><textarea className="w-full border border-gray-200 rounded-lg p-2 text-xs h-20 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-gray-700" placeholder="Link / Email / Pass" value={accessData.akses_canva} onChange={(e) => setAccessData({ ...accessData, akses_canva: e.target.value })} /></div>
                                                                <div><label className="block text-xs font-semibold text-gray-700 mb-1">Akses CapCut</label><textarea className="w-full border border-gray-200 rounded-lg p-2 text-xs h-20 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-gray-700" placeholder="Email / Pass" value={accessData.akses_capcut} onChange={(e) => setAccessData({ ...accessData, akses_capcut: e.target.value })} /></div>
                                                            </div>
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => setExpandedRow(null)} className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Batal</button>
                                                                <button onClick={() => handleSaveAccess(inv.id)} disabled={savingAccess} className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 rounded-lg flex items-center gap-2">{savingAccess && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Simpan Data Akses</button>
                                                            </div>
                                                        </div>
                                                    </td></tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
