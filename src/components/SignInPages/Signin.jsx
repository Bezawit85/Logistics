import React from "react";
import "./Signin.css";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { useUserContext } from "../context/UserContext";
import LoadingPage from "../LoadingPage";
import { mainAPI, endpoints } from "../mainAPI";
import { showErrorMessage } from "../SwalMessages";
import Generate from "../../pages/CreateUsers/Generate";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [pass, showPass] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const { setCurrentUser } = useUserContext();
  const logoApi = `${mainAPI}${endpoints.List.LogoandAvatar}`;
  const signInurl = `${mainAPI}${endpoints.Signin}`;

  const [logo, setLogo] = useState("");
  const [showGeneratePopup, setShowGeneratePopup] = useState(false);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer`,
    },
  };
  const toggleEye = () => {
    showPass(!pass);
  };
  const validation = (e) => {
    e.preventDefault();

    if (username.length == 0 || password.length == 0) {
      setError(true);
    }
    if (username && password) {
      login();
    }
  };
  async function login() {
    setShowLoading(true);
    let item = { username, password };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer`,
      },
      body: JSON.stringify(item),
    };
    try {
      const response = await fetch(signInurl, options);
      const result = await response.json();
      console.log("Flag:", result.user['flag']);
      if (response.status === 200) {
        const role = result.user.role;
        const Flag = result.user.flag;
        if (Flag !== "OTP") {
          handleSuccessfulLogin(result);
        } else {
          setShowGeneratePopup(true);
          setCurrentUser(result.user);
        }
      } else if (response.status === 401) {
        setError("Unable to Load!! server respond with 401");
      } else {
        swal({
          title: "Failed To Login",
          text: "Wrong Password or Username!",
          icon: "error",
          dangerMode: true,
          buttons: {
            confirm: true,
          },
          cancelButtonColor: "#d33",
          showClass: {
            popup: "animate__animated animate__shakeX",
          },
        });
      }
    } catch (error) {
      swal({
        title: "Something Went Wrong?",
        text: "Please check your internet connection.",
        icon: "warning",
        dangerMode: true,
        buttons: [false, true],
        cancelButtonColor: "#d33",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
      });
    } finally {
      setShowLoading(false);
    }
  }
  const handleSuccessfulLogin = (result) => {
    swal("Successful", `Welcome To ${result.user.role} DashBoard`, "success", {
      buttons: false,
      timer: 2000,
    }).then(() => {
      setCurrentUser(result.user);
      localStorage.setItem("user", JSON.stringify(result["user"]));
      localStorage.setItem("jwt", JSON.stringify(result["jwt"]));
      console.log("JWT Token stored:", result["jwt"]);
      localStorage.removeItem("expire");
      window.location.href = "/";
    });
  };
  

  const getAvatar = async () => {
    try {
      const res = await fetch(logoApi, options);
      if (res.status == 401) {
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setLogo(data.logo);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    }
  };

  return (
    <>
      {showLoading && <LoadingPage message={"Loging You In please Wait"} />}
      <div className="SigninWrapper">
        <div className="left-side">
          {/* <div className="left-SideInner"> */}
          <img className="signinLogo" src={logo} alt="BazraLogo" />
          <span className="signInBold">Bazra Tracker System</span>
          <p>
            A system that controls every movement of a driver and ensures timely
            delivery of its packages.
            <strong> Trusted by everyone.</strong>{" "}
          </p>
          {/* </div> */}
        </div>
        <form className="SigninForm" onSubmit={validation}>
          <h3 className="signintitle">Sign in</h3>
          <div className="Signin">
            <label>Phone number</label>
            <input
              className="signInput"
              type="text"
              id="nameInput"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              name="username"
            ></input>
            {error && username.length <= 0 ? (
              <span className="validateText" style={{ color: "red" }}>please enter your username</span>
            ) : (
              ""
            )}
            <label>Password</label>
            <div className="passWrapper">
              <input
                className="signInput"
                id="passInput"
                type={pass ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                name="password"
              />
              <AiOutlineEye onClick={toggleEye} className="eye" />
            </div>
            {error && password.length <= 0 ? (
              <span className="validateText" style={{ color: "red" }}>please enter your password</span>
            ) : (
              ""
            )}
            <Link to="/ForgatePass">
              {" "}
              <p type="button">Forget Password?</p>{" "}
            </Link>
          </div>
          <div className="signin-div">
            <button className="signIn-btn">Sign in</button>
          </div>
        </form>
      </div>
      {showGeneratePopup && (
         <div className="popup0">
        <div className="popup">
          <Generate />
        </div>
        </div>
      )}
    </>
  );
}
