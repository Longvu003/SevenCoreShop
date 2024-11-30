import { useState } from 'react';
import { categoryController } from '../controller/CategoryController';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


export default function CategoryUpdate() {
    const MySwal = withReactContent(Swal);
    const { createCategories } = categoryController();
    const [dataCategories, setDataCategories] = useState<any>({
        name: '',
        description: '',
        image: '',
    });

    const uploadToCloudinary = async () => {
        try {
            const fileInput = document.getElementById('categoriesImages') as HTMLInputElement;
            const file = fileInput?.files?.[0];
            if (file) {
                const data = new FormData();
                data.append('file', file);
                data.append('upload_preset', 'ml_default');

                const response = await fetch('https://api.cloudinary.com/v1_1/dlngxbn4l/image/upload', {
                    method: 'POST',
                    body: data
                });

                const result = await response.json();
                console.log('Uploaded image:', result['url']);
                setImages((prevImages) => [...prevImages, result['url']]);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    
    const removeImage = (img: string) => {
        setImages((prevImages) => prevImages.filter(item => item !== img));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataCategories({
            ...dataCategories,
            [e.target.name]: e.target.value
        });
    };
    const clickCreateNew = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res: any = await createCategories(dataCategories);
        console.log(res);   
        if (res.status === true) {
            MySwal.fire({
                title: 'Thành công',
                text: 'Thêm mới danh mục sản phẩm thành công',
                icon: 'success',
            }).then(() => {
                location.href = "/categoriesmanagent";
            });
        } else {
            MySwal.fire({
                title: 'Thất bại',
                text: 'Tên danh mục đã tồn tại',
                icon: 'error',
            });
        }
    };
    

    return (
        <form className="space-y-5" onSubmit={clickCreateNew}>
            <div>
                <label htmlFor="productName">Tên Danh mục sản phẩm</label>
                <input id="Name" type="text" name="name" className="form-input" required onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="productDescription">Mô Tả danh mục sản phẩm</label>
                <input id="Description" type="text" name="description" className="form-input" required  onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="categoriesImages">Hình ảnh</label>
                <input
                    id="categoriesImages"
                    type="file"
                    name="images"
                     onChange={uploadToCloudinary}
                    className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
                    required
                />
                <div className="image-preview">
                    {images.map((img, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                            <img
                                src={img}
                                alt="categories"
                                style={{ width: 150, height: 150, objectFit: 'cover' }}
                            />
                            <button
                                onClick={() => removeImage(img)}
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    left: 10,
                                    borderRadius: 15,
                                    height: 30,
                                    width: 30
                                }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>   
            <button type="submit" className="btn btn-primary !mt-6">Lưu</button>
     
        </form>
    );
}
