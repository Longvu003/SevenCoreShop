import Dropdown from '../components/Dropdown';
import { useDispatch } from 'react-redux';
import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { setPageTitle } from '../store/themeConfigSlice';
import IconPlus from '../components/Icon/IconPlus';
import IconHorizontalDots from '../components/Icon/IconHorizontalDots';
import { useAdController } from '../controller/AdController';
import { AdModel } from '../model/AdModel';
import IconX from '../components/Icon/IconX';
import IconCalendar from '../components/Icon/IconCalendar';
import IconTag from '../components/Icon/IconTag';
import IconEdit from '../components/Icon/IconEdit';
import IconTrashLines from '../components/Icon/IconTrashLines';

const Advertisement = () => {
    const dispatch = useDispatch();
    const { getAllAds, deleteAdbyid, createAd, updateAd } = useAdController();
    const [ads, setAds] = useState<AdModel[]>([]);
    const [editModal, setEditModal] = useState(false);
    const [adParams, setAdParams] = useState<AdModel>({
        _id: '',
        title: '',
        tag: '',
        description: '',
        image: null,
        createdAt: '',
        updatedAt: '',
    });

    // Fetch ads
    const fetchAds = async () => {
        try {
            const response = await fetch('http://localhost:7777/ads');
            const data = await response.json();
            if (data) {
                setAds(Array.isArray(data) ? data : [data]);
            } else {
                showMessage('Không tìm thấy quảng cáo', 'error');
            }
        } catch (error) {
            showMessage('Lỗi khi tải quảng cáo', 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Quản Lý Quảng Cáo'));
        fetchAds();
    }, [dispatch]);

    const handleDeleteAd = async (id: string) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa quảng cáo này không?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });
    
        if (result.isConfirmed) {
            try {
                const deleteResult = await deleteAdbyid(id); // Sử dụng hàm DeleteAd
                showMessage('Xóa Thành Công', 'success');
                fetchAds();
            } catch (error) {
                showMessage((error as any).message || 'Xóa Thất Bại', 'error');
            }
        }
    };

    const editAd = (ad: AdModel) => {
        setAdParams(ad);
        setEditModal(true);
    };

    const handleCreateOrUpdateAd = async () => {
        if (!adParams.title || !adParams.description || !adParams.image) {
            showMessage('Tiêu đề, mô tả và hình ảnh không được để trống', 'error');
            return;
        }
    
        let result;
        if (adParams._id) {
            // Cập nhật quảng cáo
            result = await updateAd(adParams._id, adParams);
            if ((result as { status: boolean }).status === true) {
                showMessage('Cập Nhật Quảng Cáo Thành Công', 'success');
            } else {
                if (typeof result === 'object' && result !== null && 'message' in result) {
                    showMessage((result as { message: string }).message || 'Cập Nhật Quảng Cáo Thất Bại', 'error');
                } else {
                    showMessage('Cập Nhật Quảng Cáo Thất Bại', 'error');
                }
            }
        } else {
            // Thêm quảng cáo mới
            result = await createAd(adParams);
            if ((result as { status: boolean }).status === true) {
                showMessage('Thêm Quảng Cáo Thành Công', 'success');
            } else {
                showMessage((result as { message: string }).message || 'Thêm Quảng Cáo Thất Bại', 'error');
            }
        }
    
        fetchAds(); // Tải lại danh sách quảng cáo sau khi thêm/cập nhật
        setEditModal(false);
        setAdParams({
            _id: '',
            title: '',
            tag: '',
            description: '',
            image: null,
            createdAt: '',
            updatedAt: '',
        }); // Reset form
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
        setAdParams({ ...adParams, [id]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAdParams({ ...adParams, image: file });
        }
    };

    return (
        <div className="p-5">
            <div className="mb-5">
                <button
                    type="button"
                    className="btn btn-primary flex items-center"
                    onClick={() => {
                        setAdParams({
                            _id: '',
                            title: '',
                            tag: '',
                            description: '',
                            image: null,
                            createdAt: '',
                            updatedAt: '',
                        });
                        setEditModal(true);
                    }}
                >
                    <IconPlus className="w-5 h-5 ltr:mr-3 rtl:ml-3" />
                    Thêm Quảng Cáo
                </button>
            </div>
            <div className="relative pt-5">
                <div className="perfect-scrollbar h-full -mx-2">
                    <div className="overflow-x-auto flex items-start flex-nowrap gap-5 pb-2 px-2">
                        {ads.map((ad: AdModel) => {
                            return (
                                <div key={ad._id} className="panel w-80 flex-none" data-group={ad._id}>
                                    <div className="flex justify-between mb-5">
                                        <h4 className="text-base font-semibold">{ad.title}</h4>
                                        <div className="flex items-center">
                                            <button onClick={() => editAd(ad)} type="button" className="hover:text-primary ltr:mr-2 rtl:ml-2">
                                                <IconEdit />
                                            </button>
                                            <div className="dropdown">
                                                <Dropdown
                                                    offset={[0, 5]}
                                                    placement={'bottom-start'}
                                                    button={<IconHorizontalDots className="opacity-70 hover:opacity-100" />}
                                                >
                                                    <ul>
                                                        <li>
                                                            <button type="button" onClick={() => ad._id && handleDeleteAd(ad._id)}>
                                                                Xóa
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shadow bg-[#f4f4f4] dark:bg-[#121c2c] p-3 pb-5 rounded-md mb-5 space-y-3 cursor-move">
                                        {ad.image && typeof ad.image === 'string' && (
                                            <img src={`http://localhost:7777/${ad.image}`} alt="images" className="h-32 w-full object-cover rounded-md" />
                                        )}
                                        <div className="text-base font-medium">{ad.title}</div>
                                        <p className="break-all">{ad.description}</p>
                                        <div className="flex gap-2 items-center flex-wrap">
                                            {ad.tag && (
                                                <div className="btn px-2 py-1 flex btn-outline-primary">
                                                    <IconTag className="shrink-0" />
                                                    <span className="ltr:ml-2 rtl:mr-2">{ad.tag}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium flex items-center hover:text-primary">
                                                <IconCalendar className="ltr:mr-3 rtl:ml-3 shrink-0" />
                                                <span>{new Date(ad.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* Modal thêm/sửa quảng cáo */}
            <Transition appear show={editModal} as={Fragment}>
                <Dialog as="div" open={editModal} onClose={() => setEditModal(false)} className="relative z-50">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                <button
                                    type="button"
                                    onClick={() => setEditModal(false)}
                                    className="absolute top-4 ltr:right-4 rtl:left-4 text-white-dark hover:text-dark"
                                >
                                    <IconX />
                                </button>
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">{adParams._id ? 'Sửa Quảng Cáo' : 'Thêm Quảng Cáo'}</div>
                                <div className="p-5">
                                    <form onSubmit={(e) => { e.preventDefault(); handleCreateOrUpdateAd(); }}>
                                        <div className="grid gap-5">
                                            <div>
                                                <label htmlFor="title">Tiêu đề</label>
                                                <input id="title" value={adParams.title} onChange={handleChange} type="text" className="form-input" placeholder="Nhập tiêu đề" />
                                            </div>
                                            <div>
                                                <label htmlFor="tag">Tag</label>
                                                <input id="tag" value={adParams.tag} onChange={handleChange} type="text" className="form-input" placeholder="Nhập tag" />
                                            </div>
                                            <div>
                                                <label htmlFor="description">Mô tả</label>
                                                <textarea
                                                    id="description"
                                                    value={adParams.description}
                                                    onChange={handleChange}
                                                    className="form-textarea min-h-[130px]"
                                                    placeholder="Nhập mô tả"
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label htmlFor="image">Hình ảnh</label>
                                                <input id="image" onChange={handleFileChange} type="file" className="form-input" placeholder="Chọn hình ảnh" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center mt-8">
                                            <button onClick={() => setEditModal(false)} type="button" className="btn btn-outline-danger">
                                                Hủy
                                            </button>
                                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                {adParams._id ? 'Cập Nhật Quảng Cáo' : 'Thêm Quảng Cáo'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Advertisement;
