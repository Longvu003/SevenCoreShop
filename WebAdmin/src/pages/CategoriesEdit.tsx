import { useState, useEffect } from 'react';
import { categoryController } from '../controller/CategoryController';
import { useParams ,useLocation} from "react-router-dom";

export default function CategoryEdit() {
    const { getCategoriesById, updateCategories } = categoryController();
    const location = useLocation();
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const id:any = urlParams.get('id');    // const history = useHistory();
    const [dataCategories, setDataCategories] = useState<any>({
        name: '',
        description: '',
    });

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res:any = await getCategoriesById(id);
                console.log(res.data);
                if (res.status) {
                    setDataCategories(() => ({
                        name: res.data.name,
                        description: res.data.description
                    }));
                    
                } else {
                    alert("Failed to fetch category data");
                }
            } catch (error) {
                console.error("Error fetching category data:", error);
            }
        };
        fetchCategory();
    }, [id]);

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataCategories({
            ...dataCategories,
            [e.target.name]: e.target.value
        });
    };
    const clickUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if(id===null){
                alert("Please fill in the form");
                return;
            }
            const res: any = await updateCategories(id, dataCategories);
            if (res.status) {
                alert("Update Categories Success");
                // history.push("/categoriesmanagent");
            } else {
                alert("Update Categories Fail");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Update Categories Fail");
        }
    };
    

    return (
        <form className="space-y-5" onSubmit={clickUpdate}>
            <div>
                <label htmlFor="productName">Categories Name</label>
                <input id="Name" type="text" name="name" className="form-input"value={dataCategories.name} required onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="productDescription">Categories Description</label>
                <input id="Description" type="text" name="description" className="form-input" required value={dataCategories.description}  onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary !mt-6">Submit</button>
        </form>
    );
}
