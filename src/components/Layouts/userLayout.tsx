import { PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import App from '../../App';
import { IRootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';
import Footer from './UserFooter';
import UserNavbar from './UserNavbar';
import Portals from '../../components/Portals';
import Loader from '../Icon/Loader';

interface UserLayoutProps extends PropsWithChildren {
    headerTitle?: string;
    headerSubtitle?: string;
    showHeader?: boolean;
}

const UserLayout = ({ children, headerTitle = 'WELCOME BACK, NAVOD', headerSubtitle = 'Low Cost Web Hosting Sri Lanka', showHeader = true }: UserLayoutProps) => {
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

                {/* BEGIN TOP NAVBAR */}
                <UserNavbar />
                {/* END TOP NAVBAR */}

                {/* BEGIN HEADER SECTION */}
                {showHeader && (
                    <div className="relative mb-8 -mt-16">
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-screen z-10">
                            <div className="relative h-80 sm:h-96 overflow-hidden">
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <img src="/assets/images/header .jpg" alt="Header background" className="w-full h-full object-cover" />
                                    {/* Overlay for better text readability */}
                                    <div className="absolute inset-0"></div>
                                </div>

                                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
                                    <div className="flex items-end h-full pb-8">
                                        <div className="max-w-2xl">
                                            {/* Header content with image background */}
                                            <div className="mb-6">
                                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-2 drop-shadow-lg">
                                                    {headerTitle.includes('NAVOD') ? (
                                                        <>
                                                            {headerTitle.split('NAVOD')[0]}
                                                            <span className="text-gray-700">NAVOD</span>
                                                            {headerTitle.split('NAVOD')[1]}
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-700">{headerTitle}</span>
                                                    )}
                                                </h1>
                                            </div>
                                            <div className="flex flex-col space-y-3 text-lg">
                                                <span className="text-gray-600 font-medium text-xl drop-shadow">{headerSubtitle}</span>
                                                <div>
                                                    <span className="text-black font-semibold bg-gray-200/90 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-300/50 shadow-lg">
                                                        Client Area
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Spacer to maintain layout */}
                        <div className="h-80 sm:h-96"></div>
                    </div>
                )}
                {/* END HEADER SECTION */}

                {/* Main layout container with professional styling - no sidebar spacing */}
                <div className="text-black dark:text-white-dark min-h-screen relative z-10 w-full">
                    {/* Main content area with enhanced styling - adjusted for top navbar */}
                    <div className="flex flex-col min-h-screen pt-16 w-full">
                        {/* BEGIN CONTENT AREA */}
                        <div className="flex-1 relative w-full">
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
                                <div className={`${themeConfig.animation} relative z-10 animate__animated w-full px-4 sm:px-6 lg:px-8 pb-16`}>
                                    {/* Content wrapper with optimal width utilization */}
                                    <div className="w-full max-w-7xl mx-auto">{children}</div>
                                </div>
                            </Suspense>
                        </div>
                        {/* END CONTENT AREA */}

                        {/* BEGIN FOOTER */}
                        <div className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50">
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
