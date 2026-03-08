import { useState } from 'react'
import { X, Upload, CheckCircle2, Loader2, Info, Copy, Clock } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function CheckoutModal({ isOpen, onClose, selectedPlan, user, onOpenDashboard }) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [invoiceRef, setInvoiceRef] = useState('')
    const [error, setError] = useState(null)
    const [file, setFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [step, setStep] = useState(1)
    const [metodePembayaran, setMetodePembayaran] = useState('8161900613 BCA an Ahmad Rizal Syamsul Alam')

    const [formData, setFormData] = useState({
        nama: '',
        no_wa: '',
        email: '',
    })
    const [toastMsg, setToastMsg] = useState('')

    const handleCopy = () => {
        navigator.clipboard.writeText('8161900613')
        setToastMsg('Nomor Rekening Tersalin!')
        setTimeout(() => setToastMsg(''), 2500)
    }

    if (!isOpen) return null

    const handleClose = () => {
        setStep(1)
        setError(null)
        setFile(null)
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
        }
        setSuccess(false)
        onClose()
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
            const objectUrl = URL.createObjectURL(selectedFile)
            setPreviewUrl(objectUrl)
        }
    }

    const onSubmitForm = (e) => {
        e.preventDefault()
        if (step === 1) {
            setStep(2)
            setError(null)
        } else {
            handleSubmit()
        }
    }

    const handleSubmit = async () => {
        if (!file) {
            setError('Bukti transfer wajib diunggah terlebih dahulu.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            // 1. Upload File ke Storage 'bukti-transfer'
            const fileExt = file.name.split('.').pop()
            const fileName = `anon-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`
            const filePath = `uploads/${fileName}`

            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('bukti-transfer')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw new Error(`Gagal upload bukti: ${uploadError.message}`)

            // Dapatkan public URL dari bukti
            const { data: { publicUrl } } = supabase.storage
                .from('bukti-transfer')
                .getPublicUrl(filePath)

            const newInvoiceRef = `INV-${Date.now().toString().slice(-6)}`;

            // 2. Insert data ke tabel 'pembayaran'
            const { error: dbError } = await supabase
                .from('pembayaran')
                .insert([
                    {
                        invoice_id: newInvoiceRef,
                        nama: formData.nama,
                        no_wa: formData.no_wa,
                        email: formData.email,
                        paket_pilihan: selectedPlan?.name || 'Unknown',
                        bukti_transfer: publicUrl,
                        metode_pembayaran: 'Transfer Manual BCA'
                    }
                ])

            if (dbError) throw new Error(`Gagal menyimpan data: ${dbError.message}`)

            // Sukses!
            setInvoiceRef(newInvoiceRef)
            setSuccess(true)

        } catch (err) {
            console.error('Checkout Error:', err)
            setError(err.message || 'Terjadi kesalahan sistem. Silakan coba lagi.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        const status = 'pending'; // 'pending', 'sukses', 'batal'

        return (
            <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-12 sm:items-center sm:pt-4 overflow-y-auto">
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm fixed" onClick={handleClose} />
                <div className="relative w-full max-w-md sm:max-w-md bg-white rounded-3xl shadow-2xl mt-8 sm:mt-0 mb-8 sm:mb-0 pb-10 sm:p-8 text-center animate-fade-in-up">
                    {/* Floating Icon di atas Modal */}
                    <div className="absolute left-1/2 -top-8 -translate-x-1/2 w-16 h-16 bg-white rounded-full p-2 border border-gray-100 shadow-xl flex items-center justify-center z-10">
                        <img src="/images/icon.webp" alt="Logo" className="w-12 h-12 object-contain drop-shadow-sm" />
                    </div>

                    <div className="p-6 pt-10 sm:pt-4">
                        {/* Invoice Header */}
                        <div className="mb-6 border-b border-gray-100 pb-5">
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">Invoice Pembayaran</h2>
                            <div className="flex items-center justify-center gap-2">
                                <p className="text-xs text-gray-500 font-medium">No. Ref: <span className="text-gray-900 font-bold">{invoiceRef}</span></p>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(invoiceRef);
                                        setToastMsg('Nomor Invoice Tersalin!');
                                        setTimeout(() => setToastMsg(''), 2500);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-500 transition-colors"
                                    title="Salin ID"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 text-left mb-6 space-y-3 sm:space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status:</span>
                                {status === 'pending' && <span className="px-3 py-1 bg-orange-100 text-orange-700 font-bold text-xs rounded-full border border-orange-200 flex items-center gap-1"><Clock className="w-3 h-3" /> PENDING</span>}
                                {status === 'sukses' && <span className="px-3 py-1 bg-green-100 text-green-700 font-bold text-xs rounded-full border border-green-200 gap-1"><CheckCircle2 className="w-3 h-3 inline" /> SUKSES</span>}
                                {status === 'batal' && <span className="px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-full border border-red-200 gap-1"><X className="w-3 h-3 inline" /> BATAL</span>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-start text-sm">
                                    <span className="text-gray-500 font-medium whitespace-nowrap mr-4">Nama Pelanggan:</span>
                                    <span className="text-gray-900 font-bold text-right truncate">{formData.nama}</span>
                                </div>
                                <div className="flex justify-between items-start text-sm">
                                    <span className="text-gray-500 font-medium whitespace-nowrap mr-4">Akun:</span>
                                    <span className="text-gray-900 font-semibold text-right truncate max-w-[150px]">{formData.email}</span>
                                </div>
                                <div className="flex justify-between items-start text-sm">
                                    <span className="text-gray-500 font-medium whitespace-nowrap mr-4">Paket Dibeli:</span>
                                    <span className="text-blue-700 font-black text-right">{selectedPlan?.name}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-gray-200/60 flex justify-between items-center bg-blue-50 -mx-4 -mb-4 px-4 py-3 rounded-b-2xl">
                                <span className="text-gray-600 font-bold">Total Tagihan:</span>
                                <span className="text-xl font-black text-blue-700">{selectedPlan?.price}</span>
                            </div>
                        </div>

                        <p className="text-[10px] sm:text-xs text-gray-500 mb-6 bg-blue-50/50 p-2 sm:p-3 rounded-lg border border-blue-100 text-left font-medium">
                            * Simpan nomor invoice Anda. Klik tombol <strong>"Cek Status"</strong> di bawah untuk memantau status pesanan Anda secara langsung.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors shadow-sm"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => {
                                    handleClose();
                                    if (onOpenDashboard) onOpenDashboard(invoiceRef);
                                }}
                                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                            >
                                Cek Status
                            </button>
                        </div>

                        {/* Toast Notification */}
                        {toastMsg && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl text-xs font-bold animate-fade-in-up z-50 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                {toastMsg}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative w-full sm:max-w-lg bg-white sm:rounded-3xl shadow-2xl overflow-hidden h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col animate-fade-in-up">

                <div className="flex items-center justify-between px-5 sm:px-6 py-3 sm:py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <h3 className="text-base sm:text-xl font-bold text-gray-900">
                        {step === 1 ? 'Data Pelanggan' : 'Detail Pembayaran'}
                    </h3>
                    <button onClick={handleClose} className="p-2 ml-auto bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>

                {toastMsg && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-medium px-4 py-2 rounded-full shadow-lg z-50 animate-fade-in-up flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        {toastMsg}
                    </div>
                )}

                <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col">

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <form id="checkout-form" onSubmit={onSubmitForm} className="flex-1 flex flex-col">
                        {step === 1 ? (
                            <div className="space-y-4 animate-fade-in-up">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Metode Pembayaran</label>
                                    <select
                                        value={metodePembayaran}
                                        onChange={(e) => setMetodePembayaran(e.target.value)}
                                        className="w-full px-3 py-3 bg-blue-50/50 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-blue-900"
                                    >
                                        <option value="8161900613 BCA an Ahmad Rizal Syamsul Alam">BCA - 8161900613 a/n Ahmad Rizal Syamsul Alam</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                                        <input required type="text" name="nama" value={formData.nama} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Contoh: Budi Santoso" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">No WhatsApp</label>
                                        <input required type="text" name="no_wa" value={formData.no_wa} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Contoh: 081234567890" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Email Aktif</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="budi@email.com" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col space-y-3 animate-fade-in-up">
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-600 text-left">
                                    <p className="font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-1.5 flex justify-between items-center">
                                        <span>Data Anda</span>
                                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Cek Kembali</span>
                                    </p>
                                    <div className="space-y-1">
                                        <div className="flex text-[11px]"><span className="text-gray-400 w-12 shrink-0">Paket:</span> <div className="font-bold text-gray-800">{selectedPlan?.name}<p className="font-medium text-[9px] text-blue-600 mt-0.5 leading-snug">{selectedPlan?.features?.filter(f => f.included).map(f => f.name).join(', ')}</p></div></div>
                                        <p className="flex text-[11px]"><span className="text-gray-400 w-12 shrink-0">Nama:</span> <span className="font-medium text-gray-700 truncate">{formData.nama || '-'}</span></p>
                                        <p className="flex text-[11px]"><span className="text-gray-400 w-12 shrink-0">WA/Hp:</span> <span className="font-medium text-gray-700 truncate">{formData.no_wa || '-'}</span></p>
                                        <p className="flex text-[11px]"><span className="text-gray-400 w-12 shrink-0">Email:</span> <span className="font-medium text-gray-700 truncate">{formData.email || '-'}</span></p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-between text-left">
                                    <div>
                                        <p className="text-[10px] text-blue-900 font-semibold mb-1">Transfer Tagihan ({selectedPlan?.price})</p>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] font-black text-white bg-blue-800 px-1.5 py-0.5 rounded uppercase leading-none">BCA</span>
                                            <p className="text-sm font-black text-gray-900 tracking-wider">8161900613</p>
                                        </div>
                                        <p className="text-[9px] text-gray-600 font-medium mt-0.5">a/n Ahmad Rizal Syamsul Alam</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="p-2 bg-white rounded border border-blue-200 shadow-sm text-blue-600 hover:bg-blue-100 transition-colors flex flex-col items-center gap-0.5 shrink-0 active:scale-95"
                                    >
                                        <Copy className="w-4 h-4" />
                                        <span className="text-[8px] font-bold">Salin</span>
                                    </button>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Upload Bukti Transfer</label>
                                    <label htmlFor="file-upload-main" className="flex-1 min-h-[120px] flex justify-center items-center px-4 py-3 border-2 border-gray-300 border-dashed rounded-xl hover:bg-blue-50/50 hover:border-blue-300 transition-all bg-white group cursor-pointer overflow-hidden relative">
                                        {previewUrl ? (
                                            <div className="relative w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                                                <img src={previewUrl} alt="Preview Bukti Transfer" className="max-w-full max-h-[25vh] sm:max-h-[200px] object-contain" />
                                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 text-gray-700 font-bold py-1.5 px-4 rounded-full shadow text-[10px] sm:text-xs border border-gray-200">
                                                    Ketuk untuk ganti gambar
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <Upload className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <p className="text-sm font-bold text-blue-600">Ketuk untuk pilih gambar</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">PNG / JPG</p>
                                            </div>
                                        )}
                                        <input id="file-upload-main" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
                                    </label>
                                    {file && !previewUrl && (
                                        <div className="mt-2 flex justify-center">
                                            <span className="text-[10px] sm:text-xs text-green-600 font-semibold flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="truncate max-w-[200px]">{file.name}</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer fixed */}
                <div className="px-4 py-2 sm:p-4 border-t border-gray-100 bg-white">
                    <button
                        form="checkout-form"
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Mengunggah...</>
                        ) : step === 1 ? (
                            'Lanjut Pembayaran'
                        ) : (
                            'Kirim Bukti Pembayaran'
                        )}
                    </button>
                    {step === 2 && !loading && (
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full mt-1 py-1.5 text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Kembali Edit Data
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
