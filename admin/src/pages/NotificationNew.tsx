import { useState } from "react";
import { notificationController } from "../controller/NotificationController";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function NotificationNew() {
  const MySwal = withReactContent(Swal);
  const { createNotification } = notificationController();
  const [dataNotification, setDataNotification] = useState<any>({
    title: "",
    description: "",
    icon: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDataNotification({
      ...dataNotification,
      [e.target.name]: e.target.value,
    });
  };
  

  const clickCreateNew = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!dataNotification?.title?.trim() || !dataNotification?.description?.trim() || !dataNotification?.icon?.trim()) {
        MySwal.fire({
        title: "Lỗi",
        text: "Title danh mục, icon và mô tả không được để trống!",
        icon: "error",
      });
      return; 
    }


    try {
      const newNotificaton = {
        ...dataNotification,
      };

      const res: any = await createNotification(newNotificaton);
      if (res.status === true) {
        MySwal.fire({
          title: "Thành công",
          text: "Thêm mới thông báo thành công",
          icon: "success",
        }).then(() => {
          location.href = "/notification-management";
        });
      } else {
        MySwal.fire({
          title: "Thất bại",
          text: "Title thông báo đã tồn tại",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      MySwal.fire({
        title: "Lỗi",
        text: "Thêm thông báo thất bại",
        icon: "error",
      });
    }
  };

  return (
    <form className="space-y-5" onSubmit={clickCreateNew}>
      <div>
        <label htmlFor="Title">Title thông báo</label>
        <input
          id="Title"
          type="text"
          name="title"
          className="form-input"
          required
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="Description">Mô Tả thông báo</label>
        <input
          id="Description"
          type="text"
          name="description"
          className="form-input"
          required
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="Icon">Icon</label>
        <input
          id="Icon"
          type="text"
          name="icon"
          className="form-input"
          required
          onChange={handleChange}
        />
      </div>


      <button type="submit" className="btn btn-primary !mt-6">
        Lưu
      </button>
    </form>
  );
}
