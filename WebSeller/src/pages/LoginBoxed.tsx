import { UserModel } from '../model/UserModel'; // Import UserModel từ nơi định nghĩa
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../store/themeConfigSlice';
import IconMail from '../components/Icon/IconMail';
import IconLockDots from '../components/Icon/IconLockDots';
import { loginUser } from '../service/UserService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const LoginBoxed = () => {
    const MySwal = withReactContent(Swal);

    const [datauser, setdatauser] = useState<Partial<UserModel>>({
        email: '',
        password: ''
    });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Login Boxed'));
    }, [dispatch]); // Thêm dependency để tránh cảnh báo

    const navigate = useNavigate();
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();
        const responsive: any = await loginUser(datauser as UserModel);

        if (responsive.status === true) {
            console.log('Đăng nhập thành công');
            console.log('ID người dùng:', responsive.data._id);
            localStorage.setItem('usertoken', responsive.data._id); // Lưu token
            localStorage.setItem('userRole', responsive.data.role); // Lưu vai trò

            // Xử lý vai trò
            switch (String(responsive.data.role)) {
                case "1":
                    MySwal.fire({
                        title: 'Đăng Nhập Thành Công',
                        text: 'Chào mừng user!',
                        icon: 'success',
                    });
                    navigate('/'); // Điều hướng đến dashboard của user
                    window.location.reload();
                    break;
                case "2":
                    MySwal.fire({
                        title: 'Đăng Nhập Thành Công',
                        text: 'Chào mừng admin!',
                        icon: 'success',
                    });
                    navigate('/'); // Điều hướng đến dashboard của admin
                    window.location.reload();
                    break;
                case "3":
                    MySwal.fire({
                        title: 'Đăng Nhập Thành Công',
                        text: 'Chào mừng seller!',
                        icon: 'success',
                    });
                    navigate('/'); // Điều hướng đến dashboard của seller
                    window.location.reload();
                    break;
                default:
                    MySwal.fire({
                        title: 'Lỗi Đăng Nhập',
                        text: 'Vai trò không xác định.',
                        icon: 'error',
                    });
                    break;
            }
        } else {
            console.log('Đăng nhập thất bại');
            MySwal.fire({
                title: 'Lỗi Đăng Nhập',
                text: 'Thông tin đăng nhập không chính xác.',
                icon: 'error',
            });
        }
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/26800.jpg" alt="image" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[870px] rounded-md ">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">ĐĂNG NHẬP</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Nhập mật khẩu và email của bạn</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input id="username" type="text" placeholder="Nhập Email Của Bạn"
                                            onChange={(e) => setdatauser({ ...datauser, email: e.target.value })}
                                            className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Mật Khẩu</label>
                                    <div className="relative text-white-dark">
                                        <input id="Password" type="password" placeholder="Nhập Mật Khẩu"
                                            onChange={(e) => setdatauser({ ...datauser, password: e.target.value })}
                                            className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn w-full !mt-6 border-0 uppercase bg-[#2196F3] text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-[#1976D2]"
                                >
                                    Đăng Nhập
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginBoxed;
