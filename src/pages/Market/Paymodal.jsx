import React, { useState } from "react";
import {
  showConfirmationMessage,
  showErrorMessage,
  showSuccessMessage,
} from "../../components/SwalMessages";
import { mainAPI } from "../../components/mainAPI";
import swal from "sweetalert";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";

const Paymodal = ({ setShowpay, cargoId, driverPhone }) => {

  const [weybill, setWeybill] = useState("");
  const [f1form, setF1form] = useState("");
  const [amount, setAmount] = useState("");
  const apiPay = `${mainAPI}/Api/Payment/ToDriver`;
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const [loading, setLoading] = useState(false);
  const hideModal = () => {
    const modal = document.getElementById("pay-manage");
    window.onclick = (event) => {
      if (event.target == modal) {
        setShowpay(false);
      }
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weybill) {
      swal("Required", "WayBill is required ", "danger");
      return;
    }
    if (!f1form) {
      swal("Required", "F1 From is required", "danger");
      return;
    }
    const confirm = await showConfirmationMessage();
   
  };
  const payDriver = async () => {
    const formData = new FormData();
    formData.append("weybill", weybill);
    formData.append("f1Form", f1form);
    formData.append("amount", amount);
    formData.append("driverPhone", driverPhone);
    formData.append("cargoId", cargoId);
    
    setLoading(true);
    try {
      const res = await axios.post(apiPay, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`,
        },
      });
      localStorage.setItem("message", JSON.stringify(res.data["message"]));
      const mess = localStorage.getItem("message");
      if (res.status == 200) {
        showSuccessMessage({ message: mess });
        setShowpay(false)
      } else {
        swal("paing Failed", mess || "Server respond 500", "error");
      }
    } catch (e) {
      showErrorMessage({ message: e.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="manage-modal pay-modal"
      id="pay-manage"
      onClick={() => hideModal()}
    >
      {loading && <LoadingPage message={"payment on process"} />}
      <div className="manage-modal-content">
        <div
          className="modal-title mb-1"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p className="">Pay Driver</p>
          <p
            onClick={() => setShowpay(false)}
            style={{
              cursor: "pointer",
            }}
          >
            X
          </p>
        </div>
        <div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <label>WayBill</label>
            <input
              type="file"
              name="waybill"
              accept="image/*"
              onChange={(e) => setWeybill(e.target.files[0])}
              required
            />
            <label>F1 Form</label>
            <input
              type="file"
              name="f1form"
              accept="image/*"
              onChange={(e) => setF1form(e.target.files[0])}
              required
            />

            <label>Amount</label>
            <input
              type="text"
              name="amount"
              placeholder="Price"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button className=" btn w-300 mx-auto btn-bg-blue" onClick={()=>payDriver()}>Pay</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Paymodal;
