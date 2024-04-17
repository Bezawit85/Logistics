import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import { mainAPI } from "../mainAPI";
import { showSignInMessage } from "../SwalMessages";

const LoadDataContext = React.createContext(null);
// EXPORTING USELOADCONTEXT AND
export const useLoadContext = () => useContext(LoadDataContext);
const DataLoadContext = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [allDrivers, setAllDrivers] = useState([]);
  const [onRoute, setOnRoute] = useState([]);
  const [Assigned, setAssigned] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [permit, setPermit] = useState([]);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const apiAllDrivers = `${mainAPI}/Api/Admin/All/Drivers`;
  const apiOnRoute = `${mainAPI}/Api/Admin/Drivers/ONROUTE`;
  const apiAssigned = `${mainAPI}/Api/Admin/Drivers/ASSIGNED`;
  const apiUnAssigned = `${mainAPI}/Api/Admin/Drivers/UNASSIGNED`;
  const apiPermit = `${mainAPI}/Api/Admin/Drivers/PERMIT`;
  const navigater = useNavigate();
  const { setCurrentUser, currentUser } = useUserContext();
  /**  GET JWT */
  const jwt = localStorage.getItem("jwt")
    ? JSON.parse(localStorage.getItem("jwt"))
    : "";
  /** Option for fetch */
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      Accept: "application/json",
    },
  };

  useEffect(() => {
    const getAllDriversData = async () => {
      setError("");
      await getAllDrivers();
      await getAssigned();
      await getOnRoute();
      await getUnAssigned();
      await getPermit();
      setLoading(false);
      setRefresh(false);
    };
    setLoading(true);
    getAllDriversData();

    return () => {};
  }, [currentUser, refresh]);
  // To Get ALL DRIVERS DETAIL INCLUDING ONROUTE,PERMIT,ASSIGNED, AND UNASSIGNED
  const getAllDrivers = async () => {
    try {
      const res = await fetch(apiAllDrivers, options);
      if (res.status == 401) {
        setLoading(false);
        let expire = localStorage.getItem("expire");
        //check if there is user to show Message
        if (currentUser && !expire) {
          showSignInMessage(() => navigater("/"));
        }
        localStorage.setItem("expire", true);
        setError("session expired");
      }
      const data = await res.json();
      if (data.drivers && res.ok) {
        setAllDrivers(data.drivers);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };
  // TO GET ONROUTE DRIVER DATA
  const getOnRoute = async () => {
    try {
      const res = await fetch(apiOnRoute, options);
      const data = await res.json();
      if (data.drivers) setOnRoute(data.drivers);
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      setError(e.message);
    }
  };
  // TO GET ASSIGNED DRIVER DATA
  const getAssigned = async () => {
    try {
      const res = await fetch(apiAssigned, options);
      const data = await res.json();
      if (data.drivers) setAssigned(data.drivers);
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      setError(e.message);
    }
  };
  // TO GET UNASSIGNED DRIVER DATA
  const getUnAssigned = async () => {
    try {
      const res = await fetch(apiUnAssigned, options);
      const data = await res.json();
      if (data.drivers) setUnassigned(data.drivers);
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      setError(e.message);
    }
  };
  // ********************************* TO GET PERMIT DATA OF DRIVER
  const getPermit = async () => {
    try {
      const res = await fetch(apiPermit, options);
      const data = await res.json();
      if (data.drivers) setPermit(data.drivers);
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <LoadDataContext.Provider
      value={{
        setRefresh,
        loading,
        setLoading,
        error,
        payload: {
          allDrivers: allDrivers,
          onRoute: onRoute,
          assigned: Assigned,
          unassigned: unassigned,
          permit: permit,
        },
      }}
    >
      {children}
    </LoadDataContext.Provider>
  );
};

export default DataLoadContext;
