import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaStarOfLife } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../components/SwalMessages";
import { mainAPI } from "../../components/mainAPI";
import LoadingPage from "../../components/LoadingPage";

const AddVehicle = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm();
  const apiVehicleCatagory = `${mainAPI}/Api/Admin/All/VehicleCatagory`;
  const [loading, setLoading] = useState(false);
  const [vehicleCatagory, setVehicleCatagory] = useState([]);
  const [vehicleConditions, setVehicleConditions] = useState([]);
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  // GETTING OWNER PHONE FROM PARAMS
  const { ownerPhone } = useParams();
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const vehicleinputForms = [
    {
      label: "Vehicle Name",
      name: "vehicleName",
      type: "text",
      placeholder: "Vehicle Name",
    },
    {
      label: "PlateNumber",
      name: "plateNumber",
      type: "number",
      placeholder: "Plate Number",
    },
    {
      label: "ManuFacture Date",
      name: "manufactureDate",
      type: "date",
      placeholder: "Manufacture Date",
    },
    {
      label: "Device ID",
      name: "deviceID",
      type: "text",
      placeholder: "Device ID",
    },
    {
      label: "Capacity",
      name: "capacity",
      type: "text",
      placeholder: "Capactiy",
    },
  ];

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
  // ***** FOR GETTING VEHICLE CATAGORY AND CONDITION
  useEffect(() => {
    getVehicleCatagorys();
    getVehicleConditions();
  }, []);
  const handleFormSubmit = (formdata) => {
    let data = { ...formdata, ownerPhone };
    // CALLING ADDVEHICLE WITH DATA ARGUMENT
    addVehicle(data);
  };
  //ADD Vehicle FUNCTION
  const addVehicle = async (vehicle) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(vehicle),
    };
    const url = `${mainAPI}/Api/Vehicle/AddVehicle`;
    setLoading(true);
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const mess = result["message"];
      if (response.ok) {
        console.log("updated successful");
        showSuccessMessage({ message: mess });
        //RESET INPUT FIEDS
        reset();
      } else {
        showErrorMessage({ message: mess });
      }
    } catch (error) {
      console.error(error);
      showErrorMessage(error);
    } finally {
      setLoading(false);
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
        <Link to={"/users"}>Back To Users</Link>
      </div>
      {/* SHOWING POP UP */}
      {loading ? <LoadingPage message={"Submiting Data Please wait"} /> : ""}
      <div className="manage-window  detail-content mx-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <p className="detail-part">ADD VEHICLE</p>
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
                Vehicle Catagory <FaStarOfLife color="red" size={8} />
              </label>
              <select
                name="vehicleCatagory"
                {...register("vehicleCatagory", {
                  required: `${"Vehicle Catagory"} is required`,
                })}
                className="align-left-m0"
              >
                <option value={""}>Select Catagory</option>
                {vehicleCatagory.map((item, index) => (
                  <option value={item.catagory} key={index}>
                    {item.catagory}
                  </option>
                ))}
              </select>
              <span
                style={{
                  fontSize: "12px",
                  color: "red",
                }}
              >
                {errors ? errors["vehicleCatagory"]?.message : ""}
              </span>
            </div>
            <div className="flex-grow " style={{}}>
              <label>
                Vehicle Condition <FaStarOfLife color="red" size={8} />
              </label>
              <select
                name="vehicleCondition"
                {...register("vehicleCondition", {
                  required: `${"vehicleCondition"} is required`,
                })}
                className="align-left-m0"
              >
                <option value={""}>Select Condition</option>
                {vehicleConditions.map((condition, index) => (
                  <option value={condition.conditionName} key={index}>
                    {condition.conditionName}
                  </option>
                ))}
              </select>
              <span
                style={{
                  fontSize: "12px",
                  color: "red",
                }}
              >
                {errors ? errors["vehicleCondition"]?.message : ""}
              </span>
            </div>
          </div>
          <button className="btn w-300 mx-auto mt-20">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
