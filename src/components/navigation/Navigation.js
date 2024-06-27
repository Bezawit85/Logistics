import {React, useState} from "react";
import "./navigation.css";
import Swal from 'sweetalert2' 
import { useNavigate } from "react-router-dom";
import {
  MdMenu,
  MdNotificationsNone,
  MdOutlineAccountCircle,
} from "react-icons/md";
import SideBarList from "../SideBarList";
import { useUserContext } from "../context/UserContext";

const Navigation = () => {
  const { isAdmin } = useUserContext();
  const user = JSON.parse(localStorage.getItem("user"));
  const roles = user? user.role : 'Admin';
  const username = user ?user.username : '0911121314';
  // const id = user.id;
  const [view,setView]=useState(false)
  // const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.clear();
      // localStorage.removeItem("jwt");
      // localStorage.removeItem("user");
      window.location.href = "/";
    }
  const handleProfile= () =>{
    console.log('logOut')
    Swal.fire({
      text: "Are you sure You Want to Logout",
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#00cc44',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok!',
      showCloseButton: true,
      showClass: {
          popup: 'animate__animated animate__shakeX'
      },

  }).then((result) => {
      if (result.isConfirmed) {
          handleLogout()
      }
  })

  }
  const toggleProfile = () => {

    Swal.fire({
        position: 'top-end',
        html: `
        <p><img class="profileImage" src="https://unsplash.it/400/200"> </p>
        <div class='profileDropDownList'>
               <p > ${roles}</p>
               <p >${username}</p>
               </div>
               `
              ,
        showConfirmButton: false,
        showDenyButton: true,
        width: "300px",
        denyButtonText: 'Logout',
        imageClass: 'img-responsive', 
        imageAlt: 'Custom image',
    }).then((result) => {
        if (result.isDenied) {
          handleProfile()
        }
    })
};

console.log(view)
  return (
    <div>
      <div className="nav-container">
        <div className="nav-items">
        <div className="menu-container" onClick={()=> setView(!view)}>
                <MdMenu color="black" size={35} />
               
          </div>
         
          <div className="nav-logo">
            <p className="logo">Bazra-Tracker</p>
          </div>
          <div className="navigations">
            <ul className="nav-list">
              
              <li>
                <MdNotificationsNone  size={35} />
              </li>
              <li >
                <div onClick={()=>toggleProfile()}>
                  <MdOutlineAccountCircle size={35} />
               
                  </div>
                
              </li>
            </ul>
          </div>
         
        </div>
      </div>
      {view && <SideBarList view={view} setView={setView} isAdmin={isAdmin} />}
    </div>
  );
};

export default Navigation;
