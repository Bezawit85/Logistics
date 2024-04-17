import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import AlertTable from './AlertTable'
import swal from "sweetalert";
import { useUserContext } from "../../components/context/UserContext";
import { useNavigate } from "react-router-dom";
import { mainAPI } from "../../components/mainAPI";
const AlertsHistory = () => {
  const [OffRoadAlert, setOffRoadAlert] = useState([]);
  const [AccidentAlert, setAccidentAlert] = useState([]);
  const [DriverAlert, setDriverAlert] = useState([]);
  const [tableData, setTableData] = useState(OffRoadAlert);
  const [error, setError] = useState("");
  const [activeCard, setActiveCard] = useState("OffRoadAlert");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useUserContext();
  const apiOffroadAlert = `${mainAPI}/Api/Admin/AlertsHistory/DRIVER`;
  const apiAccidentAlert = `${mainAPI}/Api/Admin/AlertsHistory/ACCIDENT`;
  const apiDriverAlert = `${mainAPI}/Api/Admin/AlertsHistory/DRIVER`;
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
      setLoading(true);
      getAccidentAlert();
      getOffroadAlert();
      getDriverAlert();
      setActiveCard('Offroad Alert')
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
        localStorage.removeItem("user");
        setCurrentUser(null);
        navigate("/");
      }
    });
  };
  const getOffroadAlert = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiOffroadAlert, options);
      if (res.status == 401) {
        showErrorMessage({ message: "Your Session is expired" });
        setLoading(false);
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setOffRoadAlert(data.inactiveAlerts,data.activeAlerts);
        setTableData(data.inactiveAlerts,data.activeAlerts);
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
  const getAccidentAlert= async () => {
    try {
      setLoading(true);
      const res = await fetch(apiAccidentAlert, options);
      if (res.status == 401) {
        showErrorMessage();
        setLoading(false);
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setAccidentAlert(data.inactiveAlerts,data.activeAlerts);
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
  const getDriverAlert = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiDriverAlert, options);
      if (res.status == 401) {
        showErrorMessage();
        setLoading(false);
        setError("Unable to Load!! server respond with 401");
      }
      const data = await res.json();
      if (data && res.ok) {
        setDriverAlert(data.activeAlerts,data.inactiveAlerts);
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
 


  const topCardDetail = [
    {
        title: "Off Road",
        data: OffRoadAlert?.length || 0,
        icon: FaRoute,
        color: "rgb(226, 91, 91)",
        name: "Offroad Alert",
      },
    {
      title: "Accident",
      data: AccidentAlert?.length || 0,
      icon: MdDirectionsCar,
      color: "rgb(255, 94, 172)",
      name: "Accident Alert",
    },
   
    {
      title: "Driver Accident",
      data: DriverAlert?.length || 0,
      icon: MdOutlineLocalParking,
      color: "rgb(251, 74, 39)",
      name: "Driver Alert",
    }
  ];
  const handleCardChange = (name) => {
    setActiveCard(name);
    switch (name) {
    case "Offroad Alert":
        setTableData(OffRoadAlert);
        break;
      case "Accident Alert":
        setTableData(AccidentAlert);
        break;
      
      case "Driver Alert":
        setTableData(DriverAlert);
        break;
      default:
        setTableData(OffRoadAlert);
    }
  };
  const filterTable = (e) => {
    const { value } = e.target;
    const result = tableData.filter((item) => {
      return (
        item.alertType.toLowerCase().includes(value.toLowerCase()) ||
        item.alertfinish.toLowerCase().includes(value.toLowerCase()) ||
        item.alertocation.toLowerCase().includes(value.toLowerCase()) ||
        item.driver.toLowerCase().includes(value.toLowerCase()) ||
        item.owner.toLowerCase().includes(value.toLowerCase()) ||
        item.plateNumber.toLowerCase().includes(value.toLowerCase())
        
      );
    });
    setTableData(result);
    if (value == "") setTableData(OffRoadAlert);
  };

  return (
    <div className="main-bar">
              <div className="main-bar-wrapper">

      <div>
        <h3>Alerts</h3>
        <hr className="hr" />
        <div style={{display:'flex',
                justifyContent:'space-around',
                padding:'20px 0 30px 0'}}> 
               <Link to='/alerts' style={{textDecoration:'none',fontWeight:'bold',color:'black'}}> 
               <p >Current Alerts</p></Link> 
           <p style={{ borderBottom:'2px solid black',fontWeight:'bold'}}>Alerts History</p>
           
        </div>
       
       
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
                  <AlertTable
                    target={tableData}
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

export default AlertsHistory;
