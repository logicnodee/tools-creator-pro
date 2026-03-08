export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden">
            {/* Top decoration */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
                {/* Brand */}
                <div className="mb-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                    <img src="/images/icon.webp" alt="Logo ToolsPro" className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow shrink-0" />
                    <p className="text-gray-500 text-xs sm:text-sm max-w-sm leading-relaxed">
                        Penyedia layanan <strong>akun premium digital</strong> terlengkap. Dapatkan akses ke <strong>Canva Pro, CapCut Pro, Gemini Advanced</strong>, hingga Google Drive dengan harga paling terjangkau se-Indonesia.
                    </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-4" />

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-gray-600 text-[10px]">
                        © {new Date().getFullYear()} Tools Creator Pro. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
