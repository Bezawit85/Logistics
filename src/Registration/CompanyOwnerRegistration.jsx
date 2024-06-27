import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../components/SwalMessages";
import { mainAPI, endpoints } from "../components/mainAPI";
import { useForm } from "react-hook-form";
import { FaStarOfLife } from "react-icons/fa";
import LoadingPage from "../components/LoadingPage";
import axios from "axios";

const CompanyOwnerRegistration = ({isCallCenter}) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm();
  //   GETTING OWNER PHONE FROM PARAMS
  const { ownerPhone } = useParams();
  const [loading, setLoading] = useState(false);
  const notificationapi = `${mainAPI}${endpoints.List.Notification}`;
  const serviceapi = `${mainAPI}${endpoints.List.Services}`;
  const apiVehicleCondition = `${mainAPI}${endpoints.List.VehicleCondition}`;
  const apiVehicleCatagory = `${mainAPI}${endpoints.List.VehicleCatagory}`;
  const companySectorapi = `${mainAPI}${endpoints.List.CompanySector}`;
  const companyTypeapi = `${mainAPI}${endpoints.List.CompanyType}`;
  const [companySector, setcompanySector] = useState([]);
  const [companyType, setcompanyType] = useState([]);
  const [vehicleCatagory, setVehicleCatagory] = useState([]);
  const [vehicleConditions, setVehicleConditions] = useState([]);
  const [service, setService] = useState([]);
  const [notification, setNotification] = useState([]);
  const [error, setError] = useState();


  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const CompanyInfo = [
    {
      label: "Company Name ",
      name: "companyName",
      type: "text",
      placeholder: "Company Name ",
    },

    {
      label: "Region",
      name: "region",
      type: "text",
      placeholder: "Region",
    },
    {
      label: "Sub City ",
      name: "subCity",
      type: "text",
      placeholder: "Sub City ",
    },
    {
      label: "Specfic Location",
      name: "specificLocation",
      type: "text",
      placeholder: "Specfic Location",
    },
    {
      label: "City",
      name: "city",
      type: "text",
      placeholder: "City",
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
  const OwnerInfo = [
    {
        label: "First Name",
        name: "firstName",
        type: "text",
        placeholder: "First Name",
      },
      {
        label: "Last Name ",
        name: "lastName",
        type: "text",
        placeholder: "Last Name ",
      },
      {
        label: "Phone Number ",
        name: "ownerPhoneNumber",
        type: "phone",
        placeholder: "Phone Number ",
      },
      {
        label: "Email ",
        name: "email",
        type: "text",
        placeholder: "Email ",
      }
        ]

    //*****************USE EFFECT *******************
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
      const getCompanyType = async () => {
        try {
          const res = await fetch(companyTypeapi, options);
          if (res.status == 401) {
            setError("Unable to Load!! server respond with 401");
          }
          const data = await res.json();
          if (data && res.ok) {
            setcompanyType(data.companyTypes);
            console.log(data.companyTypes[0].companyType)
          }
          if (res.status == 400) {
            setError("Invalid API server 400");
          }
        } catch (e) {
          showErrorMessage(e);
        }
      };

      const getVehicleCatagorys = async () => {
        try {
          const res = await fetch(apiVehicleCatagory, options);
          if (res.status == 401) {
            //showErrorMessage();
            showErrorMessage({ message: "Session Expire 401" });
          }
          const data = await res.json();
          if (data && res.ok) {
            setVehicleCatagory(data.vehicleCatagories);
          }
        } catch (e) {
          showErrorMessage(e);
        }
      };
      const getVehicleConditions = async () => {
        try {
          const res = await fetch(apiVehicleCondition, options);
          if (res.status == 401) {
            showErrorMessage({ message: "Session Expire 401" });
          }
          const data = await res.json();
          if (data && res.ok) {
            setVehicleConditions(data.vehicleConditions);
            // console.log(data.vehicleConditions);
          }
        } catch (e) {
          showErrorMessage(e);
        }
      };

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
      useEffect(() => {
        getCompanySector()
        getCompanyType()
        getServieces()
        getVehicleCatagorys()
        getVehicleConditions()
        getNotification()
    }, []);



  const handleFormSubmit = (formdata) => {
    /** GETTING DATA FROM REACT HOOK FORM */
    console.log(formdata);
    /**  CONATINATING DATA TOGETHER */
    let driverData = {
      ...formdata
    };
    console.log(driverData)
    let item =
        {
            companyName: driverData.companyName,
            companyType:driverData.companyType,
            companySector:driverData.companySector,
            region:driverData.region ,
            city:driverData.city,
            subCity:driverData.subCity,
            woreda:driverData.woreda,
            specificLocation:driverData.specificLocation,
            houseNumber:driverData.houseNumber,
            phoneNumber:driverData.phoneNumber,
            firstName:driverData.firstName,
            lastName:driverData.lastName,
            ownerPhoneNumber:driverData.ownerPhoneNumber,
            email:driverData.email,
            notificationmedia:driverData.notificationmedia,
            serviceRequired:driverData.serviceRequired,
            vehicles: [
                {
                    vehicleName:driverData.vehicleName,
                    vehicleCatagory: {
                        catagory:driverData.catagory,
                    },
                    vehicleCondition: {
                        conditionName:driverData.conditionName,
                    },

                    plateNumber:driverData.plateNumber,
                    manufactureDate:driverData.manufactureDate,
                    deviceID:driverData.deviceID,
                    capacity:driverData.capacity,
                },

            ]


        };
 

    CompanyOwnerRegistration(item);
  };
  const CompanyOwnerRegistration = async (CompanyOwnerInfo) => {
  
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    };
  
    setLoading(true);
  
    try {
      const response = await fetch(`${mainAPI}/Api/Company/CreateCompany`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(CompanyOwnerInfo),
      });
  
      if (response.ok) {
        const data = await response.json();
        const mess = data.message;
        showSuccessMessage({ message: "Company owner Added" });
        // RESETING INPUT FIELDS
        reset();
      } else {
        const errorData = await response.json();
        showErrorMessage(errorData);
        console.log(errorData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  /** HANDLIN LICENCE PICTRUE */

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
                    <h3 className="Active">Company</h3>
                    <Link className="link" to='/IndividualRegister'> <h3>Individual</h3></Link>  
                    <Link  className="link" to='/cargoOwnerRegister'><h3>Cargo</h3></Link>
              </div>
              <hr />
              <br/>
              <h3>Company Information</h3>
              <br/>
          <div
                    style={{
                    display: "flex",
                    columnGap: "20px",
                    flexWrap: "wrap",
                    }}
                >
                {/* LOOPING THROUGH VEHICLE INPUT FORMS */}
                {CompanyInfo.map((inputs, index) => (
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
              Company Type <FaStarOfLife color="red" size={8} />
              </label>
              <select
                name="companyType"
                {...register("companyType", {
                  required: `${"Company Type"} is required`,
                })}
                className="align-left-m0"
              >
                <option value={""}>Select Company Type</option>
                {
                            companyType.map((item,index) => {
                                return <>
                                    <option key={index}>{item.companyType}</option>
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
              Company Sector <FaStarOfLife color="red" size={8} />
              </label>
              <select
                name="companySector"
                {...register("companySector", {
                  required: `${"Company Sector"} is required`,
                })}
                className="align-left-m0"
              >
                <option value={""}>Select Company Sector</option>
                {
                            companySector.map((item,index) => {
                                return <>
                                    <option key={index}>{item.sectorName}</option>
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
                    {errors ? errors["companySector"]?.message : ""}
                </span>
                </div>
         </div>
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
          

         {OwnerInfo.map((inputs, index) => (
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

        </div>
        <br/>
        <h3>Additional Information</h3>
        <br/>
             <div
             
             style={{
                display: "flex",
                columnGap: "20px",
                flexWrap: "wrap",
                }}>
                
                <div className="flex-grow">
              <label>
              Service Neded <FaStarOfLife color="red" size={8} />
              </label>
              <select
                name="serviceRequired"
                {...register("serviceRequired", {
                  required: `${"service"} is required`,
                })}
                className="align-left-m0"
              >
                <option value={""}>Select Service Required</option>
                {
                            service.map((item,index) => {
                                return <>
                                    <option key={index}>{item.service}</option>
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
                {errors ? errors["serviceRequired"]?.message : ""}
              </span>
             </div>
            
             <div className="flex-grow">
              <label>
              Notification Pereference  <FaStarOfLife color="red" size={8} />
              </label>
              <select
                name="notificationmedia"
                {...register("notificationmedia", {
                  required: `${"notificationmedia"} is required`,
                })}
                className="align-left-m0"
              >
                <option value={""}>Select Notification media</option>
                {
                            notification.map((item,index) => {
                                return <>
                                    <option key={index}>{item.medium}</option>
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
                {errors ? errors["notificationmedia"]?.message : ""}
              </span>
                </div>
         </div>
    <br/>
    <h2>Vehicle Information</h2>
    <br/>
    <div
        
        style={{
          display: "flex",
          columnGap: "20px",
          flexWrap: "wrap",
          }}>
                
            <div className="flex-grow">
                      <label>
                      Vehicle Category<FaStarOfLife color="red" size={8} />
                      </label>
                      <select
                        name="catagory"
                        {...register("catagory", {
                          required: `${"catagory"} is required`,
                        })}
                        className="align-left-m0"
                      >
                        <option value={""}>Select Service Required</option>
                        {
                                    vehicleCatagory.map((item,index) => {
                                        return <>
                                            <option key={index}>{item.catagory}</option>
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
                        {errors ? errors["catagory"]?.message : ""}
                      </span>
             </div>
            
             <div className="flex-grow">
                  <label>
                  Vehicle Condition <FaStarOfLife color="red" size={8} />
                  </label>
                  <select
                    name="conditionName"
                    {...register("conditionName", {
                      required: `${"conditionName"} is required`,
                    })}
                    className="align-left-m0"
                  >
                    <option value={""}>Select vehicle condition</option>
                    {
                                vehicleConditions.map((item,index) => {
                                    return <>
                                        <option key={index}>{item.conditionName}</option>
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
                        {errors ? errors["conditionName"]?.message : ""}
                      </span>
               </div>
                  <div className="flex-grow">
                      <p>Vehicle Name <FaStarOfLife style={{marginBottom:"2px"}}
                       className='icon' size="0.5rem" color='red'></FaStarOfLife></p>
                      <input name='vehicleName' type="text"
                        {...register("vehicleName", {
                            required: `${"vehicleName"} is required`,
                          })}
                        placeholder='Enter Vehicle Name'
                       ></input>
                   <span
                                  style={{
                                    fontSize: "12px",
                                    color: "red",
                                  }}
                                >
                                  {errors ? errors["vehicleName"]?.message : ""}
                                </span>            
                                
                    </div>
              <div className="flex-grow">
                    <p>Plate Number <FaStarOfLife style={{marginBottom:"2px"}} 
                    className='icon' size="0.5rem" color='red'></FaStarOfLife></p>
                  
                        <input type="text" placeholder='Please Enter Plate Number'
                         name='plateNumber'
                            {...register("plateNumber", {
                                required: `${"plateNumber"} is required`,
                              })}
                             >
                        </input>
                                      <span
                              style={{
                                fontSize: "12px",
                                color: "red",
                              }}
                            >
                              {errors ? errors["plateNumber"]?.message : ""}
                            </span>                    
                     
                </div>
            
                <div className="flex-grow">
                        <p>Manufacture Date <FaStarOfLife style={{marginBottom:"2px"}} className='icon' size="0.5rem" color='red'></FaStarOfLife></p>
                        <input name='manufacture_date' type="date"
                         {...register("manufactureDate", {
                                required: `${"manufactureDate"} is required`,
                              })}
                             >
                        </input>
                        <span
                            style={{
                            fontSize: "12px",
                            color: "red",
                            }}
                                    >
                            {errors ? errors["manufactureDate"]?.message : ""}
                          </span>  
                    </div> 
               
                  <div className="flex-grow">
                          <p>Device ID <FaStarOfLife style={{marginBottom:"2px"}} className='icon' size="0.5rem" color='red'></FaStarOfLife></p>
                          <input name='deviceID' type="text"
                          placeholder="Device Id"
                          {...register("deviceID", {
                                  required: `${"deviceID"} is required`,
                                })}
                              >
                          </input>
                          <span
                              style={{
                              fontSize: "12px",
                              color: "red",
                              }}
                          >
                            {errors ? errors["deviceID"]?.message : ""}
                          </span> 
                      </div>
               
                    <div className="flex-grow">
                                <p>Capacity <FaStarOfLife style={{marginBottom:"2px"}} className='icon' size="0.5rem" color='red'></FaStarOfLife></p>
                                <input name='capacity' type="text"
                                placeholder="Capacity"
                              {...register("capacity", {
                                        required: `${"capacity"} is required`,
                                      })}
                                    >
                                </input>
                                <span
                                    style={{
                                    fontSize: "12px",
                                    color: "red",
                                    }}
                                >
                                  {errors ? errors["capacity"]?.message : ""}
                                </span> 
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

export default CompanyOwnerRegistration;
