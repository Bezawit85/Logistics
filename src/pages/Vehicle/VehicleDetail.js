import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./vehicledetail.css";
import { MdKeyboardArrowLeft, MdModeEdit } from "react-icons/md";
import swal from "sweetalert";
import LoadingPage from "../../components/LoadingPage";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../components/SwalMessages";
import { mainAPI } from "../../components/mainAPI";
const VehicleDetail = ({isCallCenter}) => {
  const { vehicleId } = useParams();
  const apiVehicleDetail = `${mainAPI}/Api/Admin/All/Vehicles/${vehicleId}`;
  const apiVehicleStatus = `${mainAPI}/Api/Vehicle/SetStatus`;
  const apiVehicleCatagory = `${mainAPI}/Api/Admin/All/VehicleCatagory`;
  const [vehicleDetail, setVehicleDetail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [newData, setNewData] = useState({});
  const [edit, setEdit] = useState(false);
  const [backup, setBackUp] = useState();
  const [updating, setUpdating] = useState(false);
  const [vehicleCatagory, setVehicleCatagory] = useState([]);
  const [vehicleConditions, setVehicleConditions] = useState([]);
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  /** SWAL CONFIRMATION MESSAGE  */
  const showConfirmationMessage = async () => {
    let response = await swal({
      title: "Are you sure ?",
      text: `Do you want to Procced`,
      icon: "warning",
      dangerMode: true,
      buttons: ["cancel", "Procced"],
    });
    return response;
  };
  /** GET VEHICLE DETAIL  */
  const getDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiVehicleDetail, options);
      if (res.status == 401) {
        //showErrorMessage();
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setVehicleDetail(data);
        setBackUp(data);
        setNewData({ status: data.status });
        // console.log(data);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    } finally {
      setLoading(false);
    }
  };
  const getVehicleCatagory = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiVehicleCatagory, options);
      if (res.status == 401) {
        //showErrorMessage();
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        console.log(data);
        setVehicleCatagory(data.vehicleCatagories);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    } finally {
      setLoading(false);
    }
  };
  const apiVehicleCondition = `${mainAPI}/Api/Admin/All/VehicleCondition`;
  const getVehicleConditions = async () => {
    try {
      const res = await fetch(apiVehicleCondition, options);
      if (res.status == 401) {
        showErrorMessage({ message: "Session Expire 401" });
      }
      const data = await res.json();
      if (data && res.ok) {
        setVehicleConditions(data.vehicleConditions);
        console.log(data.vehicleConditions);
      }
    } catch (e) {
      showErrorMessage(e);
    }
  };
  /** CALLING GETDETAIL WHEN PAGE STARTED */
  useEffect(() => {
    getDetail();
    getVehicleCatagory();
    getVehicleConditions();
  }, []);

  const updateVehicleInfo = async () => {
    /** UPDATING VEHICLE INFO  */
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(newData),
    };
    const url = `${mainAPI}/Api/Admin/UpdateVehicleInfo/${vehicleId}`;
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      showSuccessMessage(result);
    } catch (e) {
      setError(e);
      showErrorMessage(e);
      console.log(e);
    } finally {
      setEdit(false);
      setUpdating(false);
      getDetail();
      setNewData({});
    }
  };
  /** UPDATE VEHICLE STATUS */
  const changeVehicleStatus = async (status) => {
    const plateNumber = vehicleDetail.plateNumber;
    let newStatus = {
      status,
      plateNumber,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(newStatus),
    };

    try {
      const response = await fetch(apiVehicleStatus, options);
      const result = await response.json();
      const mess = result["message"];
      if (response.ok) {
        showSuccessMessage(result);
      } else {
        showErrorMessage(mess);
      }
    } catch (error) {
      console.error(error);
      showErrorMessage(error.message);
    }
  };
  /** HANDLING SUBMIT ON FORM */
  const handleSubmit = async (e) => {
    e.preventDefault();
    /** CHEKING IF ANY OF INPUT IS EMPTY */
    if (
      vehicleDetail.id.toString() == "" ||
      vehicleDetail.manufactureDate == "" ||
      vehicleDetail.plateNumber == "" ||
      vehicleDetail.vehicleCondition == "" ||
      vehicleDetail.vehicleCatagory == "" ||
      vehicleDetail.capacity == "" ||
      vehicleDetail.status == "" ||
      vehicleDetail.driver == "" ||
      vehicleDetail.vehicleOwner == ""
    ) {
      swal({
        title: "Fill all Detail below",
        text: `please fill all`,
        icon: "error",
        dangerMode: true,
        buttons: [false, "cancel"],
      });
    } else {
      /** WAITING CONFIRMATION FROM USER  */
      const sure = await showConfirmationMessage();
      if (sure) {
        updateVehicleInfo();
        changeVehicleStatus(newData.status);
        setUpdating(true);
      }
    }
  };
  /** HANDLING INPUT CHANGES */
  const handleChange = (e) => {
    setVehicleDetail({ ...vehicleDetail, [e.target.name]: e.target.value });
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  return (
    <div className="main-bar">
      <div
        style={{
          display: "flex",
          columnGap: "10px",
          alignItems: "center",
        }}
      >
        <MdKeyboardArrowLeft size={30} />
        <Link to={"/vehicle"}>Back To Vehicle</Link>
      </div>
      <div className="manage-window  detail-content mx-auto">
        {loading ? <LoadingPage message={"loading data"} /> : ""}
        {updating ? <LoadingPage message={"updating data"} /> : ""}
        <form onSubmit={(e) => handleSubmit(e)}>
          <p className="detail-part">Vehicle Detail</p>
          <hr />

          <div
            style={{
              display: "flex",
              columnGap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div className="flex-grow">
              <label>ID</label>
              <input value={vehicleDetail.id || ""} name="id" disabled />
            </div>

            <div className="flex-grow">
              <label>Vehicle Catagory</label>
              {!edit ? (
                <input
                  value={vehicleDetail.vehicleCatagory || ""}
                  name="vehicleCatagory"
                  disabled
                />
              ) : (
                <select
                  value={vehicleDetail.vehicleCatagory || ""}
                  name="vehicleCatagory"
                  onChange={(e) => handleChange(e)}
                >
                  {vehicleCatagory.map((item, index) => (
                    <option value={item.catagory} key={index}>
                      {item.catagory}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex-grow " style={{}}>
              <label>Vehicle Condition</label>
              {!edit ? (
                <input value={vehicleDetail.vehicleCondition || ""} disabled />
              ) : (
                <select
                  value={vehicleDetail.vehicleCondition || ""}
                  name="vehicleCondition"
                  onChange={(e) => handleChange(e)}
                >
                  {vehicleConditions.map((condition, index) => (
                    <option value={condition.conditionName} key={index}>
                      {condition.conditionName}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex-grow " style={{}}>
              <label>Vehicle Capacit</label>
              <input
                value={vehicleDetail.capacity || ""}
                name="capacity"
                disabled={!edit}
                onChange={(e) => handleChange(e)}
                type="number"
              />
            </div>
            <div className="flex-grow " style={{}}>
              <label>Vehicle Name</label>
              <input
                value={vehicleDetail.vehicleName || ""}
                name="vehicleName"
                disabled={!edit}
                onChange={(e) => handleChange(e)}
                type="text"
              />
            </div>
            <div className="flex-grow " style={{}}>
              <label>Vehicle ID</label>
              <input
                value={vehicleDetail.deviceID || ""}
                name="deviceID"
                disabled
                type="number"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="flex-grow">
              <label>Manufacture Date</label>
              <input
                value={vehicleDetail.manufactureDate || ""}
                name="manufactureDate"
                disabled={!edit}
                onChange={(e) => handleChange(e)}
                type="date"
              />
            </div>
            <div className="flex-grow">
              <label>Plate Number</label>
              <input
                value={vehicleDetail.plateNumber || ""}
                name="plateNumber"
                disabled={!edit}
                onChange={(e) => handleChange(e)}
                type="number"
              />
            </div>
          </div>
          <p className="detail-part">Vehicle Status</p>
          <div
            style={{
              display: "flex",
              columnGap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div className="flex-grow">
              <label>Status</label>
              {!edit ? (
                <input
                  value={vehicleDetail.status || ""}
                  name="status"
                  disabled
                />
              ) : (
                <select
                  onChange={(e) => handleChange(e)}
                  name="status"
                  value={vehicleDetail.status || ""}
                >
                  <option value={"ONROUTE"}>ONROUTE</option>
                  <option value={"INSTOCK"}>INSTOCK</option>
                  <option value={"PARKED"}>PARKED</option>
                  <option value={"MAINTAINING"}>MAINTAINING</option>
                </select>
              )}
            </div>

            <div className="flex-grow">
              <label>Vehicle Driver</label>
              <input
                value={vehicleDetail.driver || ""}
                name="driver"
                disabled
              />
            </div>
            <div className="flex-grow">
              <label>Vehicle Owner</label>
              <input
                value={vehicleDetail.vehicleOwner || ""}
                name="vehicleOwner"
                disabled
              />
            </div>
          </div>
          {!isCallCenter() && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              className={`btn ${edit ? "btn-bg-lightred" : "btn-bg-gray"}`}
              style={{
                maxWidth: "150px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                columnGap: "4px",
              }}
              onClick={() => {
                setEdit(!edit);
                setVehicleDetail(backup);
              }}
            >
              {edit ? "Cancel" : "Edit"}
              <MdModeEdit color="white" width={25} />
            </span>
            <button className="btn w-300" disabled={!edit}>
              Update
            </button>
          </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default VehicleDetail;
