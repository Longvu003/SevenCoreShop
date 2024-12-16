import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { toggleAnimation, toggleLayout, toggleMenu, toggleNavbar, toggleRTL, toggleTheme, toggleSemidark } from '../../store/themeConfigSlice';
import IconSettings from '../Icon/IconSettings';
import IconX from '../Icon/IconX';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';

const Setting = () => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    const [showCustomizer, setShowCustomizer] = useState(false);

    return (
        <div>
            <div className={`${(showCustomizer && '!block') || ''} fixed inset-0 bg-[black]/60 z-[51] px-4 hidden transition-[display]`} onClick={() => setShowCustomizer(false)}></div>

            <nav
                className={`${
                    (showCustomizer && 'ltr:!right-0 rtl:!left-0') || ''
                } bg-white fixed ltr:-right-[400px] rtl:-left-[400px] top-0 bottom-0 w-full max-w-[400px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 z-[51] dark:bg-black p-4`}
            >
                <button
                    type="button"
                    className="bg-primary ltr:rounded-tl-full rtl:rounded-tr-full ltr:rounded-bl-full rtl:rounded-br-full absolute ltr:-left-12 rtl:-right-12 top-0 bottom-0 my-auto w-12 h-10 flex justify-center items-center text-white cursor-pointer"
                    onClick={() => setShowCustomizer(!showCustomizer)}
                >
                    <IconSettings className="animate-[spin_3s_linear_infinite] w-5 h-5" />
                </button>

                <div className="overflow-y-auto overflow-x-hidden perfect-scrollbar h-full">
                    <div className="text-center relative pb-5">
                        <button type="button" className="absolute top-0 ltr:right-0 rtl:left-0 opacity-30 hover:opacity-100 dark:text-white" onClick={() => setShowCustomizer(false)}>
                            <IconX className="w-5 h-5" />
                        </button>

                        <h4 className="mb-1 dark:text-white">TÙY CHỈNH GIAO DIỆN</h4>
                    </div>

                    <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
                        <h5 className="mb-1 text-base dark:text-white leading-none">Hiển Thị</h5>
                        <p className="text-white-dark text-xs">Chỉnh Nền Sáng Tối.</p>
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            <button type="button" className={`${themeConfig.theme === 'light' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleTheme('light'))}>
                                <IconSun className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                Sáng
                            </button>

                            <button type="button" className={`${themeConfig.theme === 'dark' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleTheme('dark'))}>
                                <IconMoon className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                Tối
                            </button>

                            <button type="button" className={`${themeConfig.theme === 'system' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleTheme('system'))}>
                                <IconLaptop className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                Hệ Thống
                            </button>
                        </div>
                    </div>

                    <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
                        <h5 className="mb-1 text-base dark:text-white leading-none">Vị Trí Điều Hướng</h5>
                        <p className="text-white-dark text-xs">Chọn vị trí điều hướng chính cho trang web của bạn.</p>
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            <button type="button" className={`${themeConfig.menu === 'horizontal' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleMenu('horizontal'))}>
                                Nằm Ngang
                            </button>

                            <button type="button" className={`${themeConfig.menu === 'vertical' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => dispatch(toggleMenu('vertical'))}>
                                Nằm Dọc
                            </button>

                            <button
                                type="button"
                                className={`${themeConfig.menu === 'collapsible-vertical' ? 'btn-primary' : 'btn-outline-primary'} btn`}
                                onClick={() => dispatch(toggleMenu('collapsible-vertical'))}
                            >
                                Thu Gọn
                            </button>
                        </div>
                        <div className="mt-5 text-primary">
                            <label className="inline-flex mb-0">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={themeConfig.semidark === true || themeConfig.semidark === 'true'}
                                    onChange={(e) => dispatch(toggleSemidark(e.target.checked))}
                                />
                                <span>Nửa tối (Thanh bên & Tiêu đề)</span>
                            </label>
                        </div>
                    </div>

                    <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
                        <h5 className="mb-1 text-base dark:text-white leading-none">Bố Cục</h5>
                        <p className="text-white-dark text-xs">Chọn bố cục cho trang web của bạn.</p>
                        <div className="flex gap-2 mt-3">
                            <button
                                type="button"
                                className={`${themeConfig.layout === 'boxed-layout' ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`}
                                onClick={() => dispatch(toggleLayout('boxed-layout'))}
                            >
                                Khối
                            </button>

                            <button type="button" className={`${themeConfig.layout === 'full' ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`} onClick={() => dispatch(toggleLayout('full'))}>
                                Toàn Bộ
                            </button>
                        </div>
                    </div>

                    <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
                        <h5 className="mb-1 text-base dark:text-white leading-none">Hướng Của Văn Bản</h5>
                        <p className="text-white-dark text-xs">Chọn hướng cho văn bản.</p>
                        <div className="flex gap-2 mt-3">
                            <button type="button" className={`${themeConfig.rtlClass === 'ltr' ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`} onClick={() => dispatch(toggleRTL('ltr'))}>
                                Trái Sang Phải
                            </button>

                            <button type="button" className={`${themeConfig.rtlClass === 'rtl' ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`} onClick={() => dispatch(toggleRTL('rtl'))}>
                                Phải Sang Trái
                            </button>
                        </div>
                    </div>

                    <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
                        <h5 className="mb-1 text-base dark:text-white leading-none">Kiểu Thanh Điều Hướng</h5>
                        <p className="text-white-dark text-xs">Dính hoặc Nổi.</p>
                        <div className="mt-3 flex items-center gap-3 text-primary">
                            <label className="inline-flex mb-0">
                                <input
                                    type="radio"
                                    checked={themeConfig.navbar === 'navbar-sticky'}
                                    value="navbar-sticky"
                                    className="form-radio"
                                    onChange={() => dispatch(toggleNavbar('navbar-sticky'))}
                                />
                                <span>Dính</span>
                            </label>
                            <label className="inline-flex mb-0">
                                <input
                                    type="radio"
                                    checked={themeConfig.navbar === 'navbar-floating'}
                                    value="navbar-floating"
                                    className="form-radio"
                                    onChange={() => dispatch(toggleNavbar('navbar-floating'))}
                                />
                                <span>Nổi</span>
                            </label>
                            <label className="inline-flex mb-0">
                                <input
                                    type="radio"
                                    checked={themeConfig.navbar === 'navbar-static'}
                                    value="navbar-static"
                                    className="form-radio"
                                    onChange={() => dispatch(toggleNavbar('navbar-static'))}
                                />
                                <span>Tĩnh</span>
                            </label>
                        </div>
                    </div>

                    <div className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
                        <h5 className="mb-1 text-base dark:text-white leading-none">Hiệu Ứng Chuyển Đổi</h5>
                        <p className="text-white-dark text-xs">Hoạt ảnh của nội dung chính.</p>
                        <div className="mt-3">
                            <select className="form-select border-primary text-primary" value={themeConfig.animation} onChange={(e) => dispatch(toggleAnimation(e.target.value))}>
                                <option value=" ">Không Có</option>
                                <option value="animate__fadeIn">Giảm</option>
                                <option value="animate__fadeInDown">Giảm Dần</option>
                                <option value="animate__fadeInUp">Mờ Dần</option>
                                <option value="animate__fadeInLeft">Mờ Dần Sang Trái</option>
                                <option value="animate__fadeInRight">Mờ Dần Sang Phải</option>
                                <option value="animate__slideInDown">Trượt Xuống</option>
                                <option value="animate__slideInLeft">Trượt Trái</option>
                                <option value="animate__slideInRight">Trượt Phải</option>
                                <option value="animate__zoomIn">Phóng To</option>
                            </select>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Setting;
