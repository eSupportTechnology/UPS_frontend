import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';

import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuContract from '../Icon/Menu/IconMenuContract';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuContacts from '../Icon/Menu/IconMenuContacts';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';

const UserSidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => (oldValue === value ? '' : value));
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [location]);

    type SidebarItem = {
        label: string;
        icon: JSX.Element;
        link?: string;
        key: string;
        children?: { label: string; link: string }[];
    };

    const sidebarItems: SidebarItem[] = [
        {
            label: t('Dashboard'),
            icon: <IconMenuDashboard className="group-hover:!text-primary shrink-0" />,
            link: '/customer/dashboard',
            key: 'dashboard',
        },
        {
            label: t('Ticket'),
            icon: <IconMenuChat className="group-hover:!text-primary shrink-0" />,
            key: 'ticket',
            children: [
                { label: t('Create Ticket'), link: '/customer/ticket/create-ticket' },
                { label: t('All Tickets'), link: '/customer/ticket/all-tickets' },
            ],
        },
    ];

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}>
                {/* Professional White Background */}
                <div className="relative h-full overflow-hidden">
                    {/* Multi-layered White Background */}
                    <div className="absolute inset-0 bg-white dark:bg-gray-800 backdrop-blur-sm"></div>
                    <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-2xl border-r border-gray-200 dark:border-gray-700"></div>

                    {/* Subtle Decorative Elements */}
                    <div className="absolute top-8 left-4 w-16 h-16 bg-gray-100/50 dark:bg-gray-700/30 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 right-4 w-12 h-12 bg-gray-200/50 dark:bg-gray-600/30 rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 left-2 w-8 h-8 bg-gray-100/30 dark:bg-gray-700/20 rounded-full blur-lg"></div>

                    {/* Content */}
                    <div className="relative h-full z-10">
                        {/* Logo Header with White Styling */}
                        <div className="relative mb-4">
                            <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800 backdrop-blur-sm"></div>
                            <div className="absolute inset-0 bg-white/90 dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700"></div>

                            <div className="relative flex justify-between items-center px-4 py-4">
                                <NavLink to="/customer/dashboard" className="main-logo flex items-center shrink-0 group">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg blur-sm group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-all duration-300"></div>
                                        <img className="relative w-8 ml-[5px] flex-none" src="/assets/images/logo.svg" alt="logo" />
                                    </div>
                                    <span className="text-2xl ltr:ml-3 rtl:mr-3 font-bold align-middle lg:inline text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                        {t('UPS')}
                                    </span>
                                </NavLink>

                                <button
                                    type="button"
                                    className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-100 dark:hover:bg-gray-700/40 hover:shadow-lg text-gray-700 dark:text-white-light transition-all duration-300 rtl:rotate-180"
                                    onClick={() => dispatch(toggleSidebar())}
                                >
                                    <IconCaretsDown className="m-auto rotate-90" />
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Menu Section */}
                        <PerfectScrollbar className="h-[calc(100vh-100px)] relative">
                            <div className="relative p-4">
                                {/* Menu Background */}
                                <div className="absolute inset-2 bg-gray-50/60 dark:bg-gray-800/40 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/30"></div>

                                <ul className="relative font-semibold space-y-2 py-2">
                                    {sidebarItems.map((item) => (
                                        <li className="menu nav-item" key={item.key}>
                                            {item.children ? (
                                                // Menu item with submenu - Enhanced styling
                                                <>
                                                    <button
                                                        type="button"
                                                        className={`${currentMenu === item.key ? 'active bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700/40'} nav-link group w-full rounded-xl p-3 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700/30 hover:shadow-lg`}
                                                        onClick={() => toggleMenu(item.key)}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700/40 group-hover:bg-gray-200 dark:group-hover:bg-gray-600/40 transition-all duration-300">
                                                                {item.icon}
                                                            </div>
                                                            <span className="ltr:pl-3 rtl:pr-3 text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={`${currentMenu !== item.key ? 'rtl:rotate-90 -rotate-90' : ''} transition-transform duration-300 text-gray-600 dark:text-gray-400`}
                                                        >
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>

                                                    <AnimateHeight duration={300} height={currentMenu === item.key ? 'auto' : 0}>
                                                        <ul className="sub-menu ml-4 mt-2 space-y-1">
                                                            {item.children.map((child) => (
                                                                <li key={child.link}>
                                                                    <NavLink
                                                                        to={child.link}
                                                                        className="block p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700/20"
                                                                    >
                                                                        {child.label}
                                                                    </NavLink>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </AnimateHeight>
                                                </>
                                            ) : (
                                                // Single menu item - Enhanced styling
                                                <NavLink
                                                    to={item.link!}
                                                    className="nav-link group block p-3 rounded-xl hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/30 dark:hover:border-gray-700/30 hover:shadow-lg"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="p-1 rounded-lg bg-gradient-to-br from-blue-400/20 to-purple-400/20 group-hover:from-blue-400/30 group-hover:to-purple-400/30 transition-all duration-300">
                                                            {item.icon}
                                                        </div>
                                                        <span className="ltr:pl-3 rtl:pr-3 text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white font-medium">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                </NavLink>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default UserSidebar;
