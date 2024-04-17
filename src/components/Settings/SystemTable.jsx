import React, { useEffect, useState } from "react";
// import "./modalpop.css";
import swal from "sweetalert";
import { mainAPI } from "../mainAPI";
import { useLoadContext } from "../../components/context/DataLoadContext";
import { showErrorMessage } from "../../components/SwalMessages";

function SystemTable({ item}) {
  //  ** APIURLS
  const allVehicleapi = `${mainAPI}/Api/Admin/All/Vehicles`;
  const updateStatusapi = `${mainAPI}/Api/Vehicle/ChangeDriverStatus`;
  const statusUrl = `${mainAPI}/Api/Admin/DriverStatus/All`;
  const [allVehicles, setAllVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plateNumber, setPlateNumber] = useState();
  const [driverLicense, setDriverLicense] = useState(
    
  );
  const { setRefresh, refresh } = useLoadContext();
  const [status, setStatus] = useState([]);
  const [unAssignedVehicles, setUnAssignedVehicles] = useState([]);
  const [error, setError] = useState("");
  const [driverStatus, setDriverStatus] = useState();
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  console.log('systemtable',item)
  useEffect(() => {
    // ********** GETTING UNASSIGNEDvEHICLES USING DRIVER NAME **********
    getUnAssignedVehicles();
    getDriverStatus();
  }, []);
  // ************************** GETTING DRIVER sTATUS **************
  const getDriverStatus = async () => {
    setLoading(true);
    fetch(statusUrl, options)
      .then((respnse) => respnse.json())
      .then((data) => {
        console.log("Status data", data);
        if (data.driverStatus) setStatus(data.driverStatus);
        setLoading(false);
      })
      .catch((e) => console.log(e));
  };
  /** Closing modal */
  const hideModal = () => {
    const modal = document.getElementById("driver-manage");
    window.onclick = (event) => {
      if (event.target == modal) {
        const setShowManage=false;
      }
    };
  };
  //  ******* GETTING UNASSIGNED VEHICLES ************
  const apiAllVehicle = `${mainAPI}/Api/Admin/All/Vehicles`;
  const getUnAssignedVehicles = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiAllVehicle, options);
      console.log("response", res.status);
      if (res.status == 401) {
        showErrorMessage({ message: "Your Session is expired" });
      }
      const data = await res.json();
      if (data && res.ok) {
        const unAssignedVehicles = data.vehiclesINF.filter(
          (item) => item.driverName == "null"
        );
        setUnAssignedVehicles(unAssignedVehicles);
        // filter here
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      console.log(e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  // ********* UPDATING DRIVER STATUS
  const updateStatus = async () => {
    let update = {
      driverStatus,
      driverLicense,
    };
    console.log(driverStatus);
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(update),
    };
    try {
      const response = await fetch(updateStatusapi, options);
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        swal("Successful", `${result.message}`, "success", {
          buttons: false,
          timer: 2000,
        });
        setRefresh(!refresh);
      } else {
        swal(`Failed To update `, `${result.message}`, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStatus();
  };

  return (
    <div
      className="manage-modal"
      id="driver-manage"
      onClick={() => hideModal()}
    >
      <div className="manage-modal-content">
        <div className="modal-title">
          <p>Mangage Driver Status</p>
        </div>
        <div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <label>Licence Number</label>
            <input value={item} disabled />
            <label>Driver Name</label>
            <input value={item} disabled />
            <label>Vehicles</label>
            {loading ? (
              "please wait while loading.."
            ) : driverStatus != "ASSIGNED" ? (
              <select
                value={plateNumber || ""}
                onChange={(e) => setPlateNumber(e.target.value)}
              >
                {unAssignedVehicles.map((vehicle, index) => (
                  <option value={vehicle.plateNumber} key={index}>
                    {vehicle.plateNumber}
                  </option>
                ))}
              </select>
            ) : (
              <p>Driver is ASSIGNED</p>
            )}

            <label>Status</label>
            <select
              value={driverStatus || ""}
              onChange={(e) => setDriverStatus(e.target.value)}
            >
              {status.map((st, index) => (
                <option value={st.driverStatus} key={index}>
                  {st.driverStatus}
                </option>
              ))}
            </select>
            {loading ? (
              <button className="btn-manage btn" disabled>
                Please Wait
              </button>
            ) : (
              <button className="btn-manage btn">Update Status</button>
            )}
          </form>
          <button
            className="btn-cancel btn"
            // onClick={() => setShowManage(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SystemTable;
