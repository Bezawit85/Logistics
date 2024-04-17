import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../components/SwalMessages";
import { mainAPI } from "../components/mainAPI";
import { useForm } from "react-hook-form";
import { FaStarOfLife } from "react-icons/fa";
import LoadingPage from "../components/LoadingPage";
import axios from "axios";

const CargoOwnerRegistration = ({isCallCenter}) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm();
  //   GETTING OWNER PHONE FROM PARAMS
  const [loading, setLoading] = useState(false);
  const notificationapi = `${mainAPI}/Api/Admin/All/NotificationMedium`;
  const serviceapi = `${mainAPI}/Api/Admin/All/Services`;
  const businessSectorapi = `${mainAPI}/Api/Admin/All/BusinessSectors`;
  const businessTypeapi = `${mainAPI}/Api/Admin/All/BusinessTypes`;
  const [businessSector, setbusinessSector] = useState([]);
  const [businessType, setbusinessType] = useState([]);
  const [error, setError] = useState();
  const [licenseFile, setLicenseFile] = useState("");
  const [tinFile, setTinFile] = useState("");
  const [cargOwnerPic, setProPic] =useState("")

  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const CargoInfo = [
    {
      label: "Name ",
      name: "name",
      type: "text",
      placeholder: "Name",
    },

    {
      label: "License Number",
      name: "licenseNumber",
      type: "text",
      placeholder: "License Number",
    },
    {
      label: "Tin Number",
      name: "tinNumber",
      type: "text",
      placeholder: "Tin Number",
    },
    {
      label: "Business Name",
      name: "businessName",
      type: "text",
      placeholder: "Business Name",
    },
    {
      label: "City",
      name: "city",
      type: "text",
      placeholder: "City",
    },
    {
        label: "Sub City",
        name: "subCity",
        type: "text",
        placeholder: "Sub City",
      },
    {
        label: "Region",
        name: "region",
        type: "text",
        placeholder: "Region",
      },
      {
        label: "Specific Location",
        name: "specificLocation",
        type: "text",
        placeholder: "Specific Location",
      },
    {
      label: "Woreda",
      name: "woreda",
      type: "text",
      placeholder: "Woreda",
    },
    {
        label: "House Number ",
        name: "houseNumber",
        type: "text",
        placeholder: "House Number ",
      },
      {
        label: "Phone Number ",
        name: "phoneNumber",
        type: "phone",
        placeholder: "Phone Number ",
      },
    
  ];
 

    //*****************USE EFFECT *******************
    const getbusinessSector = async () => {
        try {
          const res = await fetch(businessSectorapi, options);
          if (res.status == 401) {
            setError("Unable to Load!! server respond with 401");
          }
          const data = await res.json();
          if (data && res.ok) {
            setbusinessSector(data.businessSectors);
            console.log(data)
          }
          if (res.status == 400) {
            setError("Invalid API server 400");
          }
        } catch (e) {
          showErrorMessage(e);
        }
      };
      const getbusinessType = async () => {
        try {
          const res = await fetch(businessTypeapi, options);
          if (res.status == 401) {
            setError("Unable to Load!! server respond with 401");
          }
          const data = await res.json();
          if (data && res.ok) {
            setbusinessType(data.businessSectors);
            console.log(data)
          }
          if (res.status == 400) {
            setError("Invalid API server 400");
          }
        } catch (e) {
          showErrorMessage(e);
        }
      };

    
      useEffect(() => {
        getbusinessType()
        getbusinessSector()
      
    }, []);


      const handleFormSubmit =(formdata)=> 
      {
  
       
        /**  CONATINATING DATA TOGETHER */
        let cargoOwnerInfo = {
          ...formdata,
          licenseFile: licenseFile,
          cargOwnerPic: cargOwnerPic,
          tinFile:tinFile
         
        };
        console.log(cargoOwnerInfo);
              const formData = new FormData();
              formData.append("name", cargoOwnerInfo.name);
              formData.append("licenseNumber", cargoOwnerInfo.licenseNumber);
              formData.append("tinNumber", cargoOwnerInfo.tinNumber);
              formData.append("businessName", cargoOwnerInfo.businessName);
              formData.append("businessType", cargoOwnerInfo.businessType);
              formData.append("businessSector", cargoOwnerInfo.businessSector);
              formData.append("region", cargoOwnerInfo.region);
              formData.append("subCity", cargoOwnerInfo.subCity);
              formData.append("specificLocation", cargoOwnerInfo.specificLocation);
              formData.append("city", cargoOwnerInfo.city);
              formData.append("woreda", cargoOwnerInfo.woreda);
              formData.append("houseNumber", cargoOwnerInfo.houseNumber);
              formData.append("phoneNumber", cargoOwnerInfo.phoneNumber);
              formData.append("licenseFile", cargoOwnerInfo.licenseFile);
              formData.append("tinFile", cargoOwnerInfo.tinFile);
              formData.append('cargOwnerPic',cargoOwnerInfo.cargOwnerPic);
              AddCargoOwner(formData)
              // console.log('submited')
      }
      let mess
      const AddCargoOwner = async (formData)=>{
  
              setLoading(true);
          axios.post(
                  `${mainAPI}/Api/CargoOwner/Register`,
                  formData,
                  {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                        "Authorization": `Bearer ${jwt}`,
                      },
                      })
                     
              .then((res) => {
                 mess = res.data["message"];
                showSuccessMessage({ message: mess });
                setbusinessSector("");
                setbusinessType("");
                setLicenseFile("");
                setTinFile("");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                setProPic("")
              })
              .catch((e) => {
                
                console.log(e.message)
                showErrorMessage({message:'Check company name or phone number'});
                console.log(e);
              })
              .finally(() => setLoading(false));
            }

  /** HANDLIN LICENCE PICTRUE */

  /** HANDLIN LICENCE PICTRUE */
  const handlecargOwnerPic = (e) => {
    if (e.target.files[0]) {
      //  FOR DISPALYING IMAGE WHEN CHOOSEN
        setProPic(e.target.files[0]);
      }else setProPic("");
    } 
    const handletinFile = (e) => {
        if (e.target.files[0]) {
          setTinFile(e.target.files[0]);
        }else setTinFile("");
    }
    const handlelicenseFile = (e) => {
        if (e.target.files[0]) {
        setLicenseFile(e.target.files[0]);
        }else setLicenseFile("");
    }
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
              <div className="registrationChoicee">
                    <Link className='link' to='/companyOwnerRegister'><h3>Company</h3></Link> 
                    <Link className='link' to='/IndividualRegister'> <h3>Individual</h3></Link>  
                    <h3 className="Active">Cargo</h3>
              </div>
              <hr />
              <br/>
              <h3>Owner Information</h3>
              <br/>
          <div
                    style={{
                    display: "flex",
                    columnGap: "20px",
                    flexWrap: "wrap",
                    }}
                >
                {/* LOOPING THROUGH VEHICLE INPUT FORMS */}
                {CargoInfo.map((inputs, index) => (
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
                <div/>
                <br />
                 <h3>Business Information</h3>
                <br /><br />
            <div
                    style={{
                    display: "flex",
                    columnGap: "20px",
                    flexWrap: "wrap",
                    }}
                >
                  {/* ADDING SELECT TAGS */}
                  
                  <div className="flex-grow">
                  
                    <label>
                    Business Type <FaStarOfLife color="red" size={8} />
                    </label>
                 <select
                      name="businessType"
                      {...register("businessType", {
                        required: `${"Business Type"} is required`,
                      })}
                      className="align-left-m0"
                    >
                      <option value={""}>Select Business Type</option>
                      {
                                  businessType.map(item => {
                                      return <>
                                          <option>{item.businessType}</option>
                                      </>
                                  })
                              }
                  </select>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "red",
                              }}
                            >
                              {errors ? errors["companyType"]?.message : ""}
                              </span>
                </div>


                <div className="flex-grow">
                        <label>
                        Business Sector <FaStarOfLife color="red" size={8} />
                        </label>
                        <select
                            name="businessSector"
                            {...register("businessSector", {
                            required: `${"Company Sector"} is required`,
                            })}
                            className="align-left-m0"
                        >
                            <option value={""}>Select Company Sector</option>
                            {/* <option value={"PLC"}>PLC</option> */}
                            {
                                        businessSector.map(item => {
                                            return <>
                                                <option>{item.businessSector}</option>
                                            </>
                                        })
                                    }
                        </select>
                        <span
                            style={{
                            fontSize: "12px",
                            color: "red",
                            }}
                        >
                                {errors ? errors["businessSector"]?.message : ""}
                            </span>
                    </div>
              
                     <div className="flex-grow">
                        
                                  <label htmlFor="tin-pic">
                                  Scanned Tin <FaStarOfLife color="red" size={8} />
                                  </label>
                                  <input
                                      type="file"
                                      id="tin-pic"
                                      name="tinFile"
                                      accept="image/*"
                                      onChange={(e) => setTinFile(e.target.files[0])}
                                      className="align-left-m0"
                                  />
                                  <span
                                      style={{
                                      fontSize: "12px",
                                      color: "red",
                                      }}
                                  >
                                      {tinFile ? "" : "Tin File Pic is required"}
                                  </span>
                                  <div>
                                      <img src={tinFile} style={{ maxWidth: "100px" }} />
                                  </div>
                          </div>

                            <div className="flex-grow">
                                    <label htmlFor="tin-pic">
                                    Scanned business license <FaStarOfLife color="red" size={8} />
                                    </label>
                                    <input
                                        type="file"
                                        id="tin-pic"
                                        name="licenseFile"
                                        accept="image/*"
                                        onChange={(e) => setLicenseFile(e.target.files[0])}
                                        className="align-left-m0"
                                    />
                                    <span
                                        style={{
                                        fontSize: "12px",
                                        color: "red",
                                        }}
                                    >
                                        {licenseFile ? "" : "business license is required"}
                                    </span>
                                    <div>
                                        <img src={licenseFile} style={{ maxWidth: "100px" }} />
                                    </div>
                            </div>
                             <div className="flex-grow">
                                          <label htmlFor="tin-pic">
                                          Cargo owner picture <FaStarOfLife color="red" size={8} />
                                          </label>
                                          <input
                                              type="file"
                                              id="tin-pic"
                                              name="cargOwnerPic"
                                              accept="image/*"
                                              onChange={(e) => setProPic(e.target.files[0])}
                                              className="align-left-m0"
                                          />
                                          <span
                                              style={{
                                              fontSize: "12px",
                                              color: "red",
                                              }}
                                          >
                                              {cargOwnerPic ? "" : "business license is required"}
                                          </span>
                                          <div>
                                              <img src={cargOwnerPic} style={{ maxWidth: "100px" }} />
                                          </div>
                              </div>
                 </div>
         
           </div>
         
{!isCallCenter() && (
             <button className="btn w-300 mx-auto">Submit</button>
)}
        </form>
      </div>
    </div>
  );
};

export default CargoOwnerRegistration;
