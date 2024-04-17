import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import TopCards from "../../components/cards/TopCards";
import { MdError, MdPeople, MdSearch, MdVerified } from "react-icons/md";
import { FaRoute } from "react-icons/fa";
import { useLoadContext } from "../../components/context/DataLoadContext";
import DriversTable from "./DriversTable";
import "./tables.css";
import ManageDriver from "./ManageDriver";
import { useNavigate } from "react-router-dom";
import { showSignInMessage } from "../../components/SwalMessages";
import { useUserContext } from "../../components/context/UserContext";
function Drivers({ driverData }) {
  const { isCallCenter } = useUserContext();
  const [allDrivers, setAllDrivers] = useState([]);
  const [onRoute, setOnRoute] = useState([]);
  const [Assigned, setAssigned] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [permit, setPermit] = useState([]);
  const [tableData, setTableData] = useState(allDrivers);
  //*** Getting DATA FROM USELOADCONTECT FROM DATALOADCONTEXT */
  const { payload, loading, error, setRefresh } = useLoadContext();
  const navigate = useNavigate();
  //** USEEFFECT FOR POPULATING DATA TO assigned,unassigned permit and alldrivers */
  useEffect(() => {
    if (error == "session expired") {
      showSignInMessage(() => (window.location.href = "/"));
    }
    const getAllApiData = async () => {
      setAllDrivers(payload.allDrivers);
      setAssigned(payload.assigned);
      setOnRoute(payload.onRoute);
      setUnassigned(payload.unassigned);
      setPermit(payload.permit);
      setTableData(payload.allDrivers);
    };
    if (driverData) {
      setAllDrivers(driverData.allDrivers);
      setAssigned(driverData.assigned);
      setOnRoute(driverData.onRoute);
      setUnassigned(driverData.unassigned);
      setPermit(driverData.permit);
      setTableData(driverData.allDrivers);
    } else getAllApiData();

    return () => {};
  }, [loading]);
  // **** TOP CARD INFROMATION
  const topCardDetail = [
    {
      title: "Total Driver",
      data: allDrivers?.length || 0,
      icon: MdPeople,
      color: "rgb(94, 175, 255)",
      name: "totalDrivers",
    },
    {
      title: "OnRoute",
      data: onRoute?.length || 0,
      icon: FaRoute,
      color: "rgb(255, 234, 94)",
      name: "onRoute",
    },
    {
      title: "Assigned",
      data: Assigned?.length || 0,
      icon: MdVerified,
      color: "rgb(102, 255, 94)",
      name: "assigned",
    },
    {
      title: "Unassigned",
      data: unassigned?.length || 0,
      icon: MdError,
      color: "rgb(255, 94, 116)",
      name: "unassigned",
    },
    {
      title: "Permit",
      data: permit?.length || 0,
      icon: MdError,
      color: "rgb(223, 94, 255)",
      name: "permit",
    },
  ];
  // SETTING ACTIVE CARD TOTOAL DRIVERS BY DEFAULT
  const [activeCard, setActiveCard] = useState("totalDrivers");
  /** Handling Card Change WHEN SELECTED */
  const handleCardChange = (name) => {
    setActiveCard(name);
    switch (name) {
      case "totalDrivers":
        setTableData(allDrivers);
        break;
      case "onRoute":
        setTableData(onRoute);
        break;
      case "assigned":
        setTableData(Assigned);
        break;
      case "unassigned":
        setTableData(unassigned);
        break;
      case "permit":
        setTableData(permit);
        break;
      default:
        setTableData(allDrivers);
    }
  };
  const [showManage, setShowManage] = useState(false);
  const [driverDetail, setDriverDetail] = useState();
  const handleManage = (item) => {
    setShowManage(true);
    setDriverDetail(item);
  };
  const showDetail = (item) => {
    setDriverDetail(item);
    navigate(`/driver/detail/${item.id}`);
  };
  const filterTable = (e) => {
    const { value } = e.target;
    const result = allDrivers.filter((item) => {
      return (
        item.driverName.toLowerCase().includes(value.toLowerCase()) ||
        item.vehicleOwner.toLowerCase().includes(value.toLowerCase()) ||
        item.experience
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        item.licenseNumber
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        item.status.toLowerCase().includes(value.toLowerCase())
      );
    });
    setTableData(result);
    if (value == "") setTableData(allDrivers);
  };
  return (
    <div className="main-bar">
      <div className=" main-bar-wrapper">
        {showManage && (
          <ManageDriver
            setShowManage={setShowManage}
            driverDetail={driverDetail}
          />
        )}
        <div>
          {/* {detail && (
        <DriverDetail driverDetail={driverDetail} setDetail={setDetail} />
      )} */}
          <h2 style={{}}>Driver</h2>
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
                onClick={() => setRefresh(true)}
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
                  <DriversTable
                  isCallCenter={isCallCenter}
                    target={tableData}
                    handleManage={(val) => handleManage(val)}
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
}

export default Drivers;
