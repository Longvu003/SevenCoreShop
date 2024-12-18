import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import { useloginUser } from '../controller/UserController';
import { UserModel } from '../model/UserModel';

const Contacts = () => {
    const { getAllUser, deleteUserbyId, updateUserbyId, lockUserbyId, unlockUserbyId } = useloginUser();
    const [dataUser, setDataUser] = useState<UserModel[]>([]);
    const [editModal, setEditModal] = useState(false);
    const [params, setParams] = useState<UserModel | any>({
        _id: '',
        name: '',
        email: '',
        phone: '',
        role: '',
        address: '',
    });

    const showData = async () => {
        const data: any = await getAllUser();
        setDataUser(data['data']);
    };

    useEffect(() => {
        showData();
    }, []);

    const deleteUser = async (id: string) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa người dùng này không?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            const deleteResult: any = await deleteUserbyId(id);
            if (deleteResult.status === true) {
                showMessage('Xóa Thành Công', 'success');
            } else {
                showMessage('Xóa Thất Bại', 'error');
            }
            showData(); // Cập nhật danh sách người dùng sau khi xóa
        }
    };

    const editUser = (user: UserModel) => {
        setParams(user); // Gán dữ liệu người dùng cần sửa vào state
        setEditModal(true); // Mở modal chỉnh sửa
    };

    const handleUpdateUser = async () => {
        if (!params.name || !params.email) {
            showMessage('Tên và Email không được để trống', 'error');
            return;
        }

        const result: any = await updateUserbyId(params._id, params);

        if (result.status === true) {
            showMessage('Cập Nhật Thành Công', 'success');
        } else {
            showMessage(result.message || 'Cập Nhật Thất Bại', 'error');
        }

        setEditModal(false);
        showData(); // Cập nhật danh sách người dùng
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setParams({ ...params, [id]: value });
    };

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Quản Lý Người Dùng'));
    }, [dispatch]);

    // Hàm khóa người dùng
    const handleLockUser = async (id: string) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn khóa người dùng này không?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Khóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            const lockResult: any = await lockUserbyId(id);
            if (lockResult.status === true) {
                showMessage('Khóa Thành Công', 'success');
            } else {
                showMessage('Khóa Thất Bại', 'error');
            }
            showData(); // Cập nhật danh sách người dùng
        }
    };

    // Hàm mở khóa người dùng
    const handleUnlockUser = async (id: string) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn mở khóa người dùng này không?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Mở Khóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            const unlockResult: any = await unlockUserbyId(id);
            if (unlockResult.status === true) {
                showMessage('Mở Khóa Thành Công', 'success');
            } else {
                showMessage('Mở Khóa Thất Bại', 'error');
            }
            showData(); // Cập nhật danh sách người dùng
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Quản Lý Người Dùng</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    {/* Vùng tìm kiếm nếu cần */}
                </div>
            </div>
            <div className="mt-5 panel p-0 border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Địa Chỉ</th>
                                <th>Điện Thoại</th>
                                <th className="!text-center">Hoạt Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataUser.map((user) => (
                                <tr key={String(user._id)}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.address}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <div className="flex gap-4 items-center justify-center">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => editUser(user)}
                                            >
                                                Chỉnh Sửa
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => deleteUser(String(user._id))}
                                            >
                                                Xóa
                                            </button>
                                            {/* Nút khóa */}
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleLockUser(String(user._id))}
                                            >
                                                Khóa
                                            </button>
                                            {/* Nút mở khóa */}
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() => handleUnlockUser(String(user._id))}
                                            >
                                                Mở Khóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal chỉnh sửa người dùng */}
            <Transition appear show={editModal} as={Fragment}>
                <Dialog as="div" open={editModal} onClose={() => setEditModal(false)} className="relative z-[51]">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    {/* Nút Đóng Modal */}
                                    <button
                                        type="button"
                                        onClick={() => setEditModal(false)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                    </button>
                                    {/* Tiêu Đề Modal */}
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] px-5 py-3">
                                        Cập Nhật Thông Tin Người Dùng
                                    </div>
                                    {/* Nội Dung Modal */}
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="name">Tên</label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    placeholder="Nhập tên"
                                                    className="form-input"
                                                    value={params.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="email">Email</label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    placeholder="Nhập email"
                                                    className="form-input"
                                                    value={params.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="phone">Số Điện Thoại</label>
                                                <input
                                                    id="phone"
                                                    type="text"
                                                    placeholder="Nhập số điện thoại"
                                                    className="form-input"
                                                    value={params.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="address">Địa Chỉ</label>
                                                <textarea
                                                    id="address"
                                                    rows={3}
                                                    placeholder="Nhập địa chỉ"
                                                    className="form-textarea resize-none min-h-[130px]"
                                                    value={params.address}
                                                    onChange={handleChange}
                                                ></textarea>
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() => setEditModal(false)}
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary ml-4"
                                                    onClick={handleUpdateUser}
                                                >
                                                    Cập nhật
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

        </div>
    );
};

export default Contacts;