import { useState, useEffect } from 'react'
import '../index.css'
import HeroSection from '../components/HeroSection'
import ToolsSection from '../components/ToolsSection'
import PricingSection from '../components/PricingSection'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import CheckoutModal from '../components/CheckoutModal'
import DashboardModal from '../components/DashboardModal'
import { supabase } from '../supabaseClient'

export default function Home() {
    const [session, setSession] = useState(null)
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
    const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [initialSearchQuery, setInitialSearchQuery] = useState('')

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan)
        setIsCheckoutModalOpen(true)
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white font-inter overflow-x-hidden">
            <Navbar
                user={session?.user}
                onOpenDashboard={() => setIsDashboardModalOpen(true)}
            />

            <HeroSection />
            <ToolsSection />
            <PricingSection onSelectPlan={handleSelectPlan} />
            <Footer />

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                selectedPlan={selectedPlan}
                user={session?.user}
                onOpenDashboard={(invoiceRef) => {
                    setIsCheckoutModalOpen(false)
                    setInitialSearchQuery(invoiceRef || '')
                    setIsDashboardModalOpen(true)
                }}
            />

            <DashboardModal
                isOpen={isDashboardModalOpen}
                onClose={() => {
                    setIsDashboardModalOpen(false)
                    setInitialSearchQuery('')
                }}
                initialSearchQuery={initialSearchQuery}
            />
        </div>
    )
}
