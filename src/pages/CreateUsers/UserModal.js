import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import axios from "axios";
import { mainAPI } from "../../components/mainAPI";
import "./create.css";

const UserModal = ({ isOpen, onCloseModal}) => {
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const rolesapi = `${mainAPI}/Api/Admin/All`;
  const adminCreate = `${mainAPI}/Api/SignUp/User`;

  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await axios.get(rolesapi, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setRoles(response.data.roles);
      } catch (error) {
        setError("Failed to fetch roles from the server.");
      }
    };

    getRoles();
  }, [rolesapi, jwt]);

  const onSubmit = async (formData) => {
    console.log("Form Data:", formData);
    try {
      const response = await axios.post(adminCreate, formData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Backend Response:", response.data);
      if (response.status === 200) {
        console.log("User created successfully");
        swal("Successful", `User created successfully`, "success", {
          buttons: false,
          timer: 2000,
        });
        alert(response.data.message);
        reset();
      } else {
        setError("Failed to create user.");
      }
    } catch (error) {
      console.error(
        "Error creating user:",
        error.response ? error.response.data : error.message
      );
      setError("Error creating user.");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create User</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>
                Role:
                <select {...register("role", { required: true })} style={{padding:"4px", marginLeft:"10px", textAlign:"center", fontFamily:"poppins, sans-serif"}}>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name} >
                      {role.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="labelList">
                First Name:
                <input
                  type="text"
                  style={{ fontSize: "14px", letterSpacing: "1px" }}
                  {...register("firstName", { required: true })}
                />
              </label>
              <label className="labelList">
                Last Name:
                <input
                  type="text"
                  style={{ fontSize: "14px", letterSpacing: "1px" }}
                  {...register("lastName", { required: true })}
                />
              </label>
              <label className="labelList">
                Phone Number:
                <input
                  type="text"
                  style={{ fontSize: "14px", letterSpacing: "1px" }}
                  {...register("phoneNumber", { required: true })}
                />
              </label>
              {error && <p style={{ color: "red" }}>{error}</p>}
                <div className="doneBtn"><button type="submit" className="done">
                  Done
                </button>
                <button className="cancl" onClick={onCloseModal}>
                  Cancel
                </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserModal;
