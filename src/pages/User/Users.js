import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import TopCards from "../../components/cards/TopCards";
import { MdSearch } from "react-icons/md";
import { FaBuildingColumns } from "react-icons/fa6";
import { FaTruckMoving, FaUser, FaUsers } from "react-icons/fa";
import UserTable from "./UserTable";
import CargoTable from './CargoTable'
import { showErrorMessage } from "../../components/SwalMessages";
import { mainAPI } from "../../components/mainAPI";
const Users = () => {
  const [isCargo,setIsCargo]=useState(false)
  const [allUsers, setallUsers] = useState([]);
  const [filterData,setFilterData]=useState([])
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");
  const [activeCard, setActiveCard] = useState("totalVehicle");
  const [loading, setLoading] = useState("");
  const [companyUser, setCompanyUser] = useState([]);
  const [indivisualUser, setIndivisualUser] = useState([]);
  const [cargoUsers, setCargoUsers] = useState([]);
  const apiVehicleOwners = `${mainAPI}/Api/Admin/All/VehicleOwners`;
  const apiCargoOwners = `${mainAPI}/Api/Admin/All/CargoOwners`; 
  const apiVehicleCatagory = `${mainAPI}/Api/Admin/All/VehicleCatagory`;
  const apiVehicleCondition = `${mainAPI}/Api/Admin/All/VehicleCondition`;
  const apiaddVehicle = `${mainAPI}/Api/Vehicle/AddVehicle`;
  //Company Api
  const apiCompany = `${mainAPI}/Api/Admin/All/VehicleOwners/Role/owner`;
  //Individual API
  const apiIndivisual = `${mainAPI}/Api/Admin/All/VehicleOwners/Role/individual`;
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  /** REFRESH WHEN THERE IS NETWORK ERROR */
  const [refresh, setRefresh] = useState(false);

  /** GET VEHICLE DETAIL  */
  const getAllUserDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiVehicleOwners, options);
      if (res.status == 401) {
        //showErrorMessage();
        showErrorMessage({
          message: "Unable to Load!! server respond with 401",
        });
      }
      const data = await res.json();
      if (data && res.ok) {
        console.log(data);
        setallUsers(data.vehicleOwnerINF);
        setTableData(data.vehicleOwnerINF);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    } finally {
      setLoading(false);
    }
  };
  //***** Company Users */
  const getCompanyUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiCompany, options);
      if (res.status == 401) {
        //showErrorMessage();
        showErrorMessage({
          message: "Unable to Load!! server respond with 401",
        });
      }
      const data = await res.json();
      if (data && res.ok) {
        setCompanyUser(data.vehicleOwnerINF);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    } finally {
      setLoading(false);
    }
  };
  const getIndivisualUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiIndivisual, options);
      if (res.status == 401) {
        //showErrorMessage();
        showErrorMessage({
          message: "Unable to Load!! server respond with 401",
        });
      }
      const data = await res.json();
      if (data && res.ok) {
        //console.log(data, "indivisual");
        setIndivisualUser(data.vehicleOwnerINF);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    } finally {
      setLoading(false);
    }
  };
  const getCargoUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiCargoOwners, options);
      if (res.status == 401) {
        //showErrorMessage();
        showErrorMessage({
          message: "Unable to Load!! server respond with 401",
        });
      }
      const data = await res.json();
      if (data && res.ok) {
        //console.log(data);
        setCargoUsers(data.cargoOwners)
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllUserDetail(); //Getting Users Information from getDetail
    getCompanyUser();
    getIndivisualUser();
    getCargoUser();
  }, [refresh]);
  const topCardDetail = [
    {
      title: "Total Users",
      data: (allUsers.length + cargoUsers.length) || 0,
      icon: FaUsers,
      color: "rgb(94, 175, 255)",
      name: "totalusers",
    },
    {
      title: "Cargo",
      data: cargoUsers.length || 0,
      icon: FaTruckMoving,
      color: "rgb(255, 151, 39)",
      name: "cargo",
    },
    {
      title: "Indivisual",
      data: indivisualUser.length || 0,
      icon: FaUser,
      color: "rgb(102, 255, 94)",
      name: "indivisual",
    },
    {
      title: "Company",
      data: companyUser.length || 0,
      icon: FaBuildingColumns,
      color: "rgb(223, 94, 255)",
      name: "company",
    },
  ];
  const handleCardChange = (name) => {
    setActiveCard(name);
    switch (name) {
      case "totalusers":
        setTableData(allUsers);
        setFilterData(allUsers);
        setIsCargo(false)
        break;
      case "cargo":
        setTableData(cargoUsers);
         setFilterData(cargoUsers);
        setIsCargo(true)
        break;
      case "indivisual":
        setTableData(indivisualUser);
        setFilterData(indivisualUser);
        setIsCargo(false)

        break;
      case "company":
        setTableData(companyUser);
        setFilterData(companyUser);
        setIsCargo(false)

        break;
      default:
        setTableData("");
    }
  };
  const filterTable = (e) => {
    const { value } = e.target;
    const result = (isCargo ? cargoUsers : tableData).filter((item) => {
      // console.log(item)
 if(isCargo) {  
 console.log('cargo')
  return (
        
        (item.ownerName && item.ownerName.toString().toLowerCase().includes(value.toLowerCase())) ||
        // (item.businessINF.businessName && item.businessINF.businessName.toString().toLowerCase().includes(value.toLowerCase())) ||
        // (item.businessINF.licenseNumber && item.businessINF.licenseNumber.toString().toLowerCase().includes(value.toLowerCase())) ||
        (item.phoneNumber && item.phoneNumber.toString().toLowerCase().includes(value.toLowerCase())) ||
        // (item.businessINF.tinNumber && item.businessINF.tinNumber.toString().toLowerCase().includes(value.toLowerCase())) ||
        (item.enabled && item.enabled.toString().toLowerCase().includes(value.toLowerCase())) 
      
      ); 
    }
      else {
        return (
          (item.companyName && item.companyName.toString().toLowerCase().includes(value.toLowerCase())) ||
          (item.firstName && item.firstName.toString().toLowerCase().includes(value.toLowerCase())) ||
          (item.email && item.email.toString().toLowerCase().includes(value.toLowerCase())) ||
          (item.phoneNumber && item.phoneNumber.toString().toLowerCase().includes(value.toLowerCase())) ||
          (item.totalDrivers && item.totalDrivers.toString().toLowerCase().includes(value.toLowerCase())) ||
          (item.totalVehicles && item.totalVehicles.toString().toLowerCase().includes(value.toLowerCase())) ||
          (item.roles && item.roles.toString().toLowerCase().includes(value.toLowerCase()))
        
      );
    }
    });
    setTableData(result);
    if (value == "") setTableData(isCargo ? cargoUsers : filterData);
  };
  return (
    <div className="main-bar">
      <div className="main-bar-wrapper">
      <div>
        <h2 onClick={() => setRefresh(!refresh)} style={{}}>Users</h2>
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
                {error}
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
                 { isCargo ? <CargoTable target={cargoUsers}/>:<UserTable target={tableData} />}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
