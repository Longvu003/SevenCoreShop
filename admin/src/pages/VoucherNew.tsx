import { useState } from "react";
import { voucherController } from "../controller/VoucherController";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function NotificationNew() {
  const MySwal = withReactContent(Swal);
  const { createVoucher } = voucherController();
  const [dataVoucher, setDataVoucher] = useState<any>({
    code: "",
    titleVoucher: "",
    discountValue: "",
    minValue: "",
    quantity: "",
    expiryDate: "",
   
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDataVoucher({
      ...dataVoucher,
      [e.target.name]: e.target.value,
    });
  };
  

  const clickCreateNew = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!dataVoucher?.code?.trim() || !dataVoucher?.titleVoucher?.trim() || !dataVoucher?.discountValue?.trim() || !dataVoucher?.minValue?.trim() || !dataVoucher?.quantity?.trim() || !dataVoucher?.expiryDate?.trim()) {
        MySwal.fire({
        title: "Lỗi",
        text: "Code, title Voucher, discount Value và expiry Date không được để trống!",
        icon: "error",
      });
      return; 
    }


    try {
      const newVoucher = {
        ...dataVoucher,
      };

      const res: any = await createVoucher(newVoucher);
      if (res.status === true) {
        MySwal.fire({
          title: "Thành công",
          text: "Thêm mới voucher thành công",
          icon: "success",
        }).then(() => {
          location.href = "/voucher-management";
        });
      } else {
        MySwal.fire({
          title: "Thất bại",
          text: "Code voucher đã tồn tại",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error creating voucher:", error);
      MySwal.fire({
        title: "Lỗi",
        text: "Thêm voucher thất bại",
        icon: "error",
      });
    }
  };

  return (
    <form className="space-y-5" onSubmit={clickCreateNew}>
      <div>
        <label htmlFor="Code">Code voucher</label>
        <input
          id="Code"
          type="text"
          name="code"
          className="form-input"
          value={dataVoucher.code}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="Title">Title voucher</label>
        <input
          id="Title"
          type="text"
          name="titleVoucher"
          className="form-input"
          value={dataVoucher.titleVoucher}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="Discount">Discount voucher</label>
        <input
          id="Discount"
          type="number"
          name="discountValue"
          className="form-input"
          value={dataVoucher.discountValue}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="Minvalue">Min value</label>
        <input
          id="Minvalue"
          type="number"
          name="minValue"
          className="form-input"
          value={dataVoucher.minValue}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="Quantity">Quantity voucher</label>
        <input
          id="Quantity"
          type="number"
          name="quantity"
          className="form-input"
          value={dataVoucher.quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="ExpiryDate">Date voucher</label>
        <input
          id="ExpiryDate"
          type="date"
          name="expiryDate"
          className="form-input"
          value={dataVoucher.expiryDate}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary !mt-6">
        Lưu
      </button>
    </form>
  );
}
