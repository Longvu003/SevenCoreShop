import { useState,useEffect } from 'react';
import { userProducts } from '../controller/ProductController';
import { Category } from '../model/CategoriesModel';
import { categoryController } from '../controller/CategoryController';
export default function ProductUpdate() {
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const { getCategories, deleteCategoriesById,  } = categoryController();
    const [dataCategorie, setDataCategorie] = useState<Category[]>([]);
    const id: any = urlParams.get('id');   
    console.log(id); 
    const { editProduct,getProductById  } = userProducts();
    const [dataProduct, setDataProduct] = useState<any>({
        name: '',
        price: '',
        quantity: '',
        description: '',
        category: {
        category_name: '',
        category_id: '' 
        },
        images: ''
    });
    const showData = async () => {
        const data: any = await getCategories();
        console.log(data.data);
        setDataCategorie(data.data);
    };
    useEffect(() => {
        showData();
        console.log("dataCategorie"+dataCategorie);
        const fetchProduct = async () => {
            try {
                const res: any = await getProductById(id);
                console.log("giá trị res"+res.data.images);
                if (res.status) {
                    setDataProduct({
                        name: res.data.name,
                        price: res.data.price,
                        quantity: res.data.quantity,
                        description: res.data.description,
                        category: {
                            category_name: res.data.category.category_name,
                            category_id: res.data.category._id
                        },
                        images: res.data.images
                    });
                } else {
                    alert("Failed to fetch product data");
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
                alert("Error fetching product data");
            }
        };
        fetchProduct();
    }, [id]);

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value } = e.target;
    //     if (name.includes('category.')) {
    //         const categoryField = name.split('.')[1];
    //         setDataProduct((prevState: any) => ({
    //             ...prevState,
    //             category: {
    //                 ...prevState.category,
    //                 [categoryField]: value
    //             }
    //         }));
    //     } else {
    //         setDataProduct({
    //             ...dataProduct,
    //             [name]: value
    //         });
    //     }
    // };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;

        // console.log('gias tri name'+name)
        // console.log('gia tri value'+value);
        if (name.includes('category.')) {
          const categoryField = name.split('.')[1];
          console.log(categoryField);
          setDataProduct((prevState: any) => ({
            ...prevState,
            category: {
              ...prevState.category,
              [categoryField]: value
            }
          }));
        } else if (name === 'images') {
          setDataProduct({
            ...dataProduct,
            images: files ? Array.from(files).map(file => URL.createObjectURL(file)) : []
          });
        } else {
          setDataProduct({
            ...dataProduct,
            [name]: value
          });
        }
      };

    const clickUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(dataProduct)
        try {
            const res: any = await editProduct(id, dataProduct);
            if (res.status) {
                alert("Update Product Success");
                //history.push("/productmanagent");
            } else {
                alert("Update Product Fail");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Update Product Fail");
        }
    };

    return (
        <form className="space-y-5" onSubmit={clickUpdate}>
            <div>
                <label htmlFor="productName">Tên sản phẩm</label>
                <input
                    id="productName"
                    type="text"
                    name="name"
                    className="form-input"
                    value={dataProduct.name}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="productPrice">Giá bán</label>
                <input
                    id="productPrice"
                    type="number"
                    name="price"
                    className="form-input"
                    value={dataProduct.price}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="productQuantity">Số lượng</label>
                <input
                    id="productQuantity"
                    type="number"
                    name="quantity"
                    className="form-input"
                    value={dataProduct.quantity}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="productDescription">Product Description</label>
                <input
                    id="productDescription"
                    type="text"
                    name="description"
                    className="form-input"
                    value={dataProduct.description}
                    required
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="productCategory">Product Categories</label>
                <select
                    id="productCategory"
                    name="category.category_name"
                    className="form-select"
                    value={dataProduct.category.category_name} // Set giá trị mặc định của category là category của sản phẩm
                    required
                    onChange={handleChange}
                >
                    {dataCategorie.map((Category) => (
                        <option key={Category._id} value={Category._id}>
                            {Category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="productImages">Images</label>
                <input
                    id="productImages"
                    type="file"
                    name="images"
                    multiple
                    className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
                    onChange={handleChange}
                />
                 <div style={{ margin: '10px' }}>
                 <img src={dataProduct.images[0]} alt="Product" style={{ width: '200px' }} />
                 </div>
            </div>
            <button type="submit" className="btn btn-primary !mt-6">Submit</button>
        </form>
    );
}
