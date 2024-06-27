import React, { useEffect, useState } from "react";
import "./driverdetail.css";
import { MdKeyboardArrowLeft, MdModeEdit } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import LoadingPage from "../../components/LoadingPage";
import swal from "sweetalert";
import axios from "axios";
import { mainAPI, endpoints } from "../../components/mainAPI";
import { showSuccessMessage } from "../../components/SwalMessages";
import { BsToggleOn,BsToggleOff } from "react-icons/bs"

const DriverDetail = ({isCallCenter}) => {
  //DriverID From Router parameter
  const { driverId } = useParams();
  const apiDriverDetail = `${mainAPI}${endpoints.List.Drivers}/${driverId}`;
  const apiUpdateDriverDetail = `${mainAPI}${endpoints.Update.InfoDriver}/${driverId}`;
  const [driverDetail, setDriverDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [enabled,setEnabled]=useState('')
  const [updating, setUpdating] = useState(false);
  const [newData, setNew] = useState({});
  const [edit, setEdit] = useState(false);
  const [date,setDate]=useState('dateString')
  const [refresh, setRefresh] = useState(false);
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  //*******Getting Driver Detail
  const getDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiDriverDetail, options);
      if (res.status == 401) {
        setLoading(false);
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
       
        let info ={
          id:data.id,
          role:data.role,
          status:data.status,
          owner:data.vehicleOwner,
          driverName:data.driverName,
          licensePic: data.licensePic,
          licenseNumber:data.licenseNumber,
          driverPic:data.driverPic,
          phoneNumber:data.phoneNumber,
          birthDate:data.birthDate,
          experience: data.experience,
          licenseGrade: data.licenseGrade,
          gender:data.gender,
          licenseIssueDate: data.licenseIssueDate,
          licenseExpireDate: data.licenseExpireDate
        }
        setDriverDetail(info);
        setEnabled(data.enabled)
        setNew(info)
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  //*********USE EFFECT FOR CALLING getDetail
  useEffect(()=>{

    setDate(edit ?"date" :"dateString")
  },[edit])
  useEffect(() => {
    setEdit(false);
    setError("");
    getDetail();
  }, [refresh]);
  const showErrorMessage = (e) => {
    swal({
      title: "Error occured ",
      text: `${e.message}`,
      icon: "error",
      dangerMode: true,
      buttons: [false, "OK"],
    });
  };
  // ********************* UPDATE DRIVER INFO FUNCTION
  const handleFormSubmit =async () => {
  
    const driver = new FormData();
    driver.append("driverName", newData.driverName);
    driver.append("licenseNumber", '');
    driver.append("driverPhone", '');
    driver.append("birthDate", newData.birthDate);
    driver.append("experience", newData.experience);
    driver.append("licenseGrade", newData.licenseGrade);
    driver.append("gender", newData.gender);
    driver.append("licenseIssueDate", newData.licenseIssueDate);
    driver.append("licenseExpireDate", newData.licenseExpireDate);

    try {
      const response = await axios.put(
        apiUpdateDriverDetail,
        driver,
        {
          headers: {
            "Content-Type": "auto",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      localStorage.setItem("message", JSON.stringify(response.data["message"]));
      const mess = localStorage.getItem("message");
      if (response.status == 200) {
        showSuccessMessage({ message: mess });
        setRefresh(!refresh);
      } else {
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      driverDetail.phoneNumber == "" ||
      driverDetail.birthDate == "" ||
      driverDetail.driverName == "" ||
      driverDetail.experience == "" ||
      driverDetail.licenseGrade == "" ||
      driverDetail.plateNumber == "" ||
      driverDetail.licenseNumber == "" ||
      driverDetail.licenseIssuDate == "" ||
      driverDetail.licenseExpireDate == "" ||
      driverDetail.status == "" ||
      driverDetail.driver == "" ||
      driverDetail.vehicleOwner == ""
    ) {
      swal({
        title: "Fill all Detail below",
        text: `please fill all`,
        icon: "error",
        dangerMode: true,
        buttons: [false, "cancel"],
      });
    } else {
      handleFormSubmit();
      setUpdating(true);
    }
  };
  //HANDLING EDITED DATA
  const handleChange = (e) => {
      const { name, value } = e.target;
      setDriverDetail({ ...driverDetail,
        [e.target.name]: e.target.value })
      setNew((prevData) => ({
        ...prevData,
        [name]: value || prevData[name], // Keep the existing value if the input is empty
      }))

    };
  

  /*********Enable disable user */
  const enableUser = async () => {
  
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      }
    };
    const EnableDisableApi = `${mainAPI}${endpoints.Enable}${driverDetail.id}`;
    setLoading(true);
    try {
      const res = await fetch(EnableDisableApi, options);
      if (res.ok) {
        const data = await res.json();
        setRefresh(!refresh)
        showSuccessMessage({ message: data.message });
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
      <div
        style={{
          display: "flex",
          columnGap: "10px",
          alignItems: "center",
        }}
      >
        <MdKeyboardArrowLeft size={30} />
        <Link to={"/driver"}>Back To Driver</Link>
      </div>
      {loading ? <LoadingPage message={"loading data"} /> : ""}
      {updating ? <LoadingPage message={"updating data"} /> : ""}
      {error ? (
        <>
          <p
            style={{
              textAlign: "center",
              fontSize: "25px",
              marginTop: "50px",
              color: "red",
            }}
          >
              {error === "Failed to fetch" ? "NO INTERNET CONNECTION" : error}
          </p>
          <button
            className="btn center w-300"
            onClick={() => setRefresh(!refresh)}
          >
            Refresh Page
          </button>
        </>
      ) : (
        ""
      )}
      {!error && (
        <div className="manage-window  detail-content mx-auto">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div
              className=""
              style={{
                display:'flex',
                alignItems:'center',
                justifyContent:'space-between',
                width: "250px",
                height: "100px",
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
                <img
                  src={driverDetail.driverPic || ""}
                  alt={`${driverDetail.driverName || ""} pic`}
                  style={{
                    display: "block",
                    // objectFit: "cover",
                    width: "50%",
                    height: "100%",
                    borderRadius: "50%"
                  }}
                />
                {isCallCenter() ? null : (
                <div>
                {enabled === true ? 
                <BsToggleOn onClick={()=>enableUser()} style={{color:'green'}} size="3rem"></BsToggleOn> : 
              <BsToggleOff onClick={()=>enableUser()}style={{color:'red'}}size="3rem"></BsToggleOff>
                                          }
               <p className="driver-name" >{driverDetail.driverName || ""}</p>
                </div>
                )}
            </div>

           {!isCallCenter() && (
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
                // setDriverDetail(backup);
              }}
            >
              {edit ? "Cancel" : "Edit"}
              <MdModeEdit color="white" width={25} />
            </span>
           )}
            <p className="detail-part">Personal Detail</p>
            <div
              style={{
                display: "flex",
                columnGap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div className="flex-grow">
                <label>Phone Number</label>
                <input
                  value={driverDetail.phoneNumber || ""}
                  name="userName"
                  disabled
                />
              </div>
              <div className="flex-grow">
                <label>ID</label>
                <input
                  value={driverDetail.id || ""}
                  name="id"
                  disabled
                />
              </div>
              <div className="flex-grow">
                <label>Role</label>
                <input
                  value={driverDetail.role || ""}
                  name="role"
                  disabled
                />
              </div>
              <div className="flex-grow">
                <label>Date Of Birth</label>
                <input
                  defaultValue={driverDetail.birthDate || ""}
                  name="birthDate"
                  type="dateString"
                  disabled
                />
              </div>
              <div className="flex-grow " style={{}}>
                <label>Gender</label>
                {!edit ? (
                  <input
                    defaultValue={driverDetail.gender || ""}
                    name="gender"
                    disabled
                  />
                ) : (
                  <select
                    defaultValue={driverDetail.gender || ""}
                    name="gender"
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                )}
              </div>
              <div className="flex-grow">
                <label>Experience</label>
                <input
                  defaultValue={driverDetail.experience
                    || ""}
                  name="experience"
                  disabled={!edit}
                  type="number"
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <p className="detail-part">Licence Detail</p>
            <div
              style={{
                display: "flex",
                columnGap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div className="flex-grow">
                <label>Licence IssueDate</label>
                <input
                  defaultValue={driverDetail.licenseIssueDate || ""}
                  name="licenseIssueDate"
                  disabled={!edit}
                  type={date}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="flex-grow">
                <label>Licence ExpireDate</label>
                <input
                  defaultValue={driverDetail.licenseExpireDate || ""}
                  name="licenseExpireDate"
                  disabled={!edit}
                  type={date}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="flex-grow">
                <label>Licence Grade</label>
                <input
                  defaultValue={driverDetail.licenseGrade || ""}
                  name="licenseGrade"
                  disabled={!edit}
                  type="text"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="flex-grow">
                <label>Licence Number</label>
                <input
                  defaultValue={driverDetail.licenseNumber || ""}
                  name="licenseNumber"
                  disabled
                  type="number"
                />
              </div>
              <div
                style={{
                  height: "150px",
                  marginBottom: "25px",
                  position: "relative",
                }}
                className="flex-grow"
              >
                <label>Driver Licence Picture</label>
                <img
                  src={driverDetail.licensePic || ""}
                  alt="licence pic"
                  style={{
                    border: "1px solid black",
                    objectFit: "cover",
                    borderRadius: "5px",
                    display: "block",
                    width: "50%",
                    height: "50%",
                    overflow: "hidden",
                    marginBottom: "10px",
                  }}
                  className="img-licence"
                />
              </div>
            </div>
            <p className="detail-part">Driver Status</p>
            <div
              style={{
                display: "flex",
                columnGap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div className="flex-grow">
                <label>Status</label>
                <input
                  value={driverDetail.status || ""}
                  name="status"
                  disabled
                />
              </div>
              <div className="flex-grow">
                <label>Vehicle Owner</label>
                <input
                  value={driverDetail.owner || ""}
                  name="vehicleOwner"
                  disabled
                />
              </div>
            </div>
            {!isCallCenter() && (
            <button className="btn w-300" disabled={!edit}>
              Update
            </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default DriverDetail;
