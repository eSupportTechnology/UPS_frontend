import { PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import App from '../../App';
import { IRootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';
import Footer from './Footer';
import Header from './Header';
import UserSidebar from './UserSidebar';
import Portals from '../../components/Portals';
import Loader from '../Icon/Loader';

const UserLayout = ({ children }: PropsWithChildren) => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    const [showLoader, setShowLoader] = useState(true);
    const [showTopButton, setShowTopButton] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const goToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    const onScrollHandler = () => {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            setShowTopButton(true);
        } else {
            setShowTopButton(false);
        }
    };

    const toggleSidebarCollapse = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    useEffect(() => {
        window.addEventListener('scroll', onScrollHandler);

        const screenLoader = document.getElementsByClassName('screen_loader');
        if (screenLoader?.length) {
            screenLoader[0].classList.add('animate__fadeOut');
            setTimeout(() => {
                setShowLoader(false);
            }, 200);
        }

        
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarCollapsed(true);
            } else {
                setSidebarCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); 

        return () => {
            window.removeEventListener('scroll', onScrollHandler);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <App>
            {/* BEGIN MAIN CONTAINER */}
            <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Professional backdrop overlay */}
                <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm"></div>

                {/* Sidebar menu overlay with enhanced styling */}
                <div
                    className={`${(!themeConfig.sidebar && 'hidden') || ''} fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden transition-all duration-300`}
                    onClick={() => dispatch(toggleSidebar())}
                ></div>

                {/* Enhanced screen loader */}
                {showLoader && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                        <div className="text-center">
                            <Loader />
                            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Loading your workspace...</p>
                        </div>
                    </div>
                )}

                {/* Enhanced scroll to top button */}
                <div className="fixed bottom-8 ltr:right-8 rtl:left-8 z-50">
                    {showTopButton && (
                        <button
                            type="button"
                            className="group btn btn-outline-primary rounded-full p-3 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:scale-110"
                            onClick={goToTop}
                            title="Scroll to top"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-primary group-hover:text-primary-dark transition-colors duration-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l4-4m0 0l4 4m-4-4v18" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Professional breadcrumb indicator */}
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 lg:hidden">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Customer Portal</span>
                        </div>
                    </div>
                </div>

                {/* Main layout container with professional styling */}
                <div className={`${themeConfig.navbar} main-container text-black dark:text-white-dark min-h-screen relative z-10`}>
                    {/* BEGIN USER SIDEBAR */}
                    <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
                        <UserSidebar />
                    </div>
                    {/* END USER SIDEBAR */}

                    {/* Main content area with enhanced styling */}
                    <div className="main-content flex flex-col min-h-screen transition-all duration-300">
                        {/* BEGIN TOP NAVBAR */}
                        <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <Header />
                        </div>
                        {/* END TOP NAVBAR */}

                        {/* BEGIN CONTENT AREA */}
                        <div className="flex-1 relative">
                            {/* Content background with subtle pattern */}
                            <div className="absolute inset-0 opacity-30">
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)`,
                                        backgroundSize: '20px 20px',
                                    }}
                                ></div>
                            </div>

                            <Suspense
                                fallback={
                                    <div className="flex items-center justify-center min-h-[400px]">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading content...</p>
                                        </div>
                                    </div>
                                }
                            >
                                <div className={`${themeConfig.animation} p-6 relative z-10 animate__animated`}>
                                    {/* Content wrapper with professional styling */}
                                    <div className="max-w-full">{children}</div>
                                </div>
                            </Suspense>
                        </div>
                        {/* END CONTENT AREA */}

                        {/* BEGIN FOOTER */}
                        <div className="mt-auto bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50">
                            <Footer />
                        </div>
                        {/* END FOOTER */}
                        <Portals />
                    </div>
                </div>
            </div>
        </App>
    );
};

export default UserLayout;
