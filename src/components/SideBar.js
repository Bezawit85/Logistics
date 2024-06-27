import React, { useState } from "react";
import {
  MdBusinessCenter,
  MdDashboard,
  MdDirectionsCar,
  MdOutlineManageAccounts,
  MdPeople,
  MdOutlineAppRegistration,
  MdPersonAdd
} from "react-icons/md";

import{ HiDocumentReport } from 'react-icons/hi'
import { HiBellAlert } from "react-icons/hi2";
import {AiFillSetting} from 'react-icons/ai'
import "./sidebarr.css";
import { useNavigate } from "react-router-dom";
import NewMarketsPopup from "../pages/Market/NewMarketsPopup";
const SideBar = ({ isAdmin }) => {
  const [current, setCurrent] = useState({
    dashboard: false,
    vehicle: false,
    driver: false,
    users: false,
    market: false,
    alerts:false,
    settings:false,
    report:false,
    companyOwnerRegister:false,
    createUser:false,
  });
  const navigator = useNavigate();
  const changeRoute = (val) => {
    setCurrent({
      dashboard: false,
  vehicle: false,
  driver: false,
  users: false,
  market: false,
  alerts:false,
  settings:false,
  report:false,
  companyOwnerRegister:false,
  createUser:false,
      [val]: true,
    });
    navigator(`/${val}`);
  };
  return (
    <div>
      <NewMarketsPopup/>
      <div className="sidebar-container">
        <div className="sidebar-items">
          <ul className="sidebar-list">
            <li onClick={() => changeRoute("dashboard")}>
              <MdDashboard
                className={`${current.dashboard ? "ActiveSideBar" : "sideBar"}`}
                
              />
              <p>Home</p>
            </li>
            <li onClick={() => changeRoute("vehicle")}>
              <MdDirectionsCar
                className={`${current.vehicle ? "ActiveSideBar" : "sideBar"}`}
                
              />
              <p>Vehicle</p>
            </li>
            <li onClick={() => changeRoute("driver")}>
              <MdOutlineManageAccounts
                className={`${current.driver ? "ActiveSideBar" : "sideBar"}`}
                
              />
              <p>Driver</p>
            </li>
            <li onClick={() => changeRoute("users")}>
              <MdPeople
                className={`${current.users ? "ActiveSideBar" : "sideBar"}`}
                
              />
              <p>Users</p>
            </li>
            {isAdmin() && (
              <li onClick={() => changeRoute("report")}>
                <HiDocumentReport
                  className={`${current.report ? "ActiveSideBar" : "sideBar"}`}
                />
                <p>Report</p>
              </li>
            )}
            <li onClick={() => changeRoute("market")}>
              <MdBusinessCenter
                className={`${current.market ? "ActiveSideBar" : "sideBar"}`}
                
              />
              <p>Market</p>
            </li>
            <li onClick={() => changeRoute("alerts")}>
              <HiBellAlert
                className={`${current.alerts ? "ActiveSideBar" : "sideBar"}`}
                
              />
              
              <p>Alerts</p>
            </li>
            <li onClick={() => changeRoute("companyOwnerRegister")}>
              <MdOutlineAppRegistration
                className={`${current.companyOwnerRegister ? "ActiveSideBar" : "sideBar"}`}
                
              />
              
              <p>Registration</p>
            </li>
            {isAdmin() && (
              <li onClick={() => changeRoute("createUser")}>
                <MdPersonAdd
                  className={`${
                    current.createUser ? "ActiveSideBar" : "sideBar"
                  }`}
                />
                <p>CreateUser</p>
              </li>
            )}
            {isAdmin() && (
              <li onClick={() => changeRoute("settings")}>
                <AiFillSetting
                  className={`${
                    current.settings ? "ActiveSideBar" : "sideBar"
                  }`}
                />
                <p>Settings</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
