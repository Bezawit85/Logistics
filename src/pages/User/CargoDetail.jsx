import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdModeEdit } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import LoadingPage from "../../components/LoadingPage";
import '../Driver//driverdetail.css'
import axios from "axios";

import {
  showConfirmationMessage,
  showErrorMessage,
  showSuccessMessage,
} from "../../components/SwalMessages";
import swal from "sweetalert";
import ReactLoading from "react-loading";
import Drivers from "../Driver/Drivers";
import Vehicle from "../Vehicle/Vehicle";

const CustomInput = ({ value, handleChange, name, label, edit, type }) => {
  return (
    <div className="flex-grow">
      <label>{label}</label>
      <input
        value={value || ""}
        name={name}
        disabled={!edit}
        onChange={(e) => handleChange(e)}
        type={type}
      />
    </div>
  );
};

const cargoDetail = () => {
  const { vehicleId } = useParams();
  const api = "https://api.bazralogistics.com";
  //   const apiVehicleDetail = `${api}/Api/Admin/All/Vehicles/${vehicleId}`;
  //   const apiVehicleStatus = `${api}/Api/Vehicle/SetStatus`;
  //   const apiVehicleCatagory = `${api}/Api/Admin/All/VehicleCatagory`;
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [newData, setNewData] = useState({});
  const [edit, setEdit] = useState(false);
  const [backup, setBackUp] = useState();
  const [refresh, setRefresh] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState([]);
  const [service, setService] = useState([]);
  const [businessType, setbusinessType] = useState([]);
  const [businessSector, setbusinessSector] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({});
  const [cargoBusinessInfo, setCargoBusinessInfo] = useState({});
  const [cargoAddressInfo, setCargoAddressInfo] = useState({});
  const [cargoEnabled, setCargoEnabled] = useState("");
  const [driverData, setriverData] = useState({});
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const { id, role } = useParams();
  const CargoPI = `${api}/Api/Admin/All/CargoOwner/${id}`;
  const indivisualAPI = `${api}/Api/Admin/All/IndividualVehicleOwner/${id}`;
  const serviceapi = `${api}/Api/Admin/All/Services`;
  const notificationapi = `${api}/Api/Admin/All/NotificationMedium`;
  const businessTypeapi = `${api}/Api/Admin/All/BusinessTypes`;
  const businessSectorapi = `${api}/Api/Admin/All/BusinessSectors`;
  const getServieces = async () => {
    try {
      const res = await fetch(serviceapi, options);
      if (res.status == 401) {
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setService(data.service);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    }
  };
  const getNotification = async () => {
    try {
      const res = await fetch(notificationapi, options);
      if (res.status == 401) {
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setNotification(data.notificationMedias);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    }
  };
  const getBusinessType = async () => {
    try {
      const res = await fetch(businessTypeapi, options);
      if (res.status == 401) {
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setbusinessType(data.businessSectors);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    }
  };
  const getBusinessSector = async () => {
    try {
      const res = await fetch(businessSectorapi, options);
      if (res.status == 401) {
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setbusinessSector(data.businessSectors);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    }
  };
  useEffect(() => {
   
    const getCompanyOwner = async () => {
      setLoading(true);
      try {
        const res = await fetch(CargoPI, options);
        if (res.status == 401) {
          setError("Unable to Load!! server respond with 401");
        }
        const data = await res.json();
        if (data && res.ok) {
          console.log(data);
          setUserData(data.cargoOwnerINF);
          setCargoBusinessInfo(data.businessINF);
          setCargoAddressInfo(data.address);
          setCargoEnabled(data.enabled);

          let info = {
            licenseNumber: data.businessINF.licenseNumber,
            tinNumber: data.businessINF.tinNumber,
            businessName: data.businessINF.businessName,
            businessType: data.businessINF.businessType,
            businessSector: data.businessINF.businessSector,
            region: data.address.region,
            subCity: data.address.subcity,
            specificLocation: data.address.specificLocation,
            city: data.address.city,
            woreda: data.address.woreda,
            houseNumber: data.address.houseNum,
            phoneNumber: data.address.phone,
            licenseFile: data.businessINF.license,
            tinFile: data.businessINF.tin,
          };
          //for back up data
          setCompanyInfo(info);
          setNewData(info);
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
    getCompanyOwner();
    getBusinessSector();
    getBusinessType();
    getServieces();
    getNotification();
  }, [refresh]);




  const updateUserInfo = async () => {
    const formData = new FormData();
    console.log(newData);
    formData.append("licenseNumber", newData.licenseNumber);
    formData.append("tinNumber", newData.tinNumber);
    formData.append("businessName", newData.businessName);
    formData.append("businessType", newData.businessType);
    formData.append("businessSector", newData.businessSector);
    formData.append("region", newData.region);
    formData.append("subCity", newData.subCity);
    formData.append("specificLocation", newData.specificLocation);
    formData.append("city", newData.city);
    formData.append("woreda", newData.woreda);
    formData.append("houseNumber", newData.houseNumber);
    formData.append("phoneNumber",'');
    formData.append("name", newData.companyName);

    
    let url = `${api}/Api/Admin/UpdateInfo/CargOwner/${id}`;
    try {
      const response = await axios.put(
       url,
        formData,
        {
          headers: {
            "Content-Type": "auto",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      localStorage.setItem("message", JSON.stringify(response.data["message"]));
      const mess = localStorage.getItem("message");
      if (response.status === 200) {
        console.log(mess);
        showSuccessMessage({ message: mess });
        setRefresh(!refresh);
       } else {
        console.log(mess);
        swal("Update Failed", mess || "Server respond 500", "error");
      }
    } catch (error) {
      console.error(error);
      showErrorMessage(error);
    } finally {
      setUpdating(false);
      setRefresh(!refresh);
      setEdit(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    /** CHEKING IF ANY OF INPUT IS EMPTY */
    if (
      companyInfo.companyName == "" ||
      companyInfo.companyType == "" ||
      companyInfo.notificationMedium == "" ||
      companyInfo.email == "" ||
      companyInfo.serviceNeeded == "" ||
      companyInfo.phoneNumber == "" ||
      companyInfo.companySector == "" ||
      companyInfo.firstName == "" ||
      companyInfo.lastName == "" ||
      companyInfo.region == "" ||
      companyInfo.subcity == "" ||
      companyInfo.specificLocation == "" ||
      companyInfo.city == "" ||
      companyInfo.woreda == "" ||
      companyInfo.houseNumber == ""
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
        updateUserInfo();
        setUpdating(true);
      } else {
        setRefresh(!refresh);
        setEdit(false);
      }
    }
  };
  /** HANDLING INPUT CHANGES */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value });
    setNewData((prevData) => ({
      ...prevData,
      [name]: value || prevData[name], // Keep the existing value if the input is empty
    }))
  };

  return (
    <div className="main-bar">
      {loading ? <LoadingPage message={"loading data"} /> : ""}
      {updating ? <LoadingPage message={"updating data"} /> : ""}

      <div className="main-bar-wrapper">
        {/* **************** USER DETAIL MAINBAR */}
        <div
          style={{
            display: "flex",
            columnGap: "10px",
            alignItems: "center",
          }}
        >
          <MdKeyboardArrowLeft size={30} />
          <Link to={"/users"}>Back To Users</Link>
        </div>
        <div className="manage-window  detail-content mx-auto">
          <form onSubmit={(e) => handleSubmit(e)}>
            {/* **************** Company Information */}
            <p className="detail-part">Cargo Owner Information</p>
            <hr />

            {/* *******************  OWNER ADDRESS DIV ****************/}
            
            <div
              style={{
                display: "flex",
                columnGap: "20px",
                flexWrap: "wrap",
              }}
            >
                   <div className="flex-grow " style={{}}>
                      <label>Owner Name </label>
                      <input
                        defaultValue={userData.ownerName|| ""}
                        disabled
                        type="text"
                      />
              </div>
                  <div className="flex-grow " style={{}}>
                      <label>Business Name </label>
                      <input
                        defaultValue={cargoBusinessInfo.businessName || ""}
                        name="businessName"
                        disabled={!edit}
                        onChange={(e) => handleChange(e)}
                        type="text"
                      />
              </div>
              <div>
              <label>Business type</label>
               
              {!edit ? (
                  <input
                    defaultValue={cargoBusinessInfo.businessType  || ""}
                    name="businessType"
                    disabled
                  />
                ) : (
                  <select
                    onChange={(e) => handleChange(e)}
                    name="businessType"
                    defaultValue={cargoBusinessInfo.businessType  || ""}
                  >
                    {businessType.map((item, index) => (
                      <option key={index} defaultValue={item.businessType}>
                        {" "}
                        {item.businessType}
                      </option>
                    ))}
                  </select>
                )}

              </div>
             
                  
             <div>
              <label>Business Sector</label>
                {!edit ? (
                  <input
                    defaultValue={cargoBusinessInfo.businessSector  || ""}
                    name="businessSector"
                    disabled
                  />
                ) : (
                  <select
                    onChange={(e) => handleChange(e)}
                    name="businessSector"
                    defaultValue={cargoBusinessInfo.businessSector  || ""}
                  >
                    {businessSector.map((item, index) => (
                      <option key={index} defaultValue={item.businessSector}>
                        {" "}
                        {item.businessSector}
                      </option>
                    ))}
                  </select>
                )}

              </div>
              <div className="flex-grow " style={{}}>
                <label>Tin number</label>
                <input
                  defaultValue={cargoBusinessInfo.tinNumber || ""}
                  name="tinNumber"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="flex-grow " style={{}}>
                <label>License number</label>
                <input
                  defaultValue={cargoBusinessInfo.licenseNumber || ""}
                  name="licenseNumber"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
               <div className="flex-grow " style={{}}>
                <label>License Pic</label>
                 <img
                        src={cargoBusinessInfo.license || ""}
                        alt="licence pic"
                        style={{
                          border: "1px solid black",
                          objectFit: "cover",
                          borderRadius: "5px",
                          display: "block",
                          width: "100px",
                          height: "100px",
                          overflow: "hidden",
                          marginBottom: "10px",
                        }}
                        className="img-licence"
                      />
              </div>
               <div className="flex-grow " style={{}}>
                <label>Tin Pic</label>
                 <img
                        src={cargoBusinessInfo.tin || ""}
                        alt="tin pic"
                        style={{
                          border: "1px solid black",
                          objectFit: "cover",
                          borderRadius: "5px",
                          display: "block",
                          width: "100px",
                          height: "100px",
                          overflow: "hidden",
                          marginBottom: "10px",
                        }}
                        className="img-licence"
                      />
              </div>
              </div>
            {/* *******************  OWNER INFORMATION DIV ****************/}
            <p className="detail-part">Company  Address</p>
            <div
              style={{
                display: "flex",
                columnGap: "20px",
                flexWrap: "wrap",
              }}
            >
             
              <div className="flex-grow " style={{}}>
                <label>Region</label>
                <input
                  defaultValue={companyInfo.region || ""}
                  name="region"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="flex-grow " style={{}}>
                <label>Sub City</label>
                <input
                  defaultValue={cargoAddressInfo.subcity|| ""}
                  name="subCity"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="flex-grow " style={{}}>
                <label>Specific Location</label>
                <input
                  defaultValue={cargoAddressInfo.specificLocation || ""}
                  name="specificLocation"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="flex-grow" style={{}}>
                <label>City</label>
                <input
                  defaultValue={cargoAddressInfo.city || ""}
                  name="city"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="flex-grow " style={{}}>
                <label>Woreda</label>
                <input
                  defaultValue={cargoAddressInfo.woreda || ""}
                  name="woreda"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="flex-grow" style={{}}>
                <label>House Number</label>
                <input
                  defaultValue={cargoAddressInfo.houseNum || ""}
                  name="houseNumber"
                  disabled={!edit}
                  type="text"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="flex-grow">
                <label>Phone Number</label>
                <input
                  defaultValue={userData.phoneNumber || ""}
                  name="phoneNumber"
                  disabled
                  type="tel"
                />
              </div>
            </div>
         
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
                }}
              >
                {edit ? "Cancel" : "Edit"}
                <MdModeEdit color="white" width={25} />
              </span>
              <button className="btn w-300" disabled={!edit}>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default cargoDetail;
