export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden">
            {/* Top decoration */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
                {/* Brand */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <img src="/images/icon.webp" alt="Logo ToolsPro" className="w-7 h-7 object-contain drop-shadow" />
                        <span className="text-base font-bold text-gray-300">
                            Tools<span className="text-blue-400">Pro</span>
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs max-w-sm mx-auto leading-relaxed">
                        Platform penyedia tools premium digital terbaik dengan harga terjangkau.
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
