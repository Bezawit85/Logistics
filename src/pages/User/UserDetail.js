import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdModeEdit } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import LoadingPage from "../../components/LoadingPage";
import {
  showConfirmationMessage,
  showErrorMessage,
  showSuccessMessage,
} from "../../components/SwalMessages";
import swal from "sweetalert";
import ReactLoading from "react-loading";
import Drivers from "../Driver/Drivers";
import Vehicle from "../Vehicle/Vehicle";
import { BsToggleOn,BsToggleOff } from "react-icons/bs"
import { useUserContext } from "../../components/context/UserContext";

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

const UserDetail = () => {
  const {isCallCenter} = useUserContext();
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
  const [companyType, setcompanyType] = useState([]);
  const [companySector, setcompanySector] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({});
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
  const companyAPI = `${api}/Api/Admin/All/CompanyVehicleOwner/${id}`;
  const indivisualAPI = `${api}/Api/Admin/All/IndividualVehicleOwner/${id}`;
  const serviceapi = `${api}/Api/Admin/All/Services`;
  const notificationapi = `${api}/Api/Admin/All/NotificationMedium`;
  const companyTypeapi = `${api}/Api/Admin/All/CompanyType/`;
  const companySectorapi = `${api}/Api/Admin/All/CompanySector/`;
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
  const getCompanyType = async () => {
    try {
      const res = await fetch(companyTypeapi, options);
      if (res.status == 401) {
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setcompanyType(data.companyTypes);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    }
  };
  const getCompanySector = async () => {
    try {
      const res = await fetch(companySectorapi, options);
      if (res.status == 401) {
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setcompanySector(data.companySectors);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    }
  };
  useEffect(() => {
    let currentOwnerAPI;
    if (role === "OWNER") {
      currentOwnerAPI = companyAPI;
    }
    if (role === "INDIVIDUAL") {
      currentOwnerAPI = indivisualAPI;
    }
    const getCompanyOwner = async () => {
      setLoading(true);
      try {
        const res = await fetch(currentOwnerAPI, options);
        if (res.status == 401) {
          setError("Unable to Load!! server respond with 401");
        }
        const data = await res.json();
        if (data && res.ok) {
         
          setUserData(data.ownerINF);
          console.log(userData);
          let info = {
            companyName: data.ownerINF.companyName,
            companyType: data.ownerINF.companyType,
            notificationmedia: data.ownerINF.notificationMedium,
            email: data.ownerINF.email,
            serviceRequired: data.ownerINF.serviceNeeded,
            companySector: data.ownerINF.companySector,
            firstName: data.ownerINF.firstName,
            lastName: data.ownerINF.lastName,
            region: data.ownerINF.companyAddressINF.region,
            subCity: data.ownerINF.companyAddressINF.subcity,
            specificLocation: data.ownerINF.companyAddressINF.specificLocation,
            city: data.ownerINF.companyAddressINF.city,
            woreda: data.ownerINF.companyAddressINF.woreda,
            houseNumber: data.ownerINF.companyAddressINF.houseNum,
            ownerPhoneNumber: "",
          };
          //for back up data
          setCompanyInfo({
            ...info,
            phoneNumber: data.ownerINF.phoneNumber,
            phone: data.ownerINF.companyAddressINF.phone,
          });
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
    getCompanySector();
    getCompanyType();
    getServieces();
    getNotification();
  }, [refresh]);
  const updateUserInfo = async () => {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(newData),
    };
    let url;
    if (role === "OWNER")
      url = `${api}/Api/Admin/UpdateInfo/VehicleOwner/${id}`;
    else if (role === "INDIVIDUAL")
      url = `${api}/Api/Admin/UpdateInfo/Individual/${id}`;
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const mess = result["message"];
      if (response.ok) {
        console.log("updated successful");
        showSuccessMessage({ message: mess });
        setRefresh(!refresh);
      } else {
        console.log("failed");
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
    setCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value });
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };
/**Enable Disable user */
const enableUser = async () => {
  
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      }
    };
    const EnableDisableApi = `${api}/Api/User/disable/${id}`;
    setLoading(true);
    try {
      const res = await fetch(EnableDisableApi, options);
      const data = await res.json();
      if (res.ok) {
       
        setRefresh(!refresh)
        showSuccessMessage({ message: data.message });
      }
      else{
        showErrorMessage({ message: data.message })
      }
    } catch (e) {
      showErrorMessage({ message: e });
    } finally {
      setLoading(false);
     // Reloading the Page for getting status;
    }
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
            {isCallCenter() ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <p className="detail-part">Company Information</p>
        </div>
      ) : (
            <div style={{display:'flex',
                          alignItems:'center',
                          justifyContent:'space-around' }}        >
            <p className="detail-part">Company Information</p> 
            
            {userData.enabled == true ? <BsToggleOn  style={{color:'green'}} onClick={()=>enableUser(id)}size="3rem"></BsToggleOn> : 
             <BsToggleOff style={{color:'red'}}onClick={()=>enableUser(id)} size="3rem"></BsToggleOff>
                                        }
            </div>
            )}
            <hr />

           { role === "OWNER" &&
           <div
              style={{
                display: "flex",
                columnGap: "20px",
                flexWrap: "wrap",
              }}
            >
              <CustomInput
                name={"companyName"}
                value={companyInfo.companyName || ""}
                edit={edit}
                handleChange={handleChange}
                label={"Company Name"}
                type={"text"}
              />

              <div className="flex-grow">
                <label>Company Type</label>
                {!edit ? (
                  <input
                    value={companyInfo.companyType || ""}
                    name="companyType"
                    disabled
                  />
                ) : (
                  <select
                    value={companyInfo.companyType || ""}
                    name="companyType"
                    onChange={(e) => handleChange(e)}
                  >
                    {companyType.map((item, index) => (
                      <option value={item.companyType} key={index}>
                        {item.companyType}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex-grow " style={{}}>
                <label>Company Sector</label>
                {!edit ? (
                  <input value={companyInfo.companySector || ""} disabled />
                ) : (
                  <select
                    value={companyInfo.companySector || ""}
                    name="companySector"
                    onChange={(e) => handleChange(e)}
                  >
                    {companySector.map((item, index) => (
                      <option key={index} value={item.sectorName}>
                        {item.sectorName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>}
            {/* *******************  OWNER ADDRESS DIV ****************/}

            {role === "INDIVIDUAL" ? (
              <p className="detail-part">Owner Address</p>
            ) : (
              <p className="detail-part">Company Address</p>
            )}
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
                  value={companyInfo.region || ""}
                  name="region"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="flex-grow " style={{}}>
                <label>Sub City</label>
                <input
                  value={companyInfo.subCity || ""}
                  name="subCity"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="flex-grow " style={{}}>
                <label>Specific Location</label>
                <input
                  value={companyInfo.specificLocation || ""}
                  name="specificLocation"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="flex-grow" style={{}}>
                <label>City</label>
                <input
                  value={companyInfo.city || ""}
                  name="city"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="flex-grow " style={{}}>
                <label>Woreda</label>
                <input
                  value={companyInfo.woreda || ""}
                  name="woreda"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="flex-grow" style={{}}>
                <label>House Number</label>
                <input
                  value={companyInfo.houseNumber || ""}
                  name="houseNumber"
                  disabled={!edit}
                  type="text"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="flex-grow">
                <label>Phone Number</label>
                <input
                  value={companyInfo.phone || ""}
                  name="phone"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="tel"
                />
              </div>
            </div>
            {/* *******************  OWNER INFORMATION DIV ****************/}
            <p className="detail-part">Owner Information</p>
            <div
              style={{
                display: "flex",
                columnGap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div className="flex-grow">
                <label>First Name</label>
                <input
                  value={companyInfo.firstName || ""}
                  name="firstName"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="flex-grow">
                <label>Last Name</label>
                <input
                  value={companyInfo.lastName || ""}
                  name="lastName"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="flex-grow">
                <label>Phone Number</label>
                <input
                  value={companyInfo.phoneNumber || ""}
                  name="ownerPhoneNumber"
                  disabled={!edit}
                  onChange={(e) => {
                    setNewData({ ...newData, [e.target.name]: e.target.value });
                    setCompanyInfo({
                      ...companyInfo,
                      phoneNumber: e.target.value,
                    });
                  }}
                  type="tel"
                />
              </div>
              <div className="flex-grow">
                <label>Email</label>
                <input
                  value={companyInfo.email || ""}
                  name="email"
                  disabled={!edit}
                  onChange={(e) => handleChange(e)}
                  type="email"
                  required
                />
              </div>
            </div>
            <p className="detail-part">Additional Information</p>
            <div
              style={{
                display: "flex",
                columnGap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div className="flex-grow">
                <label>Notification Priference</label>
                {!edit ? (
                  <input
                    value={companyInfo.notificationmedia || ""}
                    name="notificationmedia"
                    disabled
                  />
                ) : (
                  <select
                    onChange={(e) => handleChange(e)}
                    name="notificationmedia"
                    value={companyInfo.notificationmedia || ""}
                  >
                    {notification.map((item, index) => (
                      <option key={index} value={item.medium}>
                        {" "}
                        {item.medium}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex-grow">
                <label>Service Needed</label>
                {!edit ? (
                  <input
                    value={companyInfo.serviceRequired || ""}
                    name="serviceRequired"
                    disabled
                  />
                ) : (
                  <select
                    onChange={(e) => handleChange(e)}
                    name="serviceRequired"
                    value={companyInfo.serviceRequired || ""}
                  >
                    {service.map((item, index) => (
                      <option key={index} value={item.service}>
                        {" "}
                        {item.service}
                      </option>
                    ))}
                  </select>
                )}
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
      {/* ***************************** USER Driver DETAIL TABLES TO BE ADDED HERE */}
      <div className="main-bar">
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              flexDirection: "column",
              rowGap: "50px",
            }}
          >
            <ReactLoading type="bars" width={100} height={50} color="black" />
            <p>Loading Data Please Wait</p>
          </div>
        ) : (
          !error && (
            <Drivers
              driverData={{
                assigned: userData.assignedDriverINFs,
                unassigned: userData.unassignedDriverINFs,
                allDrivers: userData.drivers,
                permit: userData.permitDriverINFs,
                onRoute: userData.onRouteDriverINFs,
              }}
            />
          )
        )}
      </div>
      {/* ***************************** USER Vehicle DETAIL TABLES TO BE ADDED HERE */}
      <div className="main-bar">
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              flexDirection: "column",
              rowGap: "50px",
            }}
          >
            <ReactLoading type="bars" width={100} height={50} color="black" />
            <p>Loading Data Please Wait</p>
          </div>
        ) : (
          !error && (
            <Vehicle
              vehicleData={{
                allVehicles: userData.vehicles,
                parked: userData.parkedVehicles,
                inStock: userData.inStockVehicles,
                onRoute: userData.onRouteVehicles,
                maintenance: userData.maintainingVehicles,
              }}
            />
          )
        )}
      </div>
    </div>
  );
};

export default UserDetail;
