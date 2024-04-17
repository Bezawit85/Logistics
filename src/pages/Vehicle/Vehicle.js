import React, { useEffect, useState } from "react";
import { FaRoute } from "react-icons/fa";
import {
  MdAutoGraph,
  MdCarCrash,
  MdDirectionsCar,
  MdOutlineLocalParking,
  MdSearch,
} from "react-icons/md";
import ReactLoading from "react-loading";
import TopCards from "../../components/cards/TopCards";
import VehicleTable from "./VehicleTable";
import swal from "sweetalert";
import { useUserContext } from "../../components/context/UserContext";
import { useNavigate } from "react-router-dom";
import { mainAPI } from "../../components/mainAPI";
const Vehicle = ({ vehicleData }) => {
  const { isCallCenter } = useUserContext();
  const [allVehicle, setAllVehicle] = useState([]);
  const [vehicleonRoute, setVehicleOnRoute] = useState([]);
  const [parked, setParked] = useState([]);
  const [inStock, setInStock] = useState([]);
  const [maintence, setMaintence] = useState([]);
  const [tableData, setTableData] = useState(allVehicle);
  const [error, setError] = useState("");
  const [activeCard, setActiveCard] = useState("totalVehicle");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useUserContext();
  const apiAllVehicle = `${mainAPI}/Api/Admin/All/Vehicles`;
  const apiMaintaining = `${mainAPI}/Api/Admin/All/Vehicles/Status/MAINTAINING`;
  const apiVehicleOnRoute = `${mainAPI}/Api/Admin/All/Vehicles/Status/ONROUTE`;
  const apiInStock = `${mainAPI}/Api/Admin/All/Vehicles/Status/INSTOCK`;
  const apiParked = `${mainAPI}/Api/Admin/All/Vehicles/Status/PARKED`;
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const navigate = useNavigate();
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    setError("");
    const getVehicleData = async () => {
      setLoading(true);
      getAllVehicle();
      getVehicleOnRoute();
      getVehicleParked();
      getVehicleMaintaning();
      getVehicleInStock();
    };
    if (vehicleData) {
      setAllVehicle(vehicleData.allVehicles);
      setVehicleOnRoute(vehicleData.onRoute);
      setParked(vehicleData.parked);
      setInStock(vehicleData.inStock);
      setMaintence(vehicleData.maintenance);
    } else getVehicleData();
  }, [refresh]);
  const showErrorMessage = () => {
    swal({
      title: "Server respond With 401",
      text: `Your Session is expried`,
      icon: "error",
      dangerMode: true,
      buttons: ["cancel", "SignIn"],
      cancelButtonColor: "#d33",
    }).then((signin) => {
      if (signin) {
        localStorage.clear();
        navigate("/");
      }
    });
  };
  const getAllVehicle = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiAllVehicle, options);
      console.log("response", res.status);
      if (res.status == 401) {
        showErrorMessage({ message: "Your Session is expired" });
        setLoading(false);
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        console.log(data);
        setAllVehicle(data.vehiclesINF);
        setTableData(data.vehiclesINF);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const getVehicleOnRoute = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiVehicleOnRoute, options);
      if (res.status == 401) {
        showErrorMessage();
        setLoading(false);
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setVehicleOnRoute(data.inRoutelist);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const getVehicleParked = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiParked, options);
      if (res.status == 401) {
        showErrorMessage();
        setLoading(false);
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setParked(data.parkedList);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const getVehicleMaintaning = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiMaintaining, options);
      if (res.status == 401) {
        showErrorMessage();
        setLoading(false);
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setMaintence(data.maintainingList);
        //work on this
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const getVehicleInStock = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiInStock, options);
      if (res.status == 401) {
        showErrorMessage();
        setLoading(false);
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setInStock(data.stockedList);
      }
      if (res.status == 400) {
        setError("server 400");
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const topCardDetail = [
    {
      title: "Total Vehicle",
      data: allVehicle.length || 0,
      icon: MdDirectionsCar,
      color: "rgb(94, 175, 255)",
      name: "totalVehicle",
    },
    {
      title: "Vehicle OnRoute",
      data: vehicleonRoute.length || 0,
      icon: FaRoute,
      color: "rgb(255, 151, 39)",
      name: "onRoute",
    },
    {
      title: "Parked",
      data: parked.length || 0,
      icon: MdOutlineLocalParking,
      color: "rgb(102, 255, 94)",
      name: "parked",
    },
    {
      title: "In Stock",
      data: inStock.length || 0,
      icon: MdAutoGraph,
      color: "rgb(223, 94, 255)",
      name: "inStock",
    },
    {
      title: "Maintenance",
      data: maintence?.length || 0,
      icon: MdCarCrash,
      color: "rgb(255, 94, 116)",
      name: "maintenance",
    },
  ];
  const handleCardChange = (name) => {
    setActiveCard(name);
    switch (name) {
      case "totalVehicle":
        setTableData(allVehicle);
        break;
      case "onRoute":
        setTableData(vehicleonRoute);
        break;
      case "parked":
        setTableData(parked);
        break;
      case "inStock":
        setTableData(inStock);
        break;
      case "maintenance":
        setTableData(maintence);
        break;
      default:
        setTableData(allVehicle);
    }
  };
  const filterTable = (e) => {
    const { value } = e.target;
    const result = allVehicle.filter((item) => {
      return (
        item.driverName.toLowerCase().includes(value.toLowerCase()) ||
        item.vehicleName.toLowerCase().includes(value.toLowerCase()) ||
        item.vehicleOwner.toLowerCase().includes(value.toLowerCase()) ||
        item.vehicleCatagory.toLowerCase().includes(value.toLowerCase()) ||
        item.plateNumber.toLowerCase().includes(value.toLowerCase()) ||
        item.status.toLowerCase().includes(value.toLowerCase()) ||
        item.plateNumber.toLowerCase().includes(value.toLowerCase())
      );
    });
    setTableData(result);
    if (value == "") setTableData(allVehicle);
  };

  const handleChange = (item) => {
    navigate(`/vehicle/changeAssign/${item.ownerID}/${item.plateNumber}`);
  };
  const handleAssign = (item) => {
    navigate(
      `/vehicle/AssignDriver/${item.ownerID}/${item.plateNumber}/assign`
    );
  };
  const showDetail = (item) => {
    navigate(`/vehicle/detail/${item.id}`);
  };
  
  return (
    <div className="main-bar">
       <div className="main-bar-wrapper">
      <div>
        <h2 onClick={() => setRefresh(!refresh)}>Vehicles</h2>
        <hr className="hr" />
       
          {error ? (
            <>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "25px",
                  marginTop: "50px",
                  color: "red",
                }}
              >
                {error === "Failed to fetch" ? "NO INTERNET CONNECTION" : error}
              </p>
              <button
                className="btn center w-300"
                onClick={() => setRefresh(!refresh)}
              >
                Refresh Page
              </button>
            </>
          ) : (
            ""
          )}
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                flexDirection: "column",
                rowGap: "50px",
              }}
            >
              <ReactLoading type="bars" width={100} height={50} color="black" />
              <p>Loading Data Please Wait</p>
            </div>
          ) : (
            !error && (
              <>
                <div className="top-card-holder">
                  {topCardDetail.map((item, index) => (
                    <TopCards
                      title={item.title}
                      icon={item.icon}
                      data={item.data}
                      color={item.color}
                      key={index}
                      handleCardChange={() => handleCardChange(item.name)}
                      active={activeCard}
                      name={item.name}
                    />
                  ))}
                </div>
                <div className="">
                  <div className="search-bar">
                    <input
                      type="text"
                      name="search"
                      placeholder="Search..."
                      onChange={(e) => filterTable(e)}
                    />
                    <MdSearch size={25} />
                  </div>
                  <VehicleTable
                  isCallCenter={isCallCenter}
                    target={tableData}
                    handleChange={(val) => handleChange(val)}
                    handleAssign={(val) => handleAssign(val)}
                    showDetail={(val) => showDetail(val)}
                  />
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Vehicle;
