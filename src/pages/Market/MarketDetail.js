import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import "./market_input.css";
import "./market_chart.css";
import { mainAPI } from "../../components/mainAPI";
import { useParams } from "react-router-dom";

import {
  showErrorMessage,
  } from "../../components/SwalMessages";
import ActiveMarkets from "./ActiveMarkets";
import NewMarkets from './NewMarkets'
const MarketDetail = () => {
  // const history = useHistory();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [refresh, setRefresh] = useState(false);
  const [cargoDriver, setCargoDriver] = useState([]);
  const [remaining, setRemaining] = useState("");
  const [weight, setWeight] = useState("");
  const [cargoData, setCargoData] = useState({});
  const [reload, setReload] = useState(false);
  const [chartData, setChartData] = useState({
    labels: ["FINISHED", "REMAINING"],
    datasets: [{ label: "Summary", data: [5, 2] }],
  });
  const apiCargoDriver = `${mainAPI}/Api/Admin/All/CargoDrivers/${id}`;
  const apiCargo = `${mainAPI}/Api/Admin/All/Cargos/${id}`;
   /****isNew */
   const [isNew,setIsNew]=useState(false )
  const jwt = JSON.parse(localStorage.getItem("jwt")); // Getting the token from login api
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const getCargoDriver = () => {
    setLoading(true);
    fetch(apiCargoDriver, options)
      .then((res) => res.json())
      .then((res) => {
        setCargoDriver(res.cargoDriversINFs);
      })
      .catch((e) => {
        if (e.message == "Failed to fetch")
          showErrorMessage({ message: "net::ERR_INTERNET_DISCONNECTED" });
        else showErrorMessage({ message: "some thing went wrong" });
      })
      .finally(setLoading(false));
  };
  const getCargoDetail = async () => {
    setLoading(true);
    fetch(apiCargo, options)
      .then((res) => res.json())
      .then((res) => {
        setIsNew(res.status === "NEW" ? true :false)
        setCargoData(res);
        setWeight(res.weight);
        setRemaining(res.remaining);
      })
      .catch(() => {
        showErrorMessage({ message: "error" });
      })
      .finally(setLoading(false));
  };
  useEffect(() => {
   
    getCargoDetail();
    getCargoDriver();

   
  }, [refresh]);


  const handleRefresh = () => {
    setRefresh(!refresh)

  };
 function NewActiveMarkets (){
   if (isNew)
{ 
     return    <NewMarkets
      cargoData={cargoData}
      reload={reload}
      setReload={setReload}
    />
}
   else{
      return   <ActiveMarkets
              cargoData={cargoData}
              loading={loading}
              weight={weight}
              remaining={remaining}
              cargoDriver={cargoDriver}
              chartData={chartData}
              handleRefresh={handleRefresh}
            />
   }
          
   
     
     
    
  }
  return (
    <div className="main-bar">
      <div>
        <h2 style={{}}>Market Detail / {cargoData.cargoOwner} </h2>
        <hr className="hr" />
        <div className="main-bar-content">
          {loading && (
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
          )}
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
          {!loading && !error && (
            <>
              {NewActiveMarkets()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
//New Market data


//Active Market

export default MarketDetail;
