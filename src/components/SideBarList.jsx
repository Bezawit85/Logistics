import React, { useState } from "react";
import {
  MdBusinessCenter,
  MdDashboard,
  MdDirectionsCar,
  MdOutlineManageAccounts,
  MdPeople,
  MdMenu,
  MdOutlineAppRegistration,
  MdPersonAdd,
  MdAccessTime,
} from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { HiBellAlert } from "react-icons/hi2";
import { AiFillSetting } from "react-icons/ai";
import "./sidebarlist.css";
import { useNavigate } from "react-router-dom";
import NewMarkets from "../pages/Market/NewMarketsPopup";

const SideBar = ({ view, setView, isAdmin }) => {
  const [current, setCurrent] = useState({
    dashboard: false,
    vehicle: false,
    driver: false,
    users: false,
    market: false,
    alerts: false,
    settings: false,
    report: false,
    companyOwnerRegister: false,
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
      alerts: false,
      settings: false,
      report: false,
      companyOwnerRegister: false,
      createUser:false,
      [val]: true,
    });

    navigator(`/${val}`);
  };

  return (
    <div>
      <NewMarkets />
      <div className="sidebar-wrappers" onClick={() => setView(!view)}>
        <div className="menu" onClick={() => setView(!view)}>
          <MdMenu color="black" size={35} /> <h2>Bazra Tracker</h2>
        </div>
        {view && (
          <div className="sidebar-item">
            <ul className="sidebar-lists">
              <li className="listtop">
                <MdAccessTime
                  className="sideBarr"
                  style={{ color: "orange" }}
                />
                <h2>Bazra Tracker</h2>
              </li>
              <hr color="purple" align="left" width="100%" size="3"></hr>

              <li>
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    marginLeft: "5px",
                  }}
                >
                  PAGES
                </p>
              </li>
              <li
                onClick={() => {
                  changeRoute("dashboard"), setView(!view);
                }}
              >
                <MdDashboard
                  className={`${
                    current.dashboard ? "ActiveSideBars" : "sideBars"
                  }`}
                />
                <p>Home</p>
              </li>
              
              <li
                onClick={() => {
                  changeRoute("vehicle"), setView(!view);
                }}
              >
                <MdDirectionsCar
                  className={`${
                    current.vehicle ? "ActiveSideBars" : "sideBar"
                  }`}
                />
                <p>Vehicle</p>
              </li>

              <li
                onClick={() => {
                  changeRoute("driver"), setView(!view);
                }}
              >
                <MdOutlineManageAccounts
                  className={`${
                    current.driver ? "ActiveSideBars" : "sideBars"
                  }`}
                />
                <p>Driver</p>
              </li>
              <li
                onClick={() => {
                  changeRoute("users"), setView(!view);
                }}
              >
                <MdPeople
                  className={`${current.users ? "ActiveSideBars" : "sideBars"}`}
                />
                <p>Users</p>
              </li>
              {isAdmin() && (
                <li
                  onClick={() => {
                    changeRoute("report");
                    setView(!view);
                  }}
                >
                  <HiDocumentReport
                    className={`${
                      current.report ? "ActiveSideBars" : "sideBars"
                    }`}
                  />
                  <p>Report</p>
                </li>
              )}
              <li
                onClick={() => {
                  changeRoute("market"), setView(!view);
                }}
              >
                <MdBusinessCenter
                  className={`${
                    current.market ? "ActiveSideBars" : "sideBars"
                  }`}
                />
                <p>Market</p>
              </li>
              <li
                onClick={() => {
                  changeRoute("alerts"), setView(!view);
                }}
              >
                <HiBellAlert
                  className={`${
                    current.alerts ? "ActiveSideBars" : "sideBars"
                  }`}
                />

                <p>Alerts</p>
              </li>
              <li
                onClick={() => {
                  changeRoute("companyOwnerRegister"), setView(!view);
                }}
              >
                <MdOutlineAppRegistration
                  className={`${
                    current.companyOwnerRegister ? "ActiveSideBars" : "sideBars"
                  }`}
                />

                <p>Registration</p>
              </li>
              {isAdmin() && (
              <li
                onClick={() => {
                  changeRoute("createUser"), setView(!view);
                }}
              >
                <MdPersonAdd
                  className={`${
                    current.createUser ? "ActiveSideBars" : "sideBars"
                  }`}
                />

                <p>CreateUser</p>
              </li>
              )}
              {isAdmin() && (
              <li
                onClick={() => {
                  changeRoute("settings"), setView(!view);
                }}
              >
                <AiFillSetting
                  className={`${
                    current.settings ? "ActiveSideBars" : "sideBars"
                  }`}
                />

                <p>Settings</p>
              </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
