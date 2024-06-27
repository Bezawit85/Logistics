import React, { useState } from "react";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import { mainAPI, endpoints } from "../../components/mainAPI";
import "./generate.css";

const Generate = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState(null);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  console.log("JWT Token:", jwt); 
  const passwordReset = `${mainAPI}${endpoints.Verify}`;

  const onSubmit = async (formData) => {
    
    try {
      const options = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      };
      const response = await fetch(passwordReset, options);
      const result = await response.json();
      console.log("Response from backend:", result);
      if (response.status === 200) {
        console.log("Password Changed Successfully");
        setPasswordChanged(true);
        swal("Success", "Password changed successfully!", "success");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        setError("Failed to reset password");
      }
    } catch (error) {
      setError("Error changing password.");
    }
  };

  if (passwordChanged) {
    return null;
  }

  return (
    <div className="manage-window detail-content w-300 ">
      <h3 style={{ textAlign: "center" }}>Reset password</h3>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Password:
            <input
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="error-message" style={{ color: "red" }}>
                Password is required
              </span>
            )}
          </label>
          <label>
            Confirm Password:
            <input
              type="password"
              {...register("confirmPassword", {
                required: true,
                validate: (value) => value === watch("password"),
              })}
            />
            {errors.confirmPassword && (
              <span className="error-message" style={{ color: "red" }}>
                Passwords must match
              </span>
            )}
          </label>
          {error && (
            <div className="error-message" style={{ color: "red" }}>
              {error}
            </div>
          )}
          <button type="submit" className="btns">
            Done
          </button>
        </form>
      </div>
    </div>
  );
};

export default Generate;
