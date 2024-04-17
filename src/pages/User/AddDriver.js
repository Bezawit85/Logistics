import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../components/SwalMessages";
import { mainAPI } from "../../components/mainAPI";
import { useForm } from "react-hook-form";
import { FaStarOfLife } from "react-icons/fa";
import LoadingPage from "../../components/LoadingPage";
import axios from "axios";

const AddDriver = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm();
  //   GETTING OWNER PHONE FROM PARAMS
  const { ownerPhone } = useParams();
  const [loading, setLoading] = useState(false);
  const jwt = JSON.parse(localStorage.getItem("jwt"));

  const vehicleinputForms = [
    {
      label: "Full Name",
      name: "driverName",
      type: "text",
      placeholder: "Full Name",
    },

    {
      label: "Date Of Birth",
      name: "birthDate",
      type: "date",
      placeholder: "Date of Birth",
    },
    {
      label: "Phone Number",
      name: "driverPhone",
      type: "text",
      placeholder: "Phone Number",
    },
    {
      label: "Exeperiance",
      name: "experience",
      type: "number",
      placeholder: "Exeperiance",
    },
    {
      label: "LicenseNumber",
      name: "licenseNumber",
      type: "text",
      placeholder: "License Number",
    },
    {
      label: "License Grade",
      name: "licenseGrade",
      type: "text",
      placeholder: "License Grade",
    },
    {
      label: "Issue Date",
      name: "licenseIssueDate",
      type: "date",
      placeholder: "licenseIssueDate",
    },
    {
      label: "Expire Date",
      name: "licenseExpireDate",
      type: "date",
      placeholder: "licenseExpireDate",
    },
  ];
  const handleFormSubmit = (formdata) => {
    /** GETTING DATA FROM REACT HOOK FORM */
    console.log(formdata);
    /**  CONATINATING DATA TOGETHER */
    let driverData = {
      ...formdata,
      licensePic: licensePicData,
      driverPic: driverPicData,
      ownerPhone,
      file: driverPicData,
    };
    console.log(driverData)
    const driver = new FormData();
    driver.append("driverName", driverData.driverName);
    driver.append("ownerPhone", ownerPhone);
    driver.append("licenseNumber", driverData.licenseNumber);
    driver.append("licensePic", driverData.licensePic);
    driver.append("driverPic", driverData.driverPic);
    driver.append("gender", driverData.gender);
    driver.append("birthDate", driverData.birthDate);
    driver.append("driverPhone", driverData.driverPhone);
    driver.append("experience", driverData.experience);
    driver.append("licenseGrade", driverData.licenseGrade);
    driver.append("licenseIssueDate", driverData.licenseIssueDate);
    driver.append("licenseExpireDate", driverData.licenseExpireDate);
    driver.append("file", driverData.driverPic);
    addDriver(driver);
  };
  const addDriver = async (driverData) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "auto",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(driverData),
    };
    setLoading(true);
    axios
      .post(`${mainAPI}/Api/Driver/AddDriver`, driverData, {
        headers: {
          "Content-Type": "Auto",
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => {
        const mess = res.data["message"];
        showSuccessMessage({ message: "Driver Added" });
        //RESETING INPUT FIELDS
        reset();
        setLicensePic("");
        setLicensePicData("");
        setDriverPic("");
        setDriverPicData("");
      })
      .catch((e) => {
        showErrorMessage(e.response.data);
        console.log(e);
      })
      .finally(() => setLoading(false));
    // try {
    //   setLoading(true);
    //   const res = await fetch(apiAddDriver, options);
    //   console.log("response", res.status);
    //   if (res.status == 401) {
    //     showErrorMessage({ message: "Your Session is expired" });
    //   }
    //   const data = await res.json();
    //   if (data && res.ok) {
    //     console.log(data);
    //     showSuccessMessage({ message: "Driver Added" });
    //   }
    //   if (res.status == 400) {
    //     showErrorMessage({ message: "Invalid API" });
    //   }
    // } catch (e) {
    //   console.log(e.message);
    //   setLoading(false);
    // } finally {
    //   setLoading(false);
    // }
  };
  useEffect(() => {
    //*****************USE EFFECT *******************
  }, []);
  const [licensePic, setLicensePic] = useState("");
  const [driverPic, setDriverPic] = useState("");
  const [licensePicData, setLicensePicData] = useState("");
  const [driverPicData, setDriverPicData] = useState("");
  /** HANDLIN LICENCE PICTRUE */
  const handleFile = (e) => {
    if (e.target.files[0]) {
      //  FOR DISPALYING IMAGE WHEN CHOOSEN
      setLicensePic(URL.createObjectURL(e.target.files[0]));
      setLicensePicData(e.target.files[0]);
    } else setLicensePic("");
  };
  const handleDriverPic = (e) => {
    if (e.target.files[0]) {
      setDriverPic(URL.createObjectURL(e.target.files[0]));
      setDriverPicData(e.target.files[0]);
    } else setDriverPic("");
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
        <Link to={"/users"}>Back To User</Link>
      </div>
      {loading ? <LoadingPage message={"Submiting Data Please wait"} /> : ""}
      <div className="manage-window  detail-content mx-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <p className="detail-part">Driver Information</p>
          <hr />
          <div
            style={{
              display: "flex",
              columnGap: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* LOOPING THROUGH VEHICLE INPUT FORMS */}
            {vehicleinputForms.map((inputs, index) => (
              <div className="flex-grow" key={index}>
                <label>
                  {inputs.label} <FaStarOfLife color="red" size={8} />{" "}
                </label>
                <div className="" style={{ marginBottom: "10px" }}>
                  <input
                    name={inputs.name}
                    type={inputs.type}
                    placeholder={inputs.placeholder}
                    {...register(inputs.name, {
                      required: `${inputs.label} is required`,
                    })}
                    className="align-left-m0"
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color: "red",
                    }}
                  >
                    {errors ? errors[inputs.name]?.message : ""}
                  </span>
                </div>
              </div>
            ))}
            {/* ADDING SELECT TAGS */}
            <div className="flex-grow">
              <label>
                Gender <FaStarOfLife color="red" size={8} />
              </label>
              <select
                name="gender"
                {...register("gender", {
                  required: `${"Gender"} is required`,
                })}
                className="align-left-m0"
              >
                <option value={""}>Select Gender</option>
                <option value={"MALE"}>MALE</option>
                <option value={"FEMALE"}>FEMALE</option>
              </select>
              <span
                style={{
                  fontSize: "12px",
                  color: "red",
                }}
              >
                {errors ? errors["gender"]?.message : ""}
              </span>
            </div>
            <div className="flex-grow">
              <label htmlFor="license-pic">
                Licence Pic <FaStarOfLife color="red" size={8} />
              </label>
              <input
                type="file"
                id="license-pic"
                name="licensePic"
                accept="image/*"
                onChange={(e) => handleFile(e)}
                className="align-left-m0"
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "red",
                }}
              >
                {licensePic ? "" : "License Pic is required"}
              </span>
              <div>
                <img src={licensePic} style={{ maxWidth: "200px" }} />
              </div>
            </div>
            <div className="flex-grow">
              <label htmlFor="driver-pic">
                Driver Pic <FaStarOfLife color="red" size={8} />
              </label>
              <input
                type="file"
                id="driver-pic"
                name="licensePic"
                accept="image/*"
                onChange={(e) => handleDriverPic(e)}
                className="align-left-m0"
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "red",
                }}
              >
                {driverPic ? "" : "Driver Pic is required"}
              </span>
              <div>
                <img src={driverPic} style={{ maxWidth: "200px" }} />
              </div>
            </div>
          </div>
          <button className="btn w-300 mx-auto">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;
