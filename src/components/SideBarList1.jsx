import React, { useState } from "react";
import {
  MdBusinessCenter,
  MdDashboard,
  MdDirectionsCar,
  MdOutlineManageAccounts,
  MdPeople,
  MdMenu,
  MdOutlineAppRegistration
} from "react-icons/md";
import {HiDocumentReport} from 'react-icons/hi'
import { HiBellAlert } from "react-icons/hi2";
import {AiFillSetting} from 'react-icons/ai'
import "./sidebarr.css";
import { useNavigate } from "react-router-dom";
import NewMarkets from "../pages/Market/NewMarketsPopup";
const SideBar = ({view, setView}) => {
  const [current, setCurrent] = useState({
    dashboard: true,
    vehicle: false,
    driver: false,
    users: false,
    market: false,
  });
  const navigator = useNavigate();
  const changeRoute = (val) => {
    setCurrent({
      dashboard: false,
      vehicle: false,
      driver: false,
      users: false,
      market: false,
      [val]: true,
    });
    navigator(`/${val}`);
  };
  return (
    <div>
      <NewMarkets/>
      <div className="sidebar-wrapper">
      <div className="menu" onClick={()=> setView(!view)}>
                <MdMenu color="black" size={35} /> <h2>Bazra Tracker</h2>
                </div>
        { view && <div className="sidebar-items">
          <ul className="sidebar-list">
            <li onClick={() => {changeRoute("dashboard"), setView(!view)}}>
              <MdDashboard
                className={`${current.dashboard ? "ActiveSideBar" : "sideBar"}`}
                
              />
              <p>Home</p>
            </li>
            <li onClick={() => {changeRoute("vehicle"), setView(!view)}}>
              <MdDirectionsCar
                className={`${current.vehicle ? "ActiveSideBar" : "sideBar"}`}
                
              />
              <p>Vehicle</p>
            </li>
            <li onClick={() => {changeRoute("driver"), setView(!view)}}>
              <MdOutlineManageAccounts
                className={`${current.driver ? "ActiveSideBar" : "sideBar"}`}
                
              />
              <p>Driver</p>
            </li>
            <li onClick={() => {changeRoute("users"),setView(!view)}}>
              <MdPeople
                className={`${current.users ? "ActiveSideBar" : "sideBar"}`}
                
              />
              <p>Users</p>
            </li>
            <li onClick={() => {changeRoute("report"),setView(!view)}}>
              <HiDocumentReport
                className={`${current.users ? "ActiveSideBar" : "sideBar"}`}
                
              />
              <p>Report</p>
            </li>
            <li onClick={() => {changeRoute("market"), setView(!view)}}>
              <MdBusinessCenter
                className={`${current.market ? "ActiveSideBar" : "sideBar"}`}
                
              />
              <p>Market</p>
            </li>
            <li onClick={() => {changeRoute("alerts"),setView(!view)}}>
              <HiBellAlert
                className={`${current.alerts ? "ActiveSideBar" : "sideBar"}`}
                
              />
              
              <p>Alerts</p>
            </li>
            <li onClick={() => {changeRoute("companyOwnerRegister"),setView(!view)}}>
              <MdOutlineAppRegistration
                className={`${current.companyOwnerRegister ? "ActiveSideBar" : "sideBar"}`}
                
              />
              
              <p>Registration</p>
            </li>
            <li onClick={() => {changeRoute("settings"),setView(!view)}}>
              <AiFillSetting
                className={`${current.settings ? "ActiveSideBar" : "sideBar"}`}
                
              />
              <p>Settings</p>
            </li>

          </ul>
        </div>}
      </div>
    </div>
  );
};

export default SideBar;
