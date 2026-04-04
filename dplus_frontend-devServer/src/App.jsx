import { Component, useEffect, useState } from 'react'
import './App.css'
import Login from './pages/Login'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Navigation from './Navigation'
import SweetAlerts from './components/SweetAlerts'
import Loaders from './components/Loaders'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import WebSocketClient from './components/WebSocketClient'
import AuthActions from './store/actions/auth-actions'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }
    componentDidCatch(error, info) {
        console.error('[ErrorBoundary] caught:', error, info)
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', color: '#fff', background: '#09001A', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <h2 style={{ color: '#F26522' }}>Something went wrong</h2>
                    <p style={{ color: '#aaa', fontSize: '0.85rem' }}>{String(this.state.error)}</p>
                    <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/home'; }} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: '#F26522', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Reload</button>
                </div>
            )
        }
        return this.props.children
    }
}

function App() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const locdata = useLocation()
    const [sidebarOpen, setsidebarOpenn] = useState(true)
    const [isMobileViewport, setIsMobileViewport] = useState(false)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
    const isLoginRoute = locdata.pathname === '/' || locdata.pathname === '/login'

    useEffect(() => {
        const checkAuth = localStorage.getItem('auth')

        if (!isLoginRoute && checkAuth !== 'true') {
            localStorage.setItem('auth', 'false')
            navigate('/login', { replace: true })
        }
    }, [isLoginRoute, navigate])

    useEffect(() => {
        const syncViewport = () => {
            const isMobile = window.innerWidth < 1024
            setIsMobileViewport(isMobile)
            if (!isMobile) {
                setMobileSidebarOpen(false)
            }
        }
        syncViewport()
        window.addEventListener('resize', syncViewport)
        return () => window.removeEventListener('resize', syncViewport)
    }, [])

    useEffect(() => {
        setMobileSidebarOpen(false)
    }, [locdata.pathname])

    /** Role-based sidebar from Flask `GET /me` (dplus-apis); refreshes after login / full reload */
    useEffect(() => {
        if (isLoginRoute) return
        if (localStorage.getItem('auth') !== 'true') return
        dispatch(AuthActions.fetchMe())
    }, [isLoginRoute, dispatch])

    const handleSidebarToggle = () => {
        if (isMobileViewport) {
            setMobileSidebarOpen((value) => !value)
            return
        }
        setsidebarOpenn((value) => !value)
    }

    const effectiveSidebarOpen = isMobileViewport ? mobileSidebarOpen : sidebarOpen

    if (isLoginRoute) {
        return (
            <>
                <Routes>
                    <Route path='/' element={<Navigate to='/login' replace />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='*' element={<Navigate to='/login' replace />} />
                </Routes>
                <Loaders />
                <SweetAlerts />
            </>
        )
    }

    return (
        <ErrorBoundary>
            <main className='flex h-screen overflow-hidden bg-gray-200'>
                <WebSocketClient />

                <div className="flex flex-1 flex-col">
                    <TopBar
                        isSidebarOpen={effectiveSidebarOpen}
                        isMobileViewport={isMobileViewport}
                        onSidebarToggle={handleSidebarToggle}
                    />
                    <div className="relative flex min-h-0 flex-1 flex-row">
                        {/*
                          Option B (current): 88px flex rail + sidebar expands absolute to 290px (map canvas width stable → less WebGL blink).
                          When expanded, main gets lg:pl-[202px] (290−88) so filters/modals align with the visible edge — no underlap with sidebar.

                          Option A (fallback): remove rail wrapper; sidebar lg:sticky in-flow lg:w-[290px]|lg:w-[88px]; drop the pl-[202px] wrapper; no width transition on sidebar.
                        */}
                        <div className="relative z-[25] w-0 shrink-0 self-stretch min-h-0 lg:w-[88px]">
                            <ErrorBoundary>
                                <Sidebar
                                    sidebarOpen={sidebarOpen}
                                    isMobileViewport={isMobileViewport}
                                    mobileVisible={mobileSidebarOpen}
                                    onMobileClose={() => setMobileSidebarOpen(false)}
                                />
                            </ErrorBoundary>
                        </div>
                        <div
                            className={`flex min-h-0 min-w-0 flex-1 flex-col ${
                                sidebarOpen ? 'lg:pl-[202px]' : 'lg:pl-0'
                            }`}
                        >
                            <Navigation sidebarOpen={sidebarOpen} />
                        </div>
                    </div>
                </div>

                <Loaders />
                <SweetAlerts />
            </main>
        </ErrorBoundary>
    )
}

export default App
