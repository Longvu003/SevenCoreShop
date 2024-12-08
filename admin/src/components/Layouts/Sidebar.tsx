import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconMinus from '../Icon/IconMinus';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import { IRootState } from '../../store';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [role, setRole] = useState<number | null>(null); // State to store user role
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => (oldValue === value ? '' : value));
    };

    useEffect(() => {
        // Fetch the token string from localStorage
        const tokenString: string | null = localStorage.getItem('tokenuser');
        let token: any = null;

        if (tokenString) {
            try {
                token = JSON.parse(tokenString); // Parse the JSON string into an object
                setRole(token.role); // Set the user role from the token
            } catch (error) {
                console.error('Error parsing token:', error);
            }
        }

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
    }, [location]);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [location, dispatch, themeConfig.sidebar]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}>
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('SEVENCORE')}</span>
                        </NavLink>
                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <IconMinus className="w-4 h-5 flex-none hidden" />
                                <span>{t('chính')}</span>
                            </h2>
                            <li className="nav-item">
                                <ul>
                                    <li className="nav-item">
                                        <NavLink to="/" className="group">
                                            <div className="flex items-center">
                                                <IconMenuChat className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Trang chủ')}</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <IconMinus className="w-4 h-5 flex-none hidden" />
                                <span>{t('quản lý')}</span>
                            </h2>
                            <li className="nav-item">
                                <ul>
                                    {/* Show all items if role is 2 */}
                                    {role === '2' && (
                                        <>
                                            <li className="nav-item">
                                                <NavLink to="/product/product-managent" className="group">
                                                    <div className="flex items-center">
                                                        <IconMenuChat className="group-hover:!text-primary shrink-0" />
                                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Sản Phẩm')}</span>
                                                    </div>
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/categoriesmanagent" className="group">
                                                    <div className="flex items-center">
                                                        <IconMenuChat className="group-hover:!text-primary shrink-0" />
                                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Danh mục sản phẩm')}</span>
                                                    </div>
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/orderManagent" className="group">
                                                    <div className="flex items-center">
                                                        <IconMenuChat className="group-hover:!text-primary shrink-0" />
                                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Đơn hàng')}</span>
                                                    </div>
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/payonlineManagent" className="group">
                                                    <div className="flex items-center">
                                                        <IconMenuChat className="group-hover:!text-primary shrink-0" />
                                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Thanh toán trực tuyến')}</span>
                                                    </div>
                                                </NavLink>
                                            </li>
                                        </>
                                    )}
                                    {/* Show only 'Sản Phẩm' if role is 3 */}
                                    {role === '3' && (
                                        <>
                                            <li className="nav-item">
                                                <NavLink to="/product/product-managent" className="group">
                                                    <div className="flex items-center">
                                                        <IconMenuChat className="group-hover:!text-primary shrink-0" />
                                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Sản Phẩm')}</span>
                                                    </div>
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to="/categoriesmanagent" className="group">
                                                    <div className="flex items-center">
                                                        <IconMenuChat className="group-hover:!text-primary shrink-0" />
                                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Danh mục sản phẩm')}</span>
                                                    </div>
                                                </NavLink>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
