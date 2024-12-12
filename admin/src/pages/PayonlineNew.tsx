import { useState } from "react";
import { payOnlineController } from "../controller/PayOnlineController";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function NewPayOnline() {
  const { createPayOnline } = payOnlineController();
  const [images, setImages] = useState<string[]>([]);
  const [dataPayOnline, setDataPayOnline] = useState<any>({
    bank: "",
    acc_holder: "",
    acc_number: "",
  });

  const uploadToCloudinary = async () => {
    try {
      const fileInput = document.getElementById("payOnlineImages") as HTMLInputElement;
      const files = fileInput?.files;
      if (files) {
        const uploadPromises = Array.from(files).map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "ml_default");

          const response = await fetch(
            "https://api.cloudinary.com/v1_1/dlngxbn4l/image/upload",
            {
              method: "POST",
              body: data,
            }
          );

          const result = await response.json();
          return result["url"];
        });

        const urls = await Promise.all(uploadPromises);
        setImages((prevImages) => [...prevImages, ...urls]);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const removeImage = (img: string) => {
    setImages((prevImages) => prevImages.filter((item) => item !== img));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataPayOnline({
      ...dataPayOnline,
      [e.target.name]: e.target.value,
    });
  };

  const clickCreateNew = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!dataPayOnline.bank.trim() || !dataPayOnline.acc_holder.trim() || !dataPayOnline.acc_number.trim()) {
      MySwal.fire({
        title: "Lỗi",
        text: "Ngân hàng, chủ tài khoản và số tài khoản không được để trống!",
        icon: "error",
      });
      return; 
    }

    if (images.length === 0) {
      MySwal.fire({
        title: "Lỗi",
        text: "Vui lòng tải lên ít nhất một hình ảnh!",
        icon: "error",
      });
      return; 
    }

    try {
      const newPayOnline = {
        ...dataPayOnline,
        images, 
      };

      const res: any = await createPayOnline(newPayOnline);
      if (res.status === true) {
        MySwal.fire({
          title: "Thành công",
          text: "Thêm mới mục thanh toán thành công",
          icon: "success",
        }).then(() => {
          location.href = "/payonlineManagent";
        });
      } else {
        MySwal.fire({
          title: "Thất bại",
          text: "Thêm mới mục thanh toán thất bại",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error creating pay online entry:", error);
      MySwal.fire({
        title: "Lỗi",
        text: "Thêm mới mục thanh toán thất bại",
        icon: "error",
      });
    }
  };

  return (
    <form className="space-y-5" onSubmit={clickCreateNew}>
      <div>
        <label htmlFor="bank">Ngân hàng</label>
        <input
          id="bank"
          type="text"
          name="bank"
          className="form-input"
          required
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="acc_holder">Chủ tài khoản</label>
        <input
          id="acc_holder"
          type="text"
          name="acc_holder"
          className="form-input"
          required
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="acc_number">Số tài khoản</label>
        <input
          id="acc_number"
          type="text"
          name="acc_number"
          className="form-input"
          required
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="payOnlineImages">Hình ảnh</label>
        <input
          id="payOnlineImages"
          type="file"
          name="images"
          onChange={uploadToCloudinary}
          className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
          multiple
        />
        <div className="image-preview">
          {images.map((img, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={img}
                alt="payOnline"
                style={{ width: 150, height: 150, objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={() => removeImage(img)}
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  borderRadius: 15,
                  height: 30,
                  width: 30,
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      <button type="submit" className="btn btn-primary !mt-6">
        Lưu
      </button>
    </form>
  );
}