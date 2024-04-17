import React, { useEffect, useState } from "react";
import "./modalpop.css";
import swal from "sweetalert";
import { mainAPI } from "../../components/mainAPI";
import { useLoadContext } from "../../components/context/DataLoadContext";
import { showErrorMessage } from "../../components/SwalMessages";

function ManageDriver({ setShowManage, driverDetail }) {
  //  ** APIURLS
  const [driverLicense, setDriverLicense] = useState(
    driverDetail.licenseNumber
  );
  const allVehicleapi = `${mainAPI}/Api/Admin/All/Vehicle/${driverDetail.vehicleOwnerID}`;
  const updateStatusapi = `${mainAPI}/Api/Vehicle/ChangeDriverStatus`;
  const statusUrl = `${mainAPI}/Api/Admin/DriverStatus/All`;
  const apiAllVehicle = `${mainAPI}/Api/Admin/All/Vehicles`;
  const [allVehicles, setAllVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plateNumber, setPlateNumber] = useState(driverDetail.plateNumber);

  const { setRefresh, refresh } = useLoadContext();
  const [status, setStatus] = useState([]);
  const [unAssignedVehicles, setUnAssignedVehicles] = useState([]);
  const [error, setError] = useState("");
  const [driverStatus, setDriverStatus] = useState(driverDetail.status);
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
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
        setShowManage(false);
      }
    };
  };
  //  ******* GETTING UNASSIGNED VEHICLES ************
  const getUnAssignedVehicles = async () => {
    try {
      setLoading(true);
      const res = await fetch(allVehicleapi, options);
      console.log("response", res.status);
      if (res.status == 401) {
        showErrorMessage({ message: "Your Session is expired" });
      }
      const data = await res.json();
      if (data && res.ok) {
        const unAssignedVehicles = data.vehiclesINF.filter(
          (item) => item.driverCondition === null
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
    console.log( driverStatus,
      driverLicense)
    let update = {
      driverStatus,
      driverLicense,
      plateNumber
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
console.log(plateNumber)
  return (
    <div
      className="manage-modal"
      id="driver-manage"
      onClick={() => hideModal()}
    >
      <div className="manage-modal-content">
        <div className="modal-title">
          <p>Mangage Driver Status - <tb/>
          <strong>{driverDetail.plateNumber != null ? driverDetail.plateNumber : 'UNASSIGNED'}
          </strong>
          </p>
        </div>
        <div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <label>Licence Number</label>
            <input value={driverDetail.licenseNumber} disabled />
            <label>Driver Name</label>
            <input value={driverDetail.driverName } disabled />
            <label>Vehicles</label>
            {loading ? (
              "please wait while loading.."
            ) :  (
              <select
                // value={driverDetail.plateNumber || ""}
                onChange={(e) => setPlateNumber(e.target.value === '0000' ? null : e.target.value)}
              >
                <option value=''>
                  {'Choose your vehicle'}
                </option>
                <option value='0000'>
                  UNASSIGN 
                </option>
                {unAssignedVehicles.map((vehicle, index) => (
                  <option value={vehicle.plateNumber} key={index}>
                    {vehicle.plateNumber}
                  </option>
                ))}
              </select>


            ) }

            <label>Status</label>
            <select
              value={driverStatus || ""}
              onChange={(e) => setDriverStatus(e.target.value)}
            >
              { plateNumber === '0000' ?<option value='UNASSIGNED'>UNASSIGNED</option>:
               status.map((st, index) => (
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
            onClick={() => setShowManage(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageDriver;
