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

const AddCargoPost = () => {
 
  //   GETTING OWNER PHONE FROM PARAMS
  const { ownerPhone } = useParams();
  const [loading, setLoading] = useState(false);
  const PostCargoAPI =`${mainAPI}/Api/Admin/Cargo/Post`
  const apiCargoType = `${mainAPI}/Api/Admin/All/CargoType`;
  const [cargoType, setCargoType] = useState([]);
  const [error, setError] = useState();

  const [billOfLoading,setbillOfLoading]=useState();
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const getCargoType = async () => {
    try {
      const res = await fetch(apiCargoType, options);
      if (res.status == 401) {
        //showErrorMessage();
        showErrorMessage({
          message: "Unable to Load!! server respond with 401",
        });
      }
      const data = await res.json();
      if (data && res.ok) {
        console.log(data);
        setCargoType(data.cargoTypes);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    } 
  };
  const PostCargoInputs = [
    {
      label: "From",
      name: "from",
      type: "text",
      placeholder: "Departure place",
    },
    {
      label: "To",
      name: "to",
      type: "text",
      placeholder: "Arrival place",
    },
    {
        label: "Packaging",
        name: "Packaging",
        type: "text",
        placeholder: "Packaging",
      },
      {
        label: "Price",
        name: "Price",
        type: "number",
        placeholder: "Price",
      },
    {
      label: "Date",
      name: "date",
      type: "date",
      placeholder: "Pick up Date",
    },
  
    {
      label: "Weight",
      name: "weight",
      type: "number",
      placeholder: "weight",
    },
  ];
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm();
  /**************Post Cargo ********/
  const PostCargo = (formdata) => {
 console.log(formdata)

    const Post = new FormData();
    Post.append("billOfLoading", billOfLoading);
    Post.append("from", formdata.from);
    Post.append("to", formdata.to);
    Post.append("date", formdata.date);
    Post.append("price", formdata.Price);
    Post.append("cargoType", formdata.cargoType);
    Post.append("packaging", formdata.packaging);
    Post.append("weight", formdata.weight);
    Post.append("price", formdata.price);
    Post.append("cargOwnerPhone", ownerPhone);
    
    HandlePostCargo(Post);
  };
  const HandlePostCargo = async (post) => {
 
    setLoading(true);
    axios
      .post(PostCargoAPI, post, {
        headers: {
          "Content-Type": "Auto",
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => {
        const mess = res.data["message"];
        showSuccessMessage({ message: "Post Added" });
        //RESETING INPUT FIELDS
        reset();
        setbillOfLoading("");
      })
      .catch((e) => {
        showErrorMessage(e.response.data);
        console.log(e);
      })
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    getCargoType()
    //*****************USE EFFECT *******************
  }, []);

  /** HANDLIN LICENCE PICTRUE */
  const handleFile = (e) => {
    if (e.target.files[0]) {
      //  FOR DISPALYING IMAGE WHEN CHOOSEN
      setbillOfLoading(e.target.files[0]);
    } else setbillOfLoading("");
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
        <Link to={"/users"}>Back To users </Link>
      </div>
      {loading ? <LoadingPage message={"Submiting Data Please wait"} /> : ""}
      <div className="manage-window  detail-content mx-auto">
        <form onSubmit={handleSubmit(PostCargo)}>
          <p className="detail-part">To be Poste Cargo Information</p>
          <hr />
          <div
            style={{
              display: "flex",
              columnGap: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* LOOPING THROUGH VEHICLE INPUT FORMS */}
  
            {PostCargoInputs.map((inputs, index) => (
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
              Cargo Type <FaStarOfLife color="red" size={8} />
              </label>
              <select
                name="cargoType"
                {...register("cargoType", {
                  required: `${"cargoType"} is required`,
                })}
                className="align-left-m0"
              >
                <option value={""}>Select cargoType</option>
                {
                        cargoType.map(item => {
                            return <>
                                <option>{item.cargoType}</option>
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
                {errors ? errors["cargoType"]?.message : ""}
              </span>
            </div>
            
            <div className="flex-grow">
              <label htmlFor="license-pic">
              BillOf Loading <FaStarOfLife color="red" size={8} />
              </label>
              <input
                type="file"
                id="billOfLoading"
                name="billOfLoading"
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
                {billOfLoading ? "" : "BillOf Loading is required"}
              </span>
              <div>
                <img src={billOfLoading} style={{ maxWidth: "200px" }} />
              </div>
            </div>
            
          </div>
          <button className="btn w-300 mx-auto">Post</button>
        </form>
      </div>
    </div>
  );
};

export default AddCargoPost;
